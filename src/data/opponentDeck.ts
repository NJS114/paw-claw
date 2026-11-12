import { cards, type CardData } from './gameCards';
import { DECK_SIZE } from './deck';
import { speciesOf, type Species } from './loreSynergies';
import { rarityCopyLimit } from './rarityBalance';

/** The rival obeys the same size, species and rarity copy limits as the player. */
export function rivalDeck(species: Species): CardData[] {
  const candidates = cards.filter(card => card.type === 'Héros' && speciesOf(card) === species);
  const result: CardData[] = [];
  for (let copy = 0; copy < 3; copy++) {
    for (const card of candidates) {
      if (copy < rarityCopyLimit(card)) result.push(card);
      if (result.length === DECK_SIZE) return result;
    }
  }
  throw new Error(`Le catalogue ne permet pas de construire un deck ${species} légal.`);
}
