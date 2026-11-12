import { describe, expect, it } from 'vitest';
import { loadCollection } from './collection';
import { loadProgression } from './progression';
import { loadDeck } from './deck';
import { loadDeckLibrary } from './deckLibrary';
import { loadBattle } from './battleSession';

describe('save validation', () => {
  it('rejects malformed progression values while retaining valid progress', () => {
    localStorage.setItem('paw-claw.progression.v1', '{"coins":-20,"level":0,"gems":"900","wins":4}');
    expect(loadProgression()).toMatchObject({ coins: 1240, level: 1, gems: 120, wins: 4 });
  });
  it('retains only known card IDs and positive integer quantities', () => {
    localStorage.setItem('paw-claw.collection.v1', '{"mag-001":2,"mag-002":-1,"mag-003":1.5,"missing":100}');
    expect(loadCollection()).toEqual({ 'mag-001': 2 });
  });
  it('ignores malformed decks and battles without crashing the app', () => {
    localStorage.setItem('paw-claw.deck.active.v1', '{"version":1}');
    localStorage.setItem('paw-claw.deck.library.v1', '{"version":1,"decks":[null,{"id":"bad"}]}');
    localStorage.setItem('paw-claw.battle.active.v3', '{"version":3,"state":{"turn":1}}');
    expect(loadDeck()).toBeNull(); expect(loadDeckLibrary().decks).toEqual([]); expect(loadBattle()).toBeNull();
  });
});
