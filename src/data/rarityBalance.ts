import type { CardData, Rarity } from './gameCards';

export type RarityRule={
  rank:number;
  maxCopies:number;
  aiPriority:number;
  targetBonus:number;
  label:string;
};

export const RARITY_RULES:Record<Rarity,RarityRule>={
  Commune:{rank:1,maxCopies:3,aiPriority:0,targetBonus:0,label:'Fondation'},
  Rare:{rank:2,maxCopies:2,aiPriority:.45,targetBonus:1,label:'Spécialiste'},
  Épique:{rank:3,maxCopies:2,aiPriority:.9,targetBonus:2,label:'Élite'},
  Légendaire:{rank:4,maxCopies:1,aiPriority:1.45,targetBonus:3,label:'Unique'}
};

export function rarityRule(rarity:Rarity){return RARITY_RULES[rarity]}
export function rarityCopyLimit(card:Pick<CardData,'rarity'>){return rarityRule(card.rarity).maxCopies}
export function rarityAIPriority(card:Pick<CardData,'rarity'>){return rarityRule(card.rarity).aiPriority}

/**
 * Budget de stats indicatif utilisé pour le balancing, pas comme buff caché.
 * Une carte plus rare peut dépasser légèrement la courbe d'une carte commune,
 * mais son coût et sa limite de copies empêchent la rareté de décider seule d'un duel.
 */
export function targetStatBudget(card:Pick<CardData,'cost'|'rarity'>){
  return Math.max(3,card.cost*2+1+rarityRule(card.rarity).targetBonus);
}

export function cardStatBudget(card:Pick<CardData,'atk'|'hp'>){return (card.atk??0)+(card.hp??0)}
export function rarityBalanceDelta(card:Pick<CardData,'cost'|'rarity'|'atk'|'hp'>){return cardStatBudget(card)-targetStatBudget(card)}

export function rarityPowerLabel(card:Pick<CardData,'cost'|'rarity'|'atk'|'hp'>){
  const delta=rarityBalanceDelta(card);
  if(delta>=2)return 'Au-dessus de la courbe';
  if(delta<=-2)return 'Sous la courbe';
  return 'Équilibrée';
}
