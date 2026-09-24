export const TEST_AD_UNITS = {
  android: { rewarded: 'ca-app-pub-3940256099942544/5224354917', interstitial: 'ca-app-pub-3940256099942544/1033173712' },
  ios: { rewarded: 'ca-app-pub-3940256099942544/1712485313', interstitial: 'ca-app-pub-3940256099942544/4411468910' },
};

export function adConfig(platform: string, env: Record<string, unknown>) {
  const native = platform === 'android' || platform === 'ios';
  // Live ads require an explicit opt-in, including in production web builds.
  const testing = env.DEV === true || env.VITE_ADMOB_MODE !== 'live';
  const prefix = platform === 'ios' ? 'IOS' : 'ANDROID';
  const units = testing ? TEST_AD_UNITS[platform === 'ios' ? 'ios' : 'android'] : {
    rewarded: String(env[`VITE_ADMOB_${prefix}_REWARDED_ID`] || ''),
    interstitial: String(env[`VITE_ADMOB_${prefix}_INTERSTITIAL_ID`] || ''),
  };
  const valid = (id: string) => /^ca-app-pub-\d{16}\/\d{10}$/.test(id);
  return { testing, units, enabled: native && env.VITE_ADMOB_ENABLED !== 'false' && valid(units.rewarded) && valid(units.interstitial) };
}

export const AD_BONUS_COINS = 50;
export const INTERSTITIAL_EVERY_MATCHES = 3;
export const INTERSTITIAL_COOLDOWN_MS = 180_000;
export const FIRST_INTERSTITIAL_DELAY_MS = 120_000;
export const dailyRewardKey = (date = new Date()) => `daily:${date.toISOString().slice(0, 10)}`;
