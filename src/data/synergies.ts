import type { CardData } from './gameCards';

export type BoardCard = CardData & { currentHp?: number };
export type Side = { board:(BoardCard|null)[]; heroHp:number; energy:number };
export type Synergy = { id:string; title:string; description:string; active:boolean; tier:number };
export type SynergyProgress = { family:string; count:number; next:number|null; tier:0|1|2; label:string };

const alive=(b:(BoardCard|null)[])=>b.filter(Boolean) as BoardCard[];
export const familyCount=(b:(BoardCard|null)[],family:string)=>alive(b).filter(c=>c.family===family).length;

export const FAMILY_RULES:Record<string,[string,string]>={
  'Armée':['Formation','3: +1 ATK aux unités Armée. 5: +1 ATK supplémentaire et 1 point d’armure aux unités Armée.'],
  'Magiciens':['Convergence','3: +1 énergie au prochain tour. 5: la première carte jouée coûte 1 de moins.'],
  'Nobles':['Cour royale','3: toutes tes unités gagnent +1 PV max. 5: le héros gagne un bouclier de 3 en fin de tour.'],
  'Ombres':['Embuscade','3: +1 ATK aux unités Ombres. 5: les deux unités Ombres les plus faibles gagnent +2 ATK supplémentaires.'],
  'Robots':['Réseau','3: +1/+1 à la dernière unité Robot posée. 5: toutes les unités Robots gagnent +1/+1 supplémentaire.'],
  'Nature':['Meute sauvage','3: soigne 1 PV à toutes tes unités en fin de tour. 5: soigne aussi 2 PV au héros.'],
  'Éléments':['Réaction','3: 1 dégât au héros adverse en fin de tour. 5: 2 dégâts à la place.'],
  'Guérisseurs':['Sanctuaire','3: soigne 2 PV au héros en fin de tour. 5: la première unité qui devrait mourir reste à 1 PV, une fois par tour.'],
  'Pirates':['Butin','3: +1 énergie après avoir détruit au moins une unité. 5: pioche 1 carte après la première destruction du tour.'],
  'Créatures':['Instinct','3: les unités Créatures gagnent +1 PV. 5: +2 ATK aux Créatures ayant 50% de leurs PV ou moins.']
};

export function synergyProgress(side:Side):SynergyProgress[]{
  return Object.keys(FAMILY_RULES)
    .map(family=>{const count=familyCount(side.board,family);return {family,count,next:count<3?3:count<5?5:null,tier:(count>=5?2:count>=3?1:0) as 0|1|2,label:FAMILY_RULES[family][0]};})
    .filter(x=>x.count>0)
    .sort((a,b)=>b.count-a.count||a.family.localeCompare(b.family));
}

export function synergies(side:Side, enemy:Side):Synergy[]{
  const units=alive(side.board).length, foes=alive(enemy.board).length;
  const list:Synergy[]=[];
  for(const [family,[title,description]] of Object.entries(FAMILY_RULES)){
    const n=familyCount(side.board,family); if(n>=3) list.push({id:`family-${family}`,title:`${title} ${n>=5?'II':'I'}`,description,active:true,tier:n>=5?2:1});
  }
  if(side.heroHp<=10) list.push({id:'last-stand',title:'Dernier Souffle',description:'À 10 PV ou moins : +1 énergie par tour et la première unité posée gagne +1/+1.',active:true,tier:1});
  if(side.heroHp<=5) list.push({id:'clutch',title:'Instinct de Survie',description:'À 5 PV ou moins : une fois par partie, soigne 3 PV et pioche 1 carte.',active:true,tier:2});
  if(foes-units>=2) list.push({id:'outnumbered',title:'Dos au Mur',description:'Si l’adversaire a au moins 2 unités de plus : tes unités gagnent +1 ATK pendant le prochain combat.',active:true,tier:1});
  if(units===7) list.push({id:'full-board',title:'Meute Complète',description:'7 unités : +2 dégâts au héros adverse en fin de tour.',active:true,tier:2});
  return list;
}

function weakestShadows(side:Side){
  return alive(side.board)
    .filter(c=>c.family==='Ombres')
    .sort((a,b)=>(a.currentHp??a.hp??1)-(b.currentHp??b.hp??1)||(a.atk??0)-(b.atk??0))
    .slice(0,2)
    .map(c=>c.id);
}

export function attackBonus(side:Side,enemy:Side,card:BoardCard){
  let bonus=0; const n=familyCount(side.board,card.family);
  if(card.family==='Armée'&&n>=3) bonus+=n>=5?2:1;
  if(card.family==='Ombres'&&n>=3){
    bonus+=1;
    if(n>=5&&weakestShadows(side).includes(card.id)) bonus+=2;
  }
  if(card.family==='Créatures'&&n>=5&&(card.currentHp??card.hp??1)<=Math.ceil((card.hp??1)/2)) bonus+=2;
  if(alive(enemy.board).length-alive(side.board).length>=2) bonus+=1;
  return bonus;
}

export function armorBonus(side:Side,card:BoardCard){
  return card.family==='Armée'&&familyCount(side.board,'Armée')>=5?1:0;
}

export function turnEnergy(side:Side){return 5+(side.heroHp<=10?1:0)+(familyCount(side.board,'Magiciens')>=3?1:0)}
export function endTurnHeroDelta(side:Side){
  let heal=0,damage=0;
  const nature=familyCount(side.board,'Nature'), healers=familyCount(side.board,'Guérisseurs'), elements=familyCount(side.board,'Éléments');
  if(nature>=5) heal+=2; if(healers>=3) heal+=2; if(elements>=3) damage+=elements>=5?2:1;
  if(alive(side.board).length===7) damage+=2;
  return {heal,enemyDamage:damage};
}

export const comebackRules=[
  'Synergies à 3 cartes = bonus tactique ; à 5 cartes = bonus renforcé.',
  'Dernier Souffle à ≤10 PV : +1 énergie/tour et +1/+1 à la première pose.',
  'Instinct de Survie à ≤5 PV : une seule fois par partie, +3 PV et +1 pioche.',
  'Dos au Mur : avec 2 unités de retard, +1 ATK pour permettre un nettoyage de plateau.',
  'Meute Complète : remplir les 7 slots met une pression de +2 dégâts/tour.',
  'Les bonus de retard sont plafonnés : ils aident au comeback sans garantir la victoire.'
] as const;
