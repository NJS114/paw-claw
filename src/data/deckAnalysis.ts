import { cards } from './gameCards';
import { LORE_BONDS } from './loreSynergies';
import type { DeckProfile } from './deckLibrary';

export type DeckArchetype={name:string;style:string;score:number;strengths:string[];warnings:string[];thresholds:{family:string;count:number;tier:string}[];lore:string[]};

export function analyzeDeck(deck:Pick<DeckProfile,'cardIds'|'species'>):DeckArchetype{
 const list=deck.cardIds.map(id=>cards.find(c=>c.id===id)).filter(Boolean) as typeof cards;
 const familyCounts=list.reduce<Record<string,number>>((a,c)=>{a[c.family]=(a[c.family]||0)+1;return a},{});
 const sorted=Object.entries(familyCounts).sort((a,b)=>b[1]-a[1]);
 const top=sorted[0]?.[0]??'Libre';
 const avg=list.length?list.reduce((s,c)=>s+c.cost,0)/list.length:0;
 const low=list.filter(c=>c.cost<=2).length;
 const high=list.filter(c=>c.cost>=5).length;
 const style=low>=8?'Agressif':high>=6?'Contrôle':avg<=3.2?'Tempo':'Équilibré';
 const names:Record<string,string>={Ombres:'Ombres',Nature:'Nature',Robots:'Robots',Nobles:'Nobles',Magiciens:'Arcanes',Guérisseurs:'Sanctuaire',Pirates:'Pirates',Armée:'Armée',Éléments:'Éléments',Créatures:'Créatures'};
 const name=`${names[top]??top} ${style}`;
 const thresholds=sorted.filter(([,count])=>count>=2).slice(0,5).map(([family,count])=>({family,count,tier:count>=5?'5/5 actif':count>=3?'3/3 actif':'proche de 3/3'}));
 const ids=new Set(deck.cardIds);
 const lore=LORE_BONDS.filter(x=>ids.has(x.cardA)&&ids.has(x.cardB)).map(x=>x.title);
 const strengths:string[]=[];
 if(sorted[0]?.[1]>=5)strengths.push(`Synergie ${sorted[0][0]} 5/5 accessible`);
 else if(sorted[0]?.[1]>=3)strengths.push(`Synergie ${sorted[0][0]} 3/3 stable`);
 if(lore.length)strengths.push(`${lore.length} lien${lore.length>1?'s':''} d'histoire actif${lore.length>1?'s':''}`);
 if(low>=6)strengths.push('Début de partie rapide');
 if(high>=5)strengths.push('Bonne présence en fin de partie');
 const warnings:string[]=[];
 if(deck.cardIds.length<20)warnings.push('Deck incomplet');
 if(sorted.length>=6)warnings.push('Trop de familles différentes : synergies plus difficiles à atteindre');
 if(avg>4.2)warnings.push('Courbe de coût lourde');
 if(low<4)warnings.push('Peu de réponses en début de partie');
 let score=50;
 score+=Math.min(25,(sorted[0]?.[1]??0)*4);
 score+=Math.min(10,lore.length*5);
 score+=deck.cardIds.length===20?10:0;
 score-=warnings.length*5;
 score=Math.max(0,Math.min(100,score));
 return {name,style,score,strengths,warnings,thresholds,lore};
}
