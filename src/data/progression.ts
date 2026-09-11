export type Progression = {
  coins: number;
  xp: number;
  level: number;
  wins: number;
  losses: number;
  boostersOpened: number;
  sealedBoosters: number;
};

const KEY = 'paw-claw.progression.v1';
const initial: Progression = { coins: 1240, xp: 0, level: 1, wins: 0, losses: 0, boostersOpened: 0, sealedBoosters: 1 };

export function loadProgression(): Progression {
  try { return { ...initial, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; }
  catch { return initial; }
}
export function saveProgression(p: Progression) { localStorage.setItem(KEY, JSON.stringify(p)); }
export function xpForLevel(level: number) { return 100 + (level - 1) * 50; }
export function addXp(p: Progression, amount: number): Progression {
  let xp = p.xp + amount;
  let level = p.level;
  while (xp >= xpForLevel(level)) { xp -= xpForLevel(level); level++; }
  return { ...p, xp, level };
}
export function battleVictory(p: Progression): Progression {
  return addXp({ ...p, coins: p.coins + 80, wins: p.wins + 1 }, 60);
}
export function buyBooster(p: Progression, price = 100): Progression | null {
  if (p.coins < price) return null;
  return { ...p, coins: p.coins - price, sealedBoosters: p.sealedBoosters + 1 };
}
export function openBooster(p: Progression): Progression | null {
  if (p.sealedBoosters <= 0) return null;
  return { ...p, sealedBoosters: p.sealedBoosters - 1, boostersOpened: p.boostersOpened + 1 };
}
