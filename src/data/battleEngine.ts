import type { CardData } from './gameCards';
import { armorBonus, attackBonus, endTurnHeroDelta, familyCount, turnEnergy, type BoardCard, type Side } from './synergies';
import { applyOpponentLore, applySameSideLore, type LoreBond } from './loreSynergies';

export type BattleSideState = Side & {
  hand: CardData[];
  deck: CardData[];
  shield: number;
  momentum: number;
  survivalUsed: boolean;
  pirateDrawUsed: boolean;
  healerSaveUsed: boolean;
  firstPlayDone: boolean;
  fatigue?: number;
};
export type BattleState={player:BattleSideState;enemy:BattleSideState;turn:number;log:string[]};
export type CombatEvent={id:string;lane:number;type:'clash'|'direct-hit'|'unit-damage'|'unit-destroyed'|'unit-saved'|'shield-block'|'heal'|'momentum'|'buff-atk'|'buff-hp'|'armor'|'shield-gain'|'energy'|'draw'|'lore'|'fatigue';source:'player'|'enemy';target:'player'|'enemy';value?:number;cardId?:string;text:string};
const alive=(board:(BoardCard|null)[])=>board.filter(Boolean) as BoardCard[];
const count=(board:(BoardCard|null)[],family:string)=>familyCount(board,family);
const clampHp=(hp:number)=>Math.max(0,Math.min(20,hp));
const eventId=(type:string,lane:number)=>`${type}-${lane}-${Math.random().toString(36).slice(2,8)}`;
const cloneBoard=(board:(BoardCard|null)[])=>board.map(c=>c?{...c}:null);

export function effectiveAttack(card:BoardCard,side:BattleSideState,enemy:BattleSideState){return (card.atk??0)+attackBonus(side,enemy,card)+(side.momentum>=3?1:0)}
export function drawCard(side:BattleSideState,target:'player'|'enemy',reason='Pioche'):{side:BattleSideState;event:CombatEvent;drew:boolean}{
 if(side.hand.length>=5)return{side,event:{id:eventId('draw-full',-1),lane:-1,type:'draw',source:target,target,value:0,text:`${reason} impossible : main pleine.`},drew:false};
 const card=side.deck[0];
 if(card)return{side:{...side,hand:[...side.hand,card],deck:side.deck.slice(1)},event:{id:eventId('draw',-1),lane:-1,type:'draw',source:target,target,value:1,cardId:card.id,text:`${reason} : 1 carte piochée.`},drew:true};
 const fatigue=(side.fatigue??0)+1;
 return{side:{...side,fatigue,heroHp:clampHp(side.heroHp-fatigue)},event:{id:eventId('fatigue',-1),lane:-1,type:'fatigue',source:target,target,value:fatigue,text:`Pioche vide : ${fatigue} dégât${fatigue>1?'s':''} de fatigue.`},drew:false};
}
export function beginTurn(side:BattleSideState,enemy:BattleSideState):BattleSideState{
 let next={...side,energy:turnEnergy(side),firstPlayDone:false,pirateDrawUsed:false,healerSaveUsed:false,fatigue:side.fatigue??0};
 if(next.heroHp<=5&&!next.survivalUsed){
  next={...next,heroHp:clampHp(next.heroHp+3),survivalUsed:true,momentum:Math.min(5,next.momentum+2)};
  if(next.hand.length<5&&next.deck[0])next={...next,hand:[...next.hand,next.deck[0]],deck:next.deck.slice(1)};
 }
 if(alive(enemy.board).length-alive(next.board).length>=2)next={...next,momentum:Math.min(5,next.momentum+1)};
 return next;
}
function buffBoardOnThreshold(before:(BoardCard|null)[],after:(BoardCard|null)[]){
 let board=cloneBoard(after);
 if(count(before,'Nobles')<3&&count(board,'Nobles')>=3)board=board.map(c=>c?{...c,hp:(c.hp??1)+1,currentHp:(c.currentHp??c.hp??1)+1}:null);
 if(count(before,'Robots')<5&&count(board,'Robots')>=5)board=board.map(c=>c&&c.family==='Robots'?{...c,atk:(c.atk??0)+1,hp:(c.hp??1)+1,currentHp:(c.currentHp??c.hp??1)+1}:c);
 if(count(before,'Créatures')<3&&count(board,'Créatures')>=3)board=board.map(c=>c&&c.family==='Créatures'?{...c,hp:(c.hp??1)+1,currentHp:(c.currentHp??c.hp??1)+1}:c);
 return board;
}
export function playUnit(side:BattleSideState,enemy:BattleSideState,card:CardData,slot:number):BattleSideState{
 if(card.type!=='Héros'||slot<0||slot>6||side.board[slot])return side;
 let cost=card.cost;if(count(side.board,'Magiciens')>=5&&!side.firstPlayDone)cost=Math.max(0,cost-1);if(side.energy<cost)return side;
 const before=[...side.board],board=[...side.board];const comeback=side.heroHp<=10&&!side.firstPlayDone,robot3=card.family==='Robots'&&count(side.board,'Robots')>=2;
 const boost=(comeback?1:0)+(robot3?1:0);board[slot]={...card,atk:(card.atk??0)+boost,hp:(card.hp??1)+boost,currentHp:(card.hp??1)+boost};
 const lore=applySameSideLore(buffBoardOnThreshold(before,board));
 const hand=[...side.hand];const idx=hand.findIndex(c=>c===card||c.id===card.id);if(idx>=0)hand.splice(idx,1);
 return{...side,board:lore.board,energy:side.energy-cost,hand,firstPlayDone:true};
}
export function resolveLoreSides(player:BattleSideState,enemy:BattleSideState){
 const sameP=applySameSideLore(player.board),sameE=applySameSideLore(enemy.board),op=applyOpponentLore(sameP.board,sameE.board);
 const bonds=[...sameP.triggered,...sameE.triggered,...op.triggered];
 const events:CombatEvent[]=bonds.map((bond:LoreBond)=>({id:eventId(`lore-${bond.id}`,-1),lane:-1,type:'lore',source:'player',target:'enemy',text:`Histoire — ${bond.title} : ${bond.story}`}));
 return{player:{...player,board:op.left},enemy:{...enemy,board:op.right},events,bonds};
}
function absorb(heroHp:number,shield:number,damage:number){const blocked=Math.min(shield,damage);return{heroHp:clampHp(heroHp-(damage-blocked)),shield:shield-blocked,blocked,dealt:damage-blocked}}
export function resolveCombat(attacker:BattleSideState,defender:BattleSideState){
 const lore=resolveLoreSides(attacker,defender),aBoard=cloneBoard(lore.player.board),dBoard=cloneBoard(lore.enemy.board);
 const frozenA=cloneBoard(aBoard),frozenD=cloneBoard(dBoard),aSnapshot={...attacker,board:frozenA},dSnapshot={...defender,board:frozenD};
 const aHealer=count(frozenA,'Guérisseurs')>=5,dHealer=count(frozenD,'Guérisseurs')>=5,aPirates3=count(frozenA,'Pirates')>=3,aPirates5=count(frozenA,'Pirates')>=5,dPirates3=count(frozenD,'Pirates')>=3,dPirates5=count(frozenD,'Pirates')>=5;
 let aHp=attacker.heroHp,dHp=defender.heroHp,aShield=attacker.shield,dShield=defender.shield,attackerKills=0,defenderKills=0,aSave=attacker.healerSaveUsed,dSave=defender.healerSaveUsed;
 const events=[...lore.events];
 for(let i=0;i<7;i++){
  const a=aBoard[i],d=dBoard[i],fa=frozenA[i],fd=frozenD[i];
  if(a&&d&&fa&&fd){
   const rawA=effectiveAttack(fa,aSnapshot,dSnapshot),rawD=effectiveAttack(fd,dSnapshot,aSnapshot),dArmor=armorBonus(dSnapshot,fd),aArmor=armorBonus(aSnapshot,fa),aAtk=Math.max(0,rawA-dArmor),dAtk=Math.max(0,rawD-aArmor);
   events.push({id:eventId('clash',i),lane:i,type:'clash',source:'player',target:'enemy',text:`Ligne ${i+1} : ${a.name} affronte ${d.name}.`});
   if(dArmor>0&&rawA>aAtk)events.push({id:eventId('armor-e',i),lane:i,type:'armor',source:'enemy',target:'enemy',value:rawA-aAtk,cardId:d.id,text:`Formation réduit de ${rawA-aAtk} les dégâts reçus par ${d.name}.`});
   if(aArmor>0&&rawD>dAtk)events.push({id:eventId('armor-p',i),lane:i,type:'armor',source:'player',target:'player',value:rawD-dAtk,cardId:a.id,text:`Formation réduit de ${rawD-dAtk} les dégâts reçus par ${a.name}.`});
   a.currentHp=(a.currentHp??1)-dAtk;d.currentHp=(d.currentHp??1)-aAtk;
   events.push({id:eventId('damage-e',i),lane:i,type:'unit-damage',source:'player',target:'enemy',value:aAtk,cardId:d.id,text:`${d.name} subit ${aAtk} dégâts.`},{id:eventId('damage-p',i),lane:i,type:'unit-damage',source:'enemy',target:'player',value:dAtk,cardId:a.id,text:`${a.name} subit ${dAtk} dégâts.`});
   if((d.currentHp??0)<=0){if(dHealer&&!dSave){d.currentHp=1;dSave=true;events.push({id:eventId('save-e',i),lane:i,type:'unit-saved',source:'enemy',target:'enemy',cardId:d.id,text:`Sanctuaire sauve ${d.name} à 1 PV.`})}else{dBoard[i]=null;attackerKills++;events.push({id:eventId('destroy-e',i),lane:i,type:'unit-destroyed',source:'player',target:'enemy',cardId:d.id,text:`${d.name} est éliminé.`})}}
   if((a.currentHp??0)<=0){if(aHealer&&!aSave){a.currentHp=1;aSave=true;events.push({id:eventId('save-p',i),lane:i,type:'unit-saved',source:'player',target:'player',cardId:a.id,text:`Sanctuaire sauve ${a.name} à 1 PV.`})}else{aBoard[i]=null;defenderKills++;events.push({id:eventId('destroy-p',i),lane:i,type:'unit-destroyed',source:'enemy',target:'player',cardId:a.id,text:`${a.name} est éliminé.`})}}
  }else if(a&&fa){const power=effectiveAttack(fa,aSnapshot,dSnapshot),r=absorb(dHp,dShield,power);dHp=r.heroHp;dShield=r.shield;if(r.blocked)events.push({id:eventId('shield-e',i),lane:i,type:'shield-block',source:'player',target:'enemy',value:r.blocked,text:`Le bouclier adverse absorbe ${r.blocked} dégâts.`});if(r.dealt)events.push({id:eventId('direct-e',i),lane:i,type:'direct-hit',source:'player',target:'enemy',value:r.dealt,cardId:a.id,text:`${a.name} inflige ${r.dealt} dégâts directs.`})}
  else if(d&&fd){const power=effectiveAttack(fd,dSnapshot,aSnapshot),r=absorb(aHp,aShield,power);aHp=r.heroHp;aShield=r.shield;if(r.blocked)events.push({id:eventId('shield-p',i),lane:i,type:'shield-block',source:'enemy',target:'player',value:r.blocked,text:`Ton bouclier absorbe ${r.blocked} dégâts.`});if(r.dealt)events.push({id:eventId('direct-p',i),lane:i,type:'direct-hit',source:'enemy',target:'player',value:r.dealt,cardId:d.id,text:`${d.name} inflige ${r.dealt} dégâts directs.`})}
 }
 const prevAM=attacker.momentum,prevDM=defender.momentum;let nextA={...attacker,board:aBoard,heroHp:aHp,shield:aShield,healerSaveUsed:aSave,momentum:Math.min(5,Math.max(0,attacker.momentum+(attackerKills?1:0)-(defenderKills?1:0)))},nextD={...defender,board:dBoard,heroHp:dHp,shield:dShield,healerSaveUsed:dSave,momentum:Math.min(5,Math.max(0,defender.momentum+(defenderKills?1:0)-(attackerKills?1:0)))};
 if(nextA.momentum!==prevAM)events.push({id:eventId('momentum-p',-1),lane:-1,type:'momentum',source:'player',target:'player',value:nextA.momentum-prevAM,text:`Momentum joueur : ${nextA.momentum}/5.`});if(nextD.momentum!==prevDM)events.push({id:eventId('momentum-e',-1),lane:-1,type:'momentum',source:'enemy',target:'enemy',value:nextD.momentum-prevDM,text:`Momentum rival : ${nextD.momentum}/5.`});
 if(attackerKills&&aPirates3){nextA.energy+=1;events.push({id:eventId('pirate-energy-p',-1),lane:-1,type:'energy',source:'player',target:'player',value:1,text:'Butin rend 1 énergie.'});if(aPirates5&&!nextA.pirateDrawUsed){const r=drawCard(nextA,'player','Butin');nextA={...r.side,pirateDrawUsed:true};events.push(r.event)}}
 if(defenderKills&&dPirates3){nextD.energy+=1;events.push({id:eventId('pirate-energy-e',-1),lane:-1,type:'energy',source:'enemy',target:'enemy',value:1,text:'Butin adverse rend 1 énergie.'});if(dPirates5&&!nextD.pirateDrawUsed){const r=drawCard(nextD,'enemy','Butin adverse');nextD={...r.side,pirateDrawUsed:true};events.push(r.event)}}
 return{attacker:nextA,defender:nextD,attackerKills,defenderKills,events};
}
function healNatureUnits(side:BattleSideState,target:'player'|'enemy',events:CombatEvent[]){if(count(side.board,'Nature')<3)return side;const board=side.board.map((c,lane)=>{if(!c)return null;const before=c.currentHp??c.hp??1,max=c.hp??1,after=Math.min(max,before+1);if(after>before)events.push({id:eventId(`nature-${target}`,lane),lane,type:'heal',source:target,target,value:after-before,cardId:c.id,text:`${c.name} récupère ${after-before} PV grâce à Nature.`});return{...c,currentHp:after}});return{...side,board}}
export function resolveEndTurn(side:BattleSideState,enemy:BattleSideState){
 const own=endTurnHeroDelta(side),opp=endTurnHeroDelta(enemy),events:CombatEvent[]=[];const sideHpBefore=side.heroHp,enemyHpBefore=enemy.heroHp;let nextSide={...side,heroHp:clampHp(side.heroHp+own.heal)},nextEnemy={...enemy,heroHp:clampHp(enemy.heroHp+opp.heal)};
 if(nextSide.heroHp>sideHpBefore)events.push({id:eventId('heal-p',-1),lane:-1,type:'heal',source:'player',target:'player',value:nextSide.heroHp-sideHpBefore,text:`Tu récupères ${nextSide.heroHp-sideHpBefore} PV.`});if(nextEnemy.heroHp>enemyHpBefore)events.push({id:eventId('heal-e',-1),lane:-1,type:'heal',source:'enemy',target:'enemy',value:nextEnemy.heroHp-enemyHpBefore,text:`Le rival récupère ${nextEnemy.heroHp-enemyHpBefore} PV.`});
 const hitEnemy=absorb(nextEnemy.heroHp,nextEnemy.shield,own.enemyDamage);nextEnemy={...nextEnemy,heroHp:hitEnemy.heroHp,shield:hitEnemy.shield};const hitSide=absorb(nextSide.heroHp,nextSide.shield,opp.enemyDamage);nextSide={...nextSide,heroHp:hitSide.heroHp,shield:hitSide.shield};
 if(hitEnemy.blocked)events.push({id:eventId('end-shield-e',-1),lane:-1,type:'shield-block',source:'player',target:'enemy',value:hitEnemy.blocked,text:`Le bouclier adverse absorbe ${hitEnemy.blocked} dégâts de synergie.`});if(hitSide.blocked)events.push({id:eventId('end-shield-p',-1),lane:-1,type:'shield-block',source:'enemy',target:'player',value:hitSide.blocked,text:`Ton bouclier absorbe ${hitSide.blocked} dégâts de synergie.`});if(hitEnemy.dealt)events.push({id:eventId('end-hit-e',-1),lane:-1,type:'direct-hit',source:'player',target:'enemy',value:hitEnemy.dealt,text:`Une synergie inflige ${hitEnemy.dealt} dégâts directs au rival.`});if(hitSide.dealt)events.push({id:eventId('end-hit-p',-1),lane:-1,type:'direct-hit',source:'enemy',target:'player',value:hitSide.dealt,text:`Une synergie adverse t’inflige ${hitSide.dealt} dégâts directs.`});
 nextSide=healNatureUnits(nextSide,'player',events);nextEnemy=healNatureUnits(nextEnemy,'enemy',events);
 if(count(nextSide.board,'Nobles')>=5){const before=nextSide.shield;nextSide={...nextSide,shield:Math.max(nextSide.shield,3)};if(nextSide.shield>before)events.push({id:eventId('nobles-shield-p',-1),lane:-1,type:'shield-gain',source:'player',target:'player',value:nextSide.shield-before,text:`Cour royale confère ${nextSide.shield-before} point${nextSide.shield-before>1?'s':''} de bouclier.`})}if(count(nextEnemy.board,'Nobles')>=5){const before=nextEnemy.shield;nextEnemy={...nextEnemy,shield:Math.max(nextEnemy.shield,3)};if(nextEnemy.shield>before)events.push({id:eventId('nobles-shield-e',-1),lane:-1,type:'shield-gain',source:'enemy',target:'enemy',value:nextEnemy.shield-before,text:`Cour royale adverse confère ${nextEnemy.shield-before} point${nextEnemy.shield-before>1?'s':''} de bouclier.`})}
 return{side:nextSide,enemy:nextEnemy,events};
}
export function momentumLabel(value:number){if(value>=5)return'RENVERSEMENT';if(value>=3)return'PRESSION';if(value>=1)return'RÉACTION';return'STABLE'}