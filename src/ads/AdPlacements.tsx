import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { ads } from './admob';
import { AD_BONUS_COINS, dailyRewardKey } from './config';
import type { MonetizationState } from '../data/monetization';
import { GameAsset } from '../GameAsset';
import './ads.css';

type AdContextValue = { noAds: boolean; rewarded: boolean; claims: string[]; claim: (key: string) => void };
const AdContext = createContext<AdContextValue>({ noAds: true, rewarded: false, claims: [], claim: () => {} });
const useAds = () => useSyncExternalStore(ads.subscribe, ads.getSnapshot, ads.getSnapshot);

export function AdsProvider({ monetization, claims = [], onReward, children }: {
  monetization: MonetizationState; claims?: string[]; onReward: (key: string) => void; children: ReactNode;
}) {
  const { busy } = useAds();
  useEffect(() => { void ads.start(); }, []);
  return <AdContext.Provider value={{ noAds: monetization.noAds, rewarded: monetization.rewardedAdsEnabled, claims, claim: onReward }}>
    <div inert={busy || undefined}>{children}</div>
    {busy && <div className="ad-wait" role="status" aria-live="polite"><div><span className="ad-spinner" aria-hidden="true"/><p>Un instant…</p></div></div>}
  </AdContext.Provider>;
}

export function RewardedBonus({ rewardKey, title = 'Bonus de combat' }: { rewardKey: string; title?: string }) {
  const { supported, busy } = useAds();
  const { rewarded, claims, claim } = useContext(AdContext);
  const [message, setMessage] = useState('');
  const locked = useRef(false);
  const claimed = claims.includes(rewardKey);
  if (!supported || !rewarded) return null;
  async function watch() {
    if (locked.current || claimed) return;
    locked.current = true;
    setMessage('');
    try {
      const result = await ads.showReward(() => claim(rewardKey));
      setMessage(result === 'earned' ? `+${AD_BONUS_COINS} pièces ajoutées !` : result === 'dismissed'
        ? 'Vidéo fermée avant le bonus. Tu peux réessayer.' : 'Aucune vidéo disponible pour le moment. Réessaie plus tard.');
    } finally { locked.current = false; }
  }
  return <aside className="ad-bonus" aria-label={title}>
    <GameAsset assetId="icon.coins" decorative/>
    <div><strong>{title}</strong><p>Regarde une publicité pour recevoir {AD_BONUS_COINS} pièces.</p></div>
    <button disabled={busy || claimed} onClick={() => void watch()}>{claimed ? 'Bonus récupéré' : `Voir la vidéo · +${AD_BONUS_COINS} pièces`}</button>
    {message && <p className="ad-feedback" role="status">{message}</p>}
  </aside>;
}

export function DailyAdBonus() {
  const [key, setKey] = useState(dailyRewardKey);
  useEffect(() => { const timer = window.setInterval(() => setKey(dailyRewardKey()), 60_000); return () => window.clearInterval(timer); }, []);
  return <RewardedBonus key={key} rewardKey={key} title="Bonus vidéo du jour"/>;
}

export function BattleAdActions({ matchId, onContinue }: { matchId: string; onContinue: () => void }) {
  const { noAds } = useContext(AdContext);
  const { busy } = useAds();
  const transitioning = useRef(false);
  useEffect(() => { ads.recordMatch(matchId); void ads.preloadInterstitial(noAds); }, [matchId, noAds]);
  async function next() {
    if (transitioning.current || busy) return;
    transitioning.current = true;
    try { await ads.showBetweenMatches(noAds); onContinue(); }
    finally { transitioning.current = false; }
  }
  return <><RewardedBonus rewardKey={`battle:${matchId}`}/><button className="primary" disabled={busy} onClick={() => void next()}>Nouvelle partie</button></>;
}

export function AdPrivacyOptions() {
  const { supported, busy, privacyRequired } = useAds();
  const [error, setError] = useState(false);
  if (!supported || !privacyRequired) return null;
  return <div className="ad-privacy"><button disabled={busy} onClick={async () => setError(!await ads.privacyOptions())}>Choix de confidentialité publicitaire</button>
    {error && <p role="status">Les paramètres sont indisponibles. Réessaie plus tard.</p>}</div>;
}
