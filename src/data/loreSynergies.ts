import type { CardData } from './gameCards';
import type { BoardCard } from './synergies';

export type Species='Chat'|'Chien';
export type LoreEffect='mutual-destruction'|'buff'|'debuff';
export type LoreScope='same-side'|'opponents';
export type LoreBond={id:string;title:string;story:string;cardA:string;cardB:string;effect:LoreEffect;scope:LoreScope;value?:number};

const SPECIES_BY_ID:Record<string,Species>={
 'omb-005':'Chien','hea-004':'Chat','nob-007':'Chat','nob-008':'Chien','rob-005':'Chien','rob-006':'Chat'
};
const DOG_HINTS=['chien','canaille','protecteur','gardien','paladin','éclaireur'];
export function speciesOf(card:Pick<CardData,'id'|'name'>):Species{
 const explicit=SPECIES_BY_ID[card.id];
 if(explicit)return explicit;
 const n=card.name.toLowerCase();
 return DOG_HINTS.some(x=>n.includes(x))?'Chien':'Chat';
}

export const LORE_BONDS:LoreBond[]=[
 {id:'amour-interdit',title:'Amour interdit',story:'Deux combattants de camps opposés refusent de lever la patte l’un sur l’autre. Ils quittent immédiatement l’arène ensemble.',cardA:'omb-005',cardB:'hea-004',effect:'mutual-destruction',scope:'opponents'},
 {id:'serment-royal',title:'Serment royal',story:'Le Roi Karhl inspire la Reine Bienveillante : réunis, ils protègent leur royaume.',cardA:'nob-007',cardB:'nob-008',effect:'buff',scope:'same-side',value:1},
 {id:'rivalite-mecanique',title:'Rivalité mécanique',story:'Le Chien Paladin et le Chat Assassin se surpassent lorsqu’ils combattent côte à côte.',cardA:'rob-005',cardB:'rob-006',effect:'buff',scope:'same-side',value:1}
];

const has=(board:(BoardCard|null)[],id:string)=>board.some(c=>c?.id===id);
const mutatePair=(board:(BoardCard|null)[],bond:LoreBond)=>board.map(c=>{
 if(!c||(c.id!==bond.cardA&&c.id!==bond.cardB))return c;
 if(bond.effect==='buff')return {...c,atk:(c.atk??0)+(bond.value??1),hp:(c.hp??1)+(bond.value??1),currentHp:(c.currentHp??c.hp??1)+(bond.value??1)};
 if(bond.effect==='debuff')return {...c,atk:Math.max(0,(c.atk??0)-(bond.value??1))};
 return null;
});

export function applySameSideLore(board:(BoardCard|null)[]){
 let next=board.map(c=>c?{...c}:null);
 const triggered=LORE_BONDS.filter(b=>b.scope==='same-side'&&has(next,b.cardA)&&has(next,b.cardB));
 for(const bond of triggered)next=mutatePair(next,bond);
 return {board:next,triggered};
}

export function applyOpponentLore(left:(BoardCard|null)[],right:(BoardCard|null)[]){
 let a=left.map(c=>c?{...c}:null),b=right.map(c=>c?{...c}:null);
 const triggered=LORE_BONDS.filter(x=>x.scope==='opponents'&&((has(a,x.cardA)&&has(b,x.cardB))||(has(a,x.cardB)&&has(b,x.cardA))));
 for(const bond of triggered){
   if(bond.effect==='mutual-destruction'){
     a=a.map(c=>c&&(c.id===bond.cardA||c.id===bond.cardB)?null:c);
     b=b.map(c=>c&&(c.id===bond.cardA||c.id===bond.cardB)?null:c);
   }else{
     a=mutatePair(a,bond);b=mutatePair(b,bond);
   }
 }
 return {left:a,right:b,triggered};
}

export function loreCardsForSpecies(cards:CardData[],species:Species){return cards.filter(c=>speciesOf(c)===species)}
