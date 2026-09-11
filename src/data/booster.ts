import { cards,type CardData,type Rarity } from './gameCards';

function sample(pool:CardData[],count:number){
 const out:CardData[]=[];
 if(!pool.length)return out;
 for(let i=0;i<count;i++)out.push(pool[Math.floor(Math.random()*pool.length)]);
 return out;
}
function byRarity(rarity:Rarity){return cards.filter(c=>c.rarity===rarity)}

export type BoosterPull={cards:CardData[];legendary:boolean};
export function generateStandardBooster():BoosterPull{
 const result=[
  ...sample(byRarity('Commune'),8),
  ...sample(byRarity('Rare'),3),
 ];
 const legendary=Math.random()<0.15;
 const finisher=sample(byRarity(legendary?'Légendaire':'Épique'),1);
 result.push(...finisher);
 return {cards:result,legendary};
}
