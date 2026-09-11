import type { CardData } from './gameCards';
import type { BoardCard } from './synergies';

export type Species='Chat'|'Chien';
export type LoreEffect='mutual-destruction'|'buff'|'debuff';
export type LoreBond={id:string;title:string;story:string;cardA:string;cardB:string;effect:LoreEffect;value?:number};

// Espèce déterminée par les personnages du roster. Les exceptions peuvent être complétées ici
// au fur et à mesure que les illustrations définitives sont validées.
const DOG_HINTS=['chien','canaille','protecteur','gardien','paladin','éclaireur'];
export function speciesOf(card:Pick<CardData,'name'>):Species{
 const n=card.name.toLowerCase();
 return DOG_HINTS.some(x=>n.includes(x))?'Chien':'Chat';
}

export const LORE_BONDS:LoreBond[]=[
 {id:'amour-interdit',title:'Amour interdit',story:'Deux combattants de camps opposés refusent de lever la patte l’un sur l’autre. Ils quittent immédiatement l’arène ensemble.',cardA:'omb-005',cardB:'hea-004',effect:'mutual-destruction'},
 {id:'serment-royal',title:'Serment royal',story:'Le Roi Karhl inspire la Reine Bienveillante : réunis, ils protègent leur royaume.',cardA:'nob-007',cardB:'nob-008',effect:'buff',value:1},
 {id:'rivalite-mecanique',title:'Rivalité mécanique',story:'Le Chien Paladin et le Chat Assassin se surpassent lorsqu’ils combattent côte à côte.',cardA:'rob-005',cardB:'rob-006',effect:'buff',value:1}
];

export function activeLoreBonds(board:(BoardCard|null)[]){
 const ids=new Set(board.filter(Boolean).map(c=>c!.id));
 return LORE_BONDS.filter(b=>ids.has(b.cardA)&&ids.has(b.cardB));
}

export function applyLoreOnBoard(board:(BoardCard|null)[]){
 let next=board.map(c=>c?{...c}:null);
 const triggered=activeLoreBonds(next);
 for(const bond of triggered){
   if(bond.effect==='mutual-destruction') next=next.map(c=>c&&(c.id===bond.cardA||c.id===bond.cardB)?null:c);
   if(bond.effect==='buff') next=next.map(c=>c&&(c.id===bond.cardA||c.id===bond.cardB)?{...c,atk:(c.atk??0)+(bond.value??1),hp:(c.hp??1)+(bond.value??1),currentHp:(c.currentHp??c.hp??1)+(bond.value??1)}:c);
   if(bond.effect==='debuff') next=next.map(c=>c&&(c.id===bond.cardA||c.id===bond.cardB)?{...c,atk:Math.max(0,(c.atk??0)-(bond.value??1))}:c);
 }
 return {board:next,triggered};
}
