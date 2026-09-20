import type { Progression } from "./progression";

export const ECONOMY = {
  standardBoosterCoins: 400,
  premiumBoosterGems: 120,
  winCoins: 60,
  drawCoins: 30,
  lossCoins: 20,
  winGems: 0,
  rewardedAdCoins: 50,
  battlePassPremiumGems: 600,
} as const;

export function grantMatchRewards(
  p: Progression,
  result: "win" | "lose",
): Progression {
  const coins = result === "win" ? ECONOMY.winCoins : ECONOMY.lossCoins;
  const gems = result === "win" ? ECONOMY.winGems : 0;
  return { ...p, coins: p.coins + coins, gems: p.gems + gems };
}

export function spendGems(p: Progression, amount: number): Progression | null {
  if (amount < 0 || p.gems < amount) return null;
  return { ...p, gems: p.gems - amount };
}
