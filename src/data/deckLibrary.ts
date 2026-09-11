import type { SavedDeck } from './deck';
import type { Species } from './loreSynergies';

const KEY='paw-claw.deck.library.v1';
const ACTIVE_KEY='paw-claw.deck.library.active.v1';

export type DeckProfile=SavedDeck&{id:string;species:Species;favorite:boolean;createdAt:number};
export type DeckLibrary={version:1;decks:DeckProfile[]};

export function createDeckProfile(species:Species,name?:string):DeckProfile{
 const now=Date.now();
 return {version:1,id:`deck-${now}-${Math.random().toString(36).slice(2,7)}`,name:name??`Deck ${species}s`,species,favorite:false,cardIds:[],createdAt:now,updatedAt:now};
}

export function loadDeckLibrary():DeckLibrary{
 try{
  const raw=localStorage.getItem(KEY);
  if(raw){const parsed=JSON.parse(raw) as DeckLibrary;if(parsed.version===1&&Array.isArray(parsed.decks))return parsed}
 }catch{}
 return {version:1,decks:[]};
}
export function saveDeckLibrary(lib:DeckLibrary){try{localStorage.setItem(KEY,JSON.stringify(lib))}catch{}}
export function loadActiveDeckId(){try{return localStorage.getItem(ACTIVE_KEY)}catch{return null}}
export function saveActiveDeckId(id:string){try{localStorage.setItem(ACTIVE_KEY,id)}catch{}}
export function upsertDeck(lib:DeckLibrary,deck:DeckProfile):DeckLibrary{
 const exists=lib.decks.some(d=>d.id===deck.id);
 return {version:1,decks:exists?lib.decks.map(d=>d.id===deck.id?{...deck,updatedAt:Date.now()}:d):[...lib.decks,{...deck,updatedAt:Date.now()}]};
}
export function deleteDeck(lib:DeckLibrary,id:string):DeckLibrary{return {version:1,decks:lib.decks.filter(d=>d.id!==id)}}
export function toggleFavorite(lib:DeckLibrary,id:string):DeckLibrary{return {version:1,decks:lib.decks.map(d=>d.id===id?{...d,favorite:!d.favorite,updatedAt:Date.now()}:d)}}
