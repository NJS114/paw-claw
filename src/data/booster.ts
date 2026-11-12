import { cards,type CardData,type Rarity } from './gameCards';
import {BOOSTER_PACKS} from './boosterPacks';

function sample(pool:CardData[],count:number){
 const out:CardData[]=[];
 if(!pool.length)return out;
 for(let i=0;i<count;i++)out.push(pool[Math.floor(Math.random()*pool.length)]);
 return out;
}
function byRarity(pool:CardData[],rarity:Rarity){return pool.filter(c=>c.rarity===rarity)}

export type BoosterPull={cards:CardData[];legendary:boolean};
export function generateStandardBooster(packId:string=BOOSTER_PACKS[0].id):BoosterPull{
 const pack=BOOSTER_PACKS.find(choice=>choice.id===packId);
 const pool=pack?.family?cards.filter(card=>card.family===pack.family):cards;
 const result=[
  ...sample(byRarity(pool,'Commune'),8),
  ...sample(byRarity(pool,'Rare'),3),
 ];
 const legendary=Math.random()<0.15;
 const finisher=sample(byRarity(pool,legendary?'Légendaire':'Épique'),1);
 result.push(...finisher);
 return {cards:result,legendary};
}
