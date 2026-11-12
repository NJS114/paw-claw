import { describe, expect, it } from 'vitest';
import { rivalDeck } from './opponentDeck';
import { validateDeck } from './deck';
import { cards } from './gameCards';
describe('rival deck fairness', () => {
  it.each(['Chat', 'Chien'] as const)('builds a legal 20-card %s rival', species => {
    const pool = rivalDeck(species);
    const owned: Record<string,number> = {};
    for (const card of pool) owned[card.id] = (owned[card.id] ?? 0) + 1;
    const validation = validateDeck({ version: 1, name: 'Rival', cardIds: pool.map(card=>card.id), updatedAt: 0 }, cards, owned);
    expect(pool).toHaveLength(20);
    expect(validation.valid, validation.issues.join(', ')).toBe(true);
    expect(validation.species).toBe(species);
  });
});
