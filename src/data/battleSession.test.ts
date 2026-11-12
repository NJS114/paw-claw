import { describe, expect, it } from 'vitest';
import { cards } from './gameCards';
import { emptyBattleStats, loadBattle, saveBattle, type SavedBattle } from './battleSession';
import type { BattleSideState } from './battleEngine';

function side(): BattleSideState { return { board: Array(7).fill(null), heroHp: 20, energy: 5, hand: cards.slice(0, 5), deck: cards.slice(5, 20), shield: 0, momentum: 0, survivalUsed: false, pirateDrawUsed: false, healerSaveUsed: false, firstPlayDone: false }; }
export function savedDuel(): SavedBattle {
  const state = { player: side(), enemy: side(), turn: 3, log: ['Tour 3'] };
  return { version: 3, startedAt: 1000, updatedAt: 2000, maxMomentum: 0, stats: emptyBattleStats(), phase: 'player', checkpoint: 'stable-player', checkpointState: state, state };
}
describe('interrupted duel recovery', () => {
  it.each(['enemy', 'combat'] as const)('returns an interrupted %s phase to its last playable checkpoint', phase => {
    const saved = savedDuel();
    saveBattle({ ...saved, phase, state: { ...saved.state, player: { ...saved.state.player, heroHp: 8 } } });
    const restored = loadBattle();
    expect(restored?.phase).toBe('player');
    expect(restored?.state.player.heroHp).toBe(20);
    expect(restored?.state.turn).toBe(3);
  });
});
