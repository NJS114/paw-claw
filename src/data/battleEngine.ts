import type { CardData } from './gameCards';
import { armorBonus, attackBonus, endTurnHeroDelta, familyCount, turnEnergy, type BoardCard, type Side } from './synergies';

export type BattleSideState = Side & {
  hand: CardData[];
  deck: CardData[];
  shield: number;
  momentum: number;
  survivalUsed: boolean;
  pirateDrawUsed: boolean;
  healerSaveUsed: boolean;
  firstPlayDone: boolean;
};

export type BattleState = {
  player: BattleSideState;
  enemy: BattleSideState;
  turn: number;
  log: string[];
};

export type CombatEvent = {
  id:string;
  lane:number;
  type:'clash'|'direct-hit'|'unit-damage'|'unit-destroyed'|'unit-saved'|'shield-block'|'heal'|'momentum'|'buff-atk'|'buff-hp'|'armor'|'shield-gain'|'energy'|'draw';
  source:'player'|'enemy';
  target:'player'|'enemy';
  value?:number;
  cardId?:string;
  text:string;
};

const alive = (board:(BoardCard|null)[]) => board.filter(Boolean) as BoardCard[];
const count = (board:(BoardCard|null)[], family:string) => familyCount(board,family);
const clampHp = (hp:number) => Math.max(0, Math.min(20, hp));
const eventId=(type:string,lane:number)=>`${type}-${lane}-${Math.random().toString(36).slice(2,8)}`;

export function effectiveAttack(card:BoardCard, side:BattleSideState, enemy:BattleSideState){
  return (card.atk ?? 0) + attackBonus(side, enemy, card) + (side.momentum >= 3 ? 1 : 0);
}

export function beginTurn(side:BattleSideState, enemy:BattleSideState):BattleSideState {
  let next = { ...side, energy: turnEnergy(side), firstPlayDone:false, pirateDrawUsed:false, healerSaveUsed:false };
  if(next.heroHp <= 5 && !next.survivalUsed){
    const drawn = next.hand.length<5 ? next.deck[0] : undefined;
    next = {
      ...next,
      heroHp: clampHp(next.heroHp + 3),
      hand: drawn ? [...next.hand, drawn] : next.hand,
      deck: drawn ? next.deck.slice(1) : next.deck,
      survivalUsed: true,
      momentum: Math.min(5, next.momentum + 2)
    };
  }
  if(alive(enemy.board).length - alive(next.board).length >= 2) next = { ...next, momentum: Math.min(5,next.momentum+1) };
  return next;
}

function buffBoardOnThreshold(before:(BoardCard|null)[], after:(BoardCard|null)[]){
  let board=after.map(c=>c?{...c}:null);
  const crossedNobles3=count(before,'Nobles')<3&&count(board,'Nobles')>=3;
  const crossedRobots5=count(before,'Robots')<5&&count(board,'Robots')>=5;
  const crossedCreatures3=count(before,'Créatures')<3&&count(board,'Créatures')>=3;

  if(crossedNobles3){
    board=board.map(c=>c?{...c,hp:(c.hp??1)+1,currentHp:(c.currentHp??c.hp??1)+1}:null);
  }
  if(crossedRobots5){
    board=board.map(c=>c&&c.family==='Robots'?{...c,atk:(c.atk??0)+1,hp:(c.hp??1)+1,currentHp:(c.currentHp??c.hp??1)+1}:c);
  }
  if(crossedCreatures3){
    board=board.map(c=>c&&c.family==='Créatures'?{...c,hp:(c.hp??1)+1,currentHp:(c.currentHp??c.hp??1)+1}:c);
  }
  return board;
}

export function playUnit(side:BattleSideState, enemy:BattleSideState, card:CardData, slot:number):BattleSideState {
  if(card.type !== 'Héros' || slot < 0 || slot > 6 || side.board[slot]) return side;
  let cost = card.cost;
  if(count(side.board,'Magiciens') >= 5 && !side.firstPlayDone) cost = Math.max(0,cost-1);
  if(side.energy < cost) return side;
  const before=[...side.board];
  let board = [...side.board];
  const comeback = side.heroHp <= 10 && !side.firstPlayDone;
  const robot3 = card.family === 'Robots' && count(side.board,'Robots') >= 2;
  const hpBoost = (comeback?1:0)+(robot3?1:0);
  const atkBoost = (comeback?1:0)+(robot3?1:0);
  board[slot] = { ...card, atk:(card.atk??0)+atkBoost, hp:(card.hp??1)+hpBoost, currentHp:(card.hp??1)+hpBoost };
  board=buffBoardOnThreshold(before,board);
  return { ...side, board, energy:side.energy-cost, hand:side.hand.filter((c,i)=>i!==side.hand.indexOf(card)), firstPlayDone:true };
}

function absorb(heroHp:number, shield:number, damage:number){
  const blocked = Math.min(shield,damage);
  return { heroHp: clampHp(heroHp - (damage-blocked)), shield:shield-blocked, blocked, dealt:damage-blocked };
}

export function resolveCombat(attacker:BattleSideState, defender:BattleSideState){
  const aBoard = attacker.board.map(c=>c ? {...c,currentHp:c.currentHp ?? c.hp ?? 1}:null);
  const dBoard = defender.board.map(c=>c ? {...c,currentHp:c.currentHp ?? c.hp ?? 1}:null);
  let aHp=attacker.heroHp,dHp=defender.heroHp,aShield=attacker.shield,dShield=defender.shield;
  let attackerKills=0, defenderKills=0;
  const events:CombatEvent[]=[];

  for(let i=0;i<7;i++){
    const a=aBoard[i], d=dBoard[i];
    if(a && d){
      const aSide={...attacker,board:aBoard},dSide={...defender,board:dBoard};
      const rawA=effectiveAttack(a,aSide,dSide),rawD=effectiveAttack(d,dSide,aSide);
      const dArmor=armorBonus(dSide,d),aArmor=armorBonus(aSide,a);
      const aAtk=Math.max(0,rawA-dArmor);
      const dAtk=Math.max(0,rawD-aArmor);
      events.push({id:eventId('clash',i),lane:i,type:'clash',source:'player',target:'enemy',text:`Ligne ${i+1} : ${a.name} affronte ${d.name}.`});
      if(dArmor>0&&rawA>aAtk)events.push({id:eventId('armor-e',i),lane:i,type:'armor',source:'enemy',target:'enemy',value:rawA-aAtk,cardId:d.id,text:`Formation réduit de ${rawA-aAtk} les dégâts reçus par ${d.name}.`});
      if(aArmor>0&&rawD>dAtk)events.push({id:eventId('armor-p',i),lane:i,type:'armor',source:'player',target:'player',value:rawD-dAtk,cardId:a.id,text:`Formation réduit de ${rawD-dAtk} les dégâts reçus par ${a.name}.`});
      a.currentHp=(a.currentHp??1)-dAtk;
      d.currentHp=(d.currentHp??1)-aAtk;
      events.push({id:eventId('damage-e',i),lane:i,type:'unit-damage',source:'player',target:'enemy',value:aAtk,cardId:d.id,text:`${d.name} subit ${aAtk} dégâts.`});
      events.push({id:eventId('damage-p',i),lane:i,type:'unit-damage',source:'enemy',target:'player',value:dAtk,cardId:a.id,text:`${a.name} subit ${dAtk} dégâts.`});
      if((d.currentHp??0)<=0){
        if(count(dBoard,'Guérisseurs')>=5 && !defender.healerSaveUsed){
          d.currentHp=1; defender={...defender,healerSaveUsed:true};
          events.push({id:eventId('save-e',i),lane:i,type:'unit-saved',source:'enemy',target:'enemy',cardId:d.id,text:`Sanctuaire sauve ${d.name} à 1 PV.`});
        } else {
          dBoard[i]=null; attackerKills++;
          events.push({id:eventId('destroy-e',i),lane:i,type:'unit-destroyed',source:'player',target:'enemy',cardId:d.id,text:`${d.name} est éliminé.`});
        }
      }
      if((a.currentHp??0)<=0){
        if(count(aBoard,'Guérisseurs')>=5 && !attacker.healerSaveUsed){
          a.currentHp=1; attacker={...attacker,healerSaveUsed:true};
          events.push({id:eventId('save-p',i),lane:i,type:'unit-saved',source:'player',target:'player',cardId:a.id,text:`Sanctuaire sauve ${a.name} à 1 PV.`});
        } else {
          aBoard[i]=null; defenderKills++;
          events.push({id:eventId('destroy-p',i),lane:i,type:'unit-destroyed',source:'enemy',target:'player',cardId:a.id,text:`${a.name} est éliminé.`});
        }
      }
    } else if(a){
      const power=effectiveAttack(a,{...attacker,board:aBoard},{...defender,board:dBoard});
      const result=absorb(dHp,dShield,power);dHp=result.heroHp;dShield=result.shield;
      if(result.blocked)events.push({id:eventId('shield-e',i),lane:i,type:'shield-block',source:'player',target:'enemy',value:result.blocked,text:`Le bouclier adverse absorbe ${result.blocked} dégâts.`});
      if(result.dealt)events.push({id:eventId('direct-e',i),lane:i,type:'direct-hit',source:'player',target:'enemy',value:result.dealt,cardId:a.id,text:`${a.name} inflige ${result.dealt} dégâts directs.`});
    } else if(d){
      const power=effectiveAttack(d,{...defender,board:dBoard},{...attacker,board:aBoard});
      const result=absorb(aHp,aShield,power);aHp=result.heroHp;aShield=result.shield;
      if(result.blocked)events.push({id:eventId('shield-p',i),lane:i,type:'shield-block',source:'enemy',target:'player',value:result.blocked,text:`Ton bouclier absorbe ${result.blocked} dégâts.`});
      if(result.dealt)events.push({id:eventId('direct-p',i),lane:i,type:'direct-hit',source:'enemy',target:'player',value:result.dealt,cardId:d.id,text:`${d.name} inflige ${result.dealt} dégâts directs.`});
    }
  }

  const previousAMomentum=attacker.momentum, previousDMomentum=defender.momentum;
  let nextA={...attacker,board:aBoard,heroHp:aHp,shield:aShield,momentum:Math.min(5,Math.max(0,attacker.momentum + (attackerKills?1:0) - (defenderKills?1:0)))};
  let nextD={...defender,board:dBoard,heroHp:dHp,shield:dShield,momentum:Math.min(5,Math.max(0,defender.momentum + (defenderKills?1:0) - (attackerKills?1:0)))};
  if(nextA.momentum!==previousAMomentum)events.push({id:eventId('momentum-p',-1),lane:-1,type:'momentum',source:'player',target:'player',value:nextA.momentum-previousAMomentum,text:`Momentum joueur : ${nextA.momentum}/5.`});
  if(nextD.momentum!==previousDMomentum)events.push({id:eventId('momentum-e',-1),lane:-1,type:'momentum',source:'enemy',target:'enemy',value:nextD.momentum-previousDMomentum,text:`Momentum rival : ${nextD.momentum}/5.`});

  if(attackerKills && count(aBoard,'Pirates')>=3){
    nextA.energy += 1;
    events.push({id:eventId('pirate-energy-p',-1),lane:-1,type:'energy',source:'player',target:'player',value:1,text:'Butin rend 1 énergie.'});
    if(count(aBoard,'Pirates')>=5 && !nextA.pirateDrawUsed && nextA.deck[0] && nextA.hand.length<5){
      nextA={...nextA,hand:[...nextA.hand,nextA.deck[0]],deck:nextA.deck.slice(1),pirateDrawUsed:true};
      events.push({id:eventId('pirate-draw-p',-1),lane:-1,type:'draw',source:'player',target:'player',value:1,text:'Butin permet de piocher 1 carte.'});
    }
  }
  if(defenderKills && count(dBoard,'Pirates')>=3){
    nextD.energy += 1;
    events.push({id:eventId('pirate-energy-e',-1),lane:-1,type:'energy',source:'enemy',target:'enemy',value:1,text:'Butin adverse rend 1 énergie.'});
    if(count(dBoard,'Pirates')>=5 && !nextD.pirateDrawUsed && nextD.deck[0] && nextD.hand.length<5){
      nextD={...nextD,hand:[...nextD.hand,nextD.deck[0]],deck:nextD.deck.slice(1),pirateDrawUsed:true};
      events.push({id:eventId('pirate-draw-e',-1),lane:-1,type:'draw',source:'enemy',target:'enemy',value:1,text:'Butin adverse pioche 1 carte.'});
    }
  }

  return { attacker:nextA, defender:nextD, attackerKills, defenderKills, events };
}

function healNatureUnits(side:BattleSideState,target:'player'|'enemy',events:CombatEvent[]){
  if(count(side.board,'Nature')<3) return side;
  const board=side.board.map((c,lane)=>{
    if(!c)return null;
    const before=c.currentHp??c.hp??1,max=c.hp??1,after=Math.min(max,before+1);
    if(after>before)events.push({id:eventId(`nature-${target}`,lane),lane,type:'heal',source:target,target,value:after-before,cardId:c.id,text:`${c.name} récupère ${after-before} PV grâce à Nature.`});
    return {...c,currentHp:after};
  });
  return {...side,board};
}

export function resolveEndTurn(side:BattleSideState,enemy:BattleSideState){
  const own=endTurnHeroDelta(side), opp=endTurnHeroDelta(enemy);
  const events:CombatEvent[]=[];
  const sideHpBefore=side.heroHp,enemyHpBefore=enemy.heroHp;
  let nextSide={...side,heroHp:clampHp(side.heroHp+own.heal)};
  let nextEnemy={...enemy,heroHp:clampHp(enemy.heroHp+opp.heal)};
  if(nextSide.heroHp>sideHpBefore)events.push({id:eventId('heal-p',-1),lane:-1,type:'heal',source:'player',target:'player',value:nextSide.heroHp-sideHpBefore,text:`Tu récupères ${nextSide.heroHp-sideHpBefore} PV.`});
  if(nextEnemy.heroHp>enemyHpBefore)events.push({id:eventId('heal-e',-1),lane:-1,type:'heal',source:'enemy',target:'enemy',value:nextEnemy.heroHp-enemyHpBefore,text:`Le rival récupère ${nextEnemy.heroHp-enemyHpBefore} PV.`});
  const hitEnemy=absorb(nextEnemy.heroHp,nextEnemy.shield,own.enemyDamage);nextEnemy={...nextEnemy,heroHp:hitEnemy.heroHp,shield:hitEnemy.shield};
  const hitSide=absorb(nextSide.heroHp,nextSide.shield,opp.enemyDamage);nextSide={...nextSide,heroHp:hitSide.heroHp,shield:hitSide.shield};
  if(hitEnemy.blocked)events.push({id:eventId('end-shield-e',-1),lane:-1,type:'shield-block',source:'player',target:'enemy',value:hitEnemy.blocked,text:`Le bouclier adverse absorbe ${hitEnemy.blocked} dégâts de synergie.`});
  if(hitSide.blocked)events.push({id:eventId('end-shield-p',-1),lane:-1,type:'shield-block',source:'enemy',target:'player',value:hitSide.blocked,text:`Ton bouclier absorbe ${hitSide.blocked} dégâts de synergie.`});
  if(hitEnemy.dealt)events.push({id:eventId('end-hit-e',-1),lane:-1,type:'direct-hit',source:'player',target:'enemy',value:hitEnemy.dealt,text:`Une synergie inflige ${hitEnemy.dealt} dégâts directs au rival.`});
  if(hitSide.dealt)events.push({id:eventId('end-hit-p',-1),lane:-1,type:'direct-hit',source:'enemy',target:'player',value:hitSide.dealt,text:`Une synergie adverse t’inflige ${hitSide.dealt} dégâts directs.`});

  nextSide=healNatureUnits(nextSide,'player',events);
  nextEnemy=healNatureUnits(nextEnemy,'enemy',events);

  if(count(nextSide.board,'Nobles')>=5){
    const before=nextSide.shield;nextSide={...nextSide,shield:Math.max(nextSide.shield,3)};
    if(nextSide.shield>before)events.push({id:eventId('nobles-shield-p',-1),lane:-1,type:'shield-gain',source:'player',target:'player',value:nextSide.shield-before,text:`Cour royale confère ${nextSide.shield-before} point${nextSide.shield-before>1?'s':''} de bouclier.`});
  }
  if(count(nextEnemy.board,'Nobles')>=5){
    const before=nextEnemy.shield;nextEnemy={...nextEnemy,shield:Math.max(nextEnemy.shield,3)};
    if(nextEnemy.shield>before)events.push({id:eventId('nobles-shield-e',-1),lane:-1,type:'shield-gain',source:'enemy',target:'enemy',value:nextEnemy.shield-before,text:`Cour royale adverse confère ${nextEnemy.shield-before} point${nextEnemy.shield-before>1?'s':''} de bouclier.`});
  }
  return {side:nextSide,enemy:nextEnemy,events};
}

export function momentumLabel(value:number){
  if(value>=5) return 'RENVERSEMENT';
  if(value>=3) return 'PRESSION';
  if(value>=1) return 'RÉACTION';
  return 'STABLE';
}
