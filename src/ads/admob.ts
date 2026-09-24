import { Capacitor } from '@capacitor/core';
import { AdMob, AdmobConsentStatus, MaxAdContentRating,
  RewardAdPluginEvents as Reward, InterstitialAdPluginEvents as Interstitial,
  type AdMobPlugin, type AdmobConsentInfo } from '@capacitor-community/admob';
import { adConfig, FIRST_INTERSTITIAL_DELAY_MS, INTERSTITIAL_COOLDOWN_MS, INTERSTITIAL_EVERY_MATCHES } from './config';

type Config = ReturnType<typeof adConfig>;
export type AdOutcome = 'earned' | 'dismissed' | 'unavailable' | 'busy';
type Snapshot = { supported: boolean; busy: boolean; privacyRequired: boolean };
const LOAD_TIMEOUT = 15_000;
const AD_MAX_AGE = 55 * 60_000;
const LAST_AD_KEY = 'paw-claw.ads.last-shown.v1';

function withTimeout<T>(promise: Promise<T>, ms = LOAD_TIMEOUT): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('AdMob request timed out')), ms);
    promise.then(value => { clearTimeout(timer); resolve(value); }, error => { clearTimeout(timer); reject(error); });
  });
}

export class AdService {
  private snapshot: Snapshot;
  private subscribers = new Set<() => void>();
  private startup?: Promise<boolean>;
  private consent = false;
  private initialized = false;
  private interstitialReadyAt = 0;
  private interstitialLoad?: Promise<void>;
  private generation = 0;
  private startedAt: number;
  private lastAdAt = 0;
  private completed = new Set<string>();
  private matchesSinceAd = 0;

  constructor(private sdk: AdMobPlugin, private config: Config, private now = Date.now) {
    this.startedAt = now();
    try { const saved = Number(localStorage.getItem(LAST_AD_KEY)); if (Number.isFinite(saved) && saved > 0) this.lastAdAt = saved; } catch { /* Storage may be disabled. */ }
    this.snapshot = { supported: config.enabled, busy: false, privacyRequired: false };
  }
  getSnapshot = () => this.snapshot;
  subscribe = (listener: () => void) => { this.subscribers.add(listener); return () => { this.subscribers.delete(listener); }; };
  private update(patch: Partial<Snapshot>) { this.snapshot = { ...this.snapshot, ...patch }; this.subscribers.forEach(fn => fn()); }
  private updateConsent(info: AdmobConsentInfo) {
    this.consent = info.canRequestAds === true;
    this.update({ privacyRequired: info.privacyOptionsRequirementStatus === 'REQUIRED' });
  }
  async start() {
    if (!this.config.enabled || this.snapshot.busy) return;
    this.update({ busy: true });
    try { await this.initialize(); }
    finally { this.update({ busy: false }); }
  }
  async initialize(): Promise<boolean> {
    if (!this.config.enabled) return false;
    if (this.startup) return this.startup;
    this.startup = (async () => {
      try {
        if (!this.initialized) {
          await withTimeout(this.sdk.initialize({ initializeForTesting: this.config.testing, maxAdContentRating: MaxAdContentRating.General }));
          this.initialized = true;
        }
        let info = await withTimeout(this.sdk.requestConsentInfo());
        // Do not time out while the player is reading a consent form.
        if (info.status === AdmobConsentStatus.REQUIRED && info.isConsentFormAvailable) info = await this.sdk.showConsentForm();
        this.updateConsent(info);
        return this.consent;
      } catch { this.consent = false; return false; }
    })();
    const ready = await this.startup;
    if (!ready) this.startup = undefined; // Retry after an offline launch.
    return ready;
  }
  async privacyOptions(): Promise<boolean> {
    if (!this.config.enabled || this.snapshot.busy || !this.snapshot.privacyRequired) return false;
    this.update({ busy: true });
    this.generation++;
    this.interstitialReadyAt = 0;
    this.consent = false;
    this.startup = undefined;
    try {
      await this.sdk.showPrivacyOptionsForm();
      this.updateConsent(await withTimeout(this.sdk.requestConsentInfo()));
      this.startup = Promise.resolve(this.consent);
      return true;
    } catch { return false; }
    finally { this.update({ busy: false }); }
  }
  recordMatch(id: string) {
    if (this.completed.has(id)) return;
    this.completed.add(id);
    this.matchesSinceAd++;
  }
  async preloadInterstitial(noAds: boolean): Promise<void> {
    if (!this.config.enabled || noAds || this.snapshot.busy) return;
    if (this.interstitialLoad) return this.interstitialLoad;
    if (this.interstitialReadyAt && this.now() - this.interstitialReadyAt < AD_MAX_AGE) return;
    const generation = this.generation;
    this.interstitialLoad = (async () => {
      try {
        if (!await this.initialize()) return;
        await withTimeout(this.sdk.prepareInterstitial({ adId: this.config.units.interstitial, isTesting: this.config.testing, immersiveMode: true }));
        if (generation === this.generation && this.consent) this.interstitialReadyAt = this.now();
      } catch { this.interstitialReadyAt = 0; }
    })();
    await this.interstitialLoad;
    this.interstitialLoad = undefined;
  }
  async showBetweenMatches(noAds: boolean): Promise<AdOutcome> {
    const now = this.now();
    // Never wait for a load at a transition: a late ad must not interrupt play.
    if (noAds || !this.config.enabled || !this.consent || this.snapshot.busy ||
        this.matchesSinceAd < INTERSTITIAL_EVERY_MATCHES || now - this.startedAt < FIRST_INTERSTITIAL_DELAY_MS ||
        (this.lastAdAt && now - this.lastAdAt < INTERSTITIAL_COOLDOWN_MS) ||
        !this.interstitialReadyAt || now - this.interstitialReadyAt > AD_MAX_AGE) return 'unavailable';
    this.interstitialReadyAt = 0;
    this.update({ busy: true });
    try { return await this.present(false); }
    finally { this.update({ busy: false }); }
  }
  async showReward(onEarned: () => void): Promise<AdOutcome> {
    if (!this.config.enabled) return 'unavailable';
    if (this.snapshot.busy) return 'busy';
    this.update({ busy: true });
    try {
      if (!await this.initialize()) return 'unavailable';
      await withTimeout(this.sdk.prepareRewardVideoAd({ adId: this.config.units.rewarded, isTesting: this.config.testing, immersiveMode: true }));
      return await this.present(true, onEarned);
    } catch { return 'unavailable'; }
    finally { this.update({ busy: false }); }
  }
  private async present(rewarded: boolean, onEarned?: () => void): Promise<AdOutcome> {
    const handles: { remove: () => Promise<void> }[] = [];
    let done = false, earned = false, shown = false;
    let resolve!: (outcome: AdOutcome) => void;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const result = new Promise<AdOutcome>(res => { resolve = res; });
    const finish = (outcome: AdOutcome) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      resolve(outcome);
    };
    const onShown = () => {
      if (done) return;
      shown = true;
      clearTimeout(timer); // A playing ad may legitimately last longer than a network timeout.
      this.lastAdAt = this.now();
      try { localStorage.setItem(LAST_AD_KEY, String(this.lastAdAt)); } catch { /* Keep the in-memory cooldown. */ }
      this.matchesSinceAd = 0;
    };
    const reward = () => {
      if (done || earned) return;
      earned = true;
      onShown();
      onEarned?.(); // One source of truth: the native Rewarded event, never Dismissed.
    };
    const dismissed = () => {
      if (shown) {
        this.lastAdAt = this.now();
        try { localStorage.setItem(LAST_AD_KEY, String(this.lastAdAt)); } catch { /* Keep the in-memory cooldown. */ }
      }
      finish(earned ? 'earned' : 'dismissed');
    };
    try {
      if (rewarded) {
        handles.push(await this.sdk.addListener(Reward.Rewarded, reward));
        handles.push(await this.sdk.addListener(Reward.Showed, onShown));
        handles.push(await this.sdk.addListener(Reward.Dismissed, dismissed));
        handles.push(await this.sdk.addListener(Reward.FailedToShow, () => finish('unavailable')));
      } else {
        handles.push(await this.sdk.addListener(Interstitial.Showed, onShown));
        handles.push(await this.sdk.addListener(Interstitial.Dismissed, dismissed));
        handles.push(await this.sdk.addListener(Interstitial.FailedToShow, () => finish('unavailable')));
      }
      timer = setTimeout(() => finish('unavailable'), LOAD_TIMEOUT);
      const show = rewarded ? this.sdk.showRewardVideoAd() : this.sdk.showInterstitial();
      // Native rewarded promises can resolve before dismissal, or stay pending on early close.
      void show.catch(() => { if (!earned) finish('unavailable'); });
      return await result;
    } catch { return 'unavailable'; }
    finally {
      done = true;
      clearTimeout(timer);
      await Promise.allSettled(handles.map(handle => handle.remove()));
    }
  }
}

export const ads = new AdService(AdMob, adConfig(Capacitor.getPlatform(), import.meta.env));
