import { cards, type CardData } from "./gameCards";

export type OwnedCards = Record<string, number>;
const KEY = "paw-claw.collection.v1";

export function starterCollection(): OwnedCards {
  return Object.fromEntries(
    cards
      .filter((c) => c.rarity === "Commune")
      .slice(0, 16)
      .map((c) => [c.id, 1]),
  );
}

export function loadCollection(): OwnedCards {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : starterCollection();
  } catch {
    return starterCollection();
  }
}

export function saveCollection(value: OwnedCards) {
  localStorage.setItem(KEY, JSON.stringify(value));
}
export function addCards(owned: OwnedCards, pulled: CardData[]): OwnedCards {
  const next = { ...owned };
  for (const card of pulled) next[card.id] = (next[card.id] ?? 0) + 1;
  return next;
}
const COPY_CAP = { Commune: 4, Rare: 3, Épique: 2, Légendaire: 1 } as const;
const ESSENCE_VALUE = {
  Commune: 10,
  Rare: 25,
  Épique: 60,
  Légendaire: 150,
} as const;
export function addCardsWithEssence(owned: OwnedCards, pulled: CardData[]) {
  const next = { ...owned };
  let essence = 0;
  for (const card of pulled) {
    const copies = next[card.id] ?? 0;
    if (copies >= COPY_CAP[card.rarity]) essence += ESSENCE_VALUE[card.rarity];
    else next[card.id] = copies + 1;
  }
  return { owned: next, essence };
}
export function ownedCount(owned: OwnedCards) {
  return Object.values(owned).reduce((a, b) => a + b, 0);
}
