import type {Species} from './loreSynergies';

/** Display names only: keep saved decks and battle species identifiers compatible. */
export const FACTIONS = {
 Chat: {name: 'Moustaches', title: 'Les Moustaches', motto: 'Petites pattes, grandes idées.', hero: 'lobby.hero-cat'},
 Chien: {name: 'Truffes', title: 'Les Truffes', motto: 'Du courage et un grand cœur.', hero: 'lobby.hero-dog'},
} as const;
export function factionName(species: Species) { return FACTIONS[species].name; }
export function displayDeckName(name: string) {
 return name === 'Deck Chats' ? 'Deck Moustaches' : name === 'Deck Chiens' ? 'Deck Truffes' : name;
}
