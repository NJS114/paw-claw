import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AdmobConsentStatus, RewardAdPluginEvents as Reward, InterstitialAdPluginEvents as Interstitial, type AdMobPlugin, type AdmobConsentInfo } from '@capacitor-community/admob';
import { AdService } from '../ads/admob';
import { adConfig, TEST_AD_UNITS } from '../ads/config';
import { claimAdBonus, loadProgression, saveProgression } from './progression';

function harness(platform = 'android') {
  const listeners = new Map<string, Set<() => void>>();
  const consent = { status: AdmobConsentStatus.OBTAINED, canRequestAds: true, privacyOptionsRequirementStatus: 'REQUIRED', isConsentFormAvailable: true } as AdmobConsentInfo;
  const mock = {
    initialize: vi.fn().mockResolvedValue(undefined), requestConsentInfo: vi.fn().mockResolvedValue(consent),
    showConsentForm: vi.fn().mockResolvedValue(consent), showPrivacyOptionsForm: vi.fn().mockResolvedValue(undefined),
    prepareRewardVideoAd: vi.fn().mockResolvedValue({}), prepareInterstitial: vi.fn().mockResolvedValue({}),
    showRewardVideoAd: vi.fn().mockResolvedValue({ amount: 1, type: 'test' }), showInterstitial: vi.fn().mockResolvedValue(undefined),
    addListener: vi.fn(async (name: string, fn: () => void) => {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name)!.add(fn);
      return { remove: vi.fn(async () => { listeners.get(name)!.delete(fn); }) };
    }),
  };
  const service = new AdService(mock as unknown as AdMobPlugin, adConfig(platform, {}));
  return { service, mock, consent, emit: (name: string) => listeners.get(name)?.forEach(fn => fn()), listenerCount: () => [...listeners.values()].reduce((n, set) => n + set.size, 0) };
}
const flush = () => vi.advanceTimersByTimeAsync(0);
beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date('2026-09-19T10:00:00Z')); });
afterEach(() => { vi.useRealTimers(); });

describe('Native AdMob integration', () => {
  it('does not call the native SDK or grant pretend rewards on the web', async () => {
    const h = harness('web'), reward = vi.fn();
    await h.service.start();
    expect(await h.service.showReward(reward)).toBe('unavailable');
    expect(h.mock.initialize).not.toHaveBeenCalled(); expect(reward).not.toHaveBeenCalled();
  });
  it('waits for UMP before making any ad request', async () => {
    const h = harness();
    h.mock.requestConsentInfo.mockResolvedValue({ ...h.consent, status: AdmobConsentStatus.REQUIRED });
    h.mock.showConsentForm.mockResolvedValue({ ...h.consent, canRequestAds: false });
    expect(await h.service.showReward(vi.fn())).toBe('unavailable');
    expect(h.mock.showConsentForm).toHaveBeenCalledOnce();
    expect(h.mock.prepareRewardVideoAd).not.toHaveBeenCalled();
  });
  it('allows a retry after an offline consent request', async () => {
    const h = harness(); h.mock.requestConsentInfo.mockRejectedValueOnce(new Error('offline'));
    expect(await h.service.initialize()).toBe(false);
    expect(await h.service.initialize()).toBe(true);
    expect(h.mock.initialize).toHaveBeenCalledOnce();
  });
  it('ignores the show promise for rewards, grants one native reward, and stays busy until dismissal', async () => {
    const h = harness(), reward = vi.fn();
    const result = h.service.showReward(reward); await flush();
    expect(reward).not.toHaveBeenCalled();
    expect(await h.service.showReward(reward)).toBe('busy');
    h.emit(Reward.Showed); h.emit(Reward.Rewarded); h.emit(Reward.Rewarded);
    expect(reward).toHaveBeenCalledOnce(); expect(h.service.getSnapshot().busy).toBe(true);
    h.emit(Reward.Dismissed); expect(await result).toBe('earned');
    expect(h.listenerCount()).toBe(0); expect(h.service.getSnapshot().busy).toBe(false);
  });
  it('grants nothing on early close and allows another attempt', async () => {
    const h = harness(), reward = vi.fn();
    const result = h.service.showReward(reward); await flush(); h.emit(Reward.Showed); h.emit(Reward.Dismissed);
    expect(await result).toBe('dismissed'); expect(reward).not.toHaveBeenCalled();
    const retry = h.service.showReward(reward); await flush(); h.emit(Reward.FailedToShow);
    expect(await retry).toBe('unavailable'); expect(h.listenerCount()).toBe(0);
  });
  it('times out a load without showing a late ad or blocking the game', async () => {
    const h = harness(); let finish!: () => void;
    h.mock.prepareRewardVideoAd.mockImplementation(() => new Promise<void>(resolve => { finish = resolve; }));
    const result = h.service.showReward(vi.fn()); await flush(); await vi.advanceTimersByTimeAsync(15_001);
    expect(await result).toBe('unavailable'); expect(h.service.getSnapshot().busy).toBe(false);
    finish(); await flush(); expect(h.mock.showRewardVideoAd).not.toHaveBeenCalled();
  });
  it('never cuts off a long video once shown', async () => {
    const h = harness(), reward = vi.fn(); const result = h.service.showReward(reward); await flush(); h.emit(Reward.Showed);
    await vi.advanceTimersByTimeAsync(90_000); expect(h.service.getSnapshot().busy).toBe(true);
    h.emit(Reward.Rewarded); h.emit(Reward.Dismissed); expect(await result).toBe('earned');
  });
  it('only shows a prepared interstitial at a transition after three distinct matches and respects cooldown/no-ads', async () => {
    const h = harness(); await h.service.preloadInterstitial(false);
    h.service.recordMatch('1'); h.service.recordMatch('1'); h.service.recordMatch('2');
    await vi.advanceTimersByTimeAsync(120_001);
    expect(await h.service.showBetweenMatches(false)).toBe('unavailable');
    h.service.recordMatch('3');
    expect(await h.service.showBetweenMatches(true)).toBe('unavailable');
    const result = h.service.showBetweenMatches(false); await flush();
    h.emit(Interstitial.Showed); expect(h.service.getSnapshot().busy).toBe(true);
    h.emit(Interstitial.Dismissed); expect(await result).toBe('dismissed');
    await h.service.preloadInterstitial(false); ['4','5','6'].forEach(id => h.service.recordMatch(id));
    expect(await h.service.showBetweenMatches(false)).toBe('unavailable');
    await vi.advanceTimersByTimeAsync(180_001);
    const next = h.service.showBetweenMatches(false); await flush(); h.emit(Interstitial.Dismissed);
    expect(await next).toBe('dismissed');
  });
  it('skips unloaded interstitials instead of loading during the next game', async () => {
    const h = harness(); await h.service.initialize(); ['1','2','3'].forEach(id => h.service.recordMatch(id));
    await vi.advanceTimersByTimeAsync(180_001);
    expect(await h.service.showBetweenMatches(false)).toBe('unavailable');
    expect(h.mock.prepareInterstitial).not.toHaveBeenCalled(); expect(h.mock.showInterstitial).not.toHaveBeenCalled();
  });
  it('drops prepared ads when privacy choices change or cannot be refreshed', async () => {
    const h = harness(); await h.service.preloadInterstitial(false);
    h.mock.requestConsentInfo.mockResolvedValue({ ...h.consent, canRequestAds: false });
    expect(await h.service.privacyOptions()).toBe(true);
    ['1','2','3'].forEach(id => h.service.recordMatch(id)); await vi.advanceTimersByTimeAsync(180_001);
    expect(await h.service.showBetweenMatches(false)).toBe('unavailable');
    expect(h.mock.showInterstitial).not.toHaveBeenCalled();
  });
  it('uses platform demo IDs by default and rejects incomplete live configuration', () => {
    expect(adConfig('ios', {}).units).toEqual(TEST_AD_UNITS.ios);
    expect(adConfig('android', { VITE_ADMOB_MODE: 'live' }).enabled).toBe(false);
    expect(adConfig('android', { DEV: true, VITE_ADMOB_MODE: 'live' }).testing).toBe(true);
    expect(adConfig('android', { VITE_ADMOB_ENABLED: 'false' }).enabled).toBe(false);
  });
  it('persists a bonus and its receipt together, preventing duplicate rewards after reload', () => {
    const before = loadProgression(), rewarded = claimAdBonus(before, 'daily:2026-09-19', 50);
    saveProgression(rewarded);
    expect(claimAdBonus(loadProgression(), 'daily:2026-09-19', 50).coins).toBe(before.coins + 50);
    expect(claimAdBonus(rewarded, 'battle:42', 50).coins).toBe(before.coins + 100);
  });
  it('keeps the daily bonus claimed even after a long sequence of rewarded matches', () => {
    let progress = claimAdBonus(loadProgression(), 'daily:2026-09-19', 50);
    for (let i = 0; i < 210; i++) progress = claimAdBonus(progress, `battle:${i}`, 50);
    expect(claimAdBonus(progress, 'daily:2026-09-19', 50).coins).toBe(progress.coins);
  });
});
