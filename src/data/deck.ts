import type { CardData } from './gameCards';
import type { OwnedCards } from './collection';
import { rarityCopyLimit } from './rarityBalance';

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
  const ids:string[]=[];
  for(const card of cards){
    if(card.type!=='Héros')continue;
    const copies=Math.min(owned[card.id]??0,rarityCopyLimit(card));
    for(let i=0;i<copies&&ids.length<DECK_SIZE;i++)ids.push(card.id);
    if(ids.length>=DECK_SIZE)break;
  }
  return {version:1,name:'Deck principal',cardIds:ids,updatedAt:Date.now()};
}

export function validateDeck(deck:SavedDeck,cards:CardData[],owned:OwnedCards){
  const cardMap=new Map(cards.map(c=>[c.id,c]));
  const counts=new Map<string,number>();
  const validIds:string[]=[];
  const issues:string[]=[];

  for(const id of deck.cardIds.slice(0,DECK_SIZE)){
    const card=cardMap.get(id);
    if(!card||card.type!=='Héros')continue;
    const next=(counts.get(id)??0)+1;
    const ownedCopies=owned[id]??0;
    const rarityLimit=rarityCopyLimit(card);
    if(next>ownedCopies){
      if(!issues.includes(`${card.name} : seulement ${ownedCopies} exemplaire${ownedCopies>1?'s':''} possédé${ownedCopies>1?'s':''}.`))issues.push(`${card.name} : seulement ${ownedCopies} exemplaire${ownedCopies>1?'s':''} possédé${ownedCopies>1?'s':''}.`);
      continue;
    }
    if(next>rarityLimit){
      if(!issues.includes(`${card.name} : maximum ${rarityLimit} exemplaire${rarityLimit>1?'s':''} pour une carte ${card.rarity.toLowerCase()}.`))issues.push(`${card.name} : maximum ${rarityLimit} exemplaire${rarityLimit>1?'s':''} pour une carte ${card.rarity.toLowerCase()}.`);
      continue;
    }
    counts.set(id,next);
    validIds.push(id);
  }

  if(validIds.length<DECK_SIZE)issues.push(`Ajoute ${DECK_SIZE-validIds.length} carte${DECK_SIZE-validIds.length>1?'s':''} pour atteindre ${DECK_SIZE}.`);
  return {valid:validIds.length===DECK_SIZE&&issues.length===0,cardIds:validIds,issues};
}

export function deckCards(deck:SavedDeck,cards:CardData[],owned:OwnedCards){
  const validation=validateDeck(deck,cards,owned);
  return validation.cardIds.map(id=>cards.find(c=>c.id===id)).filter(Boolean) as CardData[];
}
