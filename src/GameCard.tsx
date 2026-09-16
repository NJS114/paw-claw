import { CardArtwork } from './CardArtwork';
import type { CardData } from './data/gameCards';

export type GameCardVariant='compact'|'standard'|'battle'|'feature';

type Props={
 card:CardData;
 variant?:GameCardVariant;
 currentHp?:number;
 copies?:number;
 statusBadge?:string;
 locked?:boolean;
 atkBonus?:number;
 hpBonus?:number;
 className?:string;
};

export function GameCard({card,variant='standard',currentHp,copies,statusBadge,locked=false,atkBonus=0,hpBonus=0,className=''}:Props){
 const rarity=slug(card.rarity),family=slug(card.family),hp=currentHp??card.hp;
 const description=card.flavor??defaultEffect(card);
 const battleClass=variant==='battle'?'battle-card':'';
 const label=[card.name,card.rarity,card.family,`coût ${card.cost}`,card.atk!==undefined?`attaque ${card.atk}`:'',hp!==undefined?`${hp} points de vie`:'',description].filter(Boolean).join(', ');
 return <div className={`game-card game-card--${variant} rarity-${rarity} family-${family} ${battleClass} ${locked?'is-locked':''} ${className}`.trim()} aria-label={label}>
  <div className="game-card__foil" aria-hidden="true"/>
  <div className="game-card__art"><CardArtwork card={card}/></div>
  <div className="game-card__cost" aria-label={`Coût ${card.cost}`}><small>COÛT</small><b>{card.cost}</b></div>
  <div className="game-card__family" title={card.family}><span aria-hidden="true">{familyMark(card.family)}</span><small>{card.family}</small></div>
  {statusBadge&&<span className="game-card__status">{statusBadge}</span>}
  {copies!==undefined&&<span className="game-card__copies" aria-label={`${copies} exemplaire${copies>1?'s':''}`}>×{copies}</span>}
  {(atkBonus>0||hpBonus>0)&&<div className="game-card__modifiers">{atkBonus>0&&<span>+{atkBonus} ATQ</span>}{hpBonus>0&&<span>+{hpBonus} PV</span>}</div>}
  <div className="game-card__content">
   <span className="game-card__rarity">{card.rarity} · {card.type}</span>
   <strong className="game-card__title">{card.name}</strong>
   <p className="game-card__description">{description}</p>
  </div>
  <div className="game-card__stats">
   {card.atk!==undefined?<span><small>ATQ</small><b>{card.atk}</b></span>:<span><small>TYPE</small><b>{shortType(card.type)}</b></span>}
   {hp!==undefined?<span><small>PV</small><b>{hp}</b></span>:<span><small>EFFET</small><b>ACTIF</b></span>}
  </div>
 </div>
}

function slug(value:string){return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-')}
function familyMark(family:string){return family.split(/\s+/).map(part=>part[0]).join('').slice(0,2).toUpperCase()}
function shortType(type:CardData['type']){return type==='Événement'?'ÉVÉN.':type.toUpperCase().slice(0,6)}
function defaultEffect(card:CardData){return card.type==='Héros'?'Prêt à rejoindre ton équipe.':`Jouez cette carte pour activer son effet ${card.family.toLowerCase()}.`}
