import type { CardData } from './gameCards';
import type { OwnedCards } from './collection';

const DECK_KEY='paw-claw.deck.active.v1';
export const DECK_SIZE=20;

export type SavedDeck={version:1;name:string;cardIds:string[];updatedAt:number};

export function loadDeck():SavedDeck|null{
  try{
    const raw=localStorage.getItem(DECK_KEY);
    if(!raw)return null;
    const parsed=JSON.parse(raw) as SavedDeck;
    return parsed.version===1?parsed:null;
  }catch{return null}
}

export function saveDeck(deck:SavedDeck){
  localStorage.setItem(DECK_KEY,JSON.stringify({...deck,updatedAt:Date.now()}));
}

export function starterDeck(cards:CardData[],owned:OwnedCards):SavedDeck{
  const ids=cards.filter(c=>c.type==='Héros'&&(owned[c.id]??0)>0).slice(0,DECK_SIZE).map(c=>c.id);
  return {version:1,name:'Deck principal',cardIds:ids,updatedAt:Date.now()};
}

export function validateDeck(deck:SavedDeck,cards:CardData[],owned:OwnedCards){
  const cardMap=new Map(cards.map(c=>[c.id,c]));
  const validIds=deck.cardIds.filter(id=>{
    const card=cardMap.get(id);
    return !!card&&card.type==='Héros'&&(owned[id]??0)>0;
  }).slice(0,DECK_SIZE);
  const issues:string[]=[];
  if(validIds.length<DECK_SIZE)issues.push(`Ajoute ${DECK_SIZE-validIds.length} carte${DECK_SIZE-validIds.length>1?'s':''} pour atteindre ${DECK_SIZE}.`);
  return {valid:validIds.length===DECK_SIZE,cardIds:validIds,issues};
}

export function deckCards(deck:SavedDeck,cards:CardData[],owned:OwnedCards){
  const validation=validateDeck(deck,cards,owned);
  return validation.cardIds.map(id=>cards.find(c=>c.id===id)).filter(Boolean) as CardData[];
}
