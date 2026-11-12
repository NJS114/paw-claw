import { cards, type CardData } from './gameCards';
import { DECK_SIZE } from './deck';
import { speciesOf } from './loreSynergies';

export type OwnedCards = Record<string, number>;
const KEY = 'paw-claw.collection.v1';

/**
 * New players need a legal 20-card deck before their first battle.
 * Prefer different common Cat heroes; only add duplicates when the
 * catalogue does not contain enough unique starters.
 * Existing collections are never changed by this function.
 */
export function starterCollection(): OwnedCards {
  const candidates = cards.filter(card => card.type === 'Héros' && card.rarity === 'Commune' && speciesOf(card) === 'Chat');
  const owned: OwnedCards = {};
  let remaining = DECK_SIZE;
  for (let copy = 0; copy < 3 && remaining > 0; copy++) {
    for (const card of candidates) {
      if (remaining === 0) break;
      owned[card.id] = (owned[card.id] ?? 0) + 1;
      remaining--;
    }
  }
  return owned;
}

export function loadCollection(): OwnedCards {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : starterCollection();
  } catch { return starterCollection(); }
}

export function saveCollection(value: OwnedCards) { localStorage.setItem(KEY, JSON.stringify(value)); }
export function addCards(owned: OwnedCards, pulled: CardData[]): OwnedCards {
  const next = { ...owned };
  for (const card of pulled) next[card.id] = (next[card.id] ?? 0) + 1;
  return next;
}
export function ownedCount(owned: OwnedCards) { return Object.values(owned).reduce((a,b) => a + b, 0); }
