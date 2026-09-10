import type { CardData } from './gameCards';
import { attackBonus, endTurnHeroDelta, turnEnergy, type BoardCard, type Side } from './synergies';

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

const alive = (board:(BoardCard|null)[]) => board.filter(Boolean) as BoardCard[];
const count = (board:(BoardCard|null)[], family:string) => alive(board).filter(c=>c.family===family).length;
const clampHp = (hp:number) => Math.max(0, Math.min(20, hp));

export function effectiveAttack(card:BoardCard, side:BattleSideState, enemy:BattleSideState){
  return (card.atk ?? 0) + attackBonus(side, enemy, card) + (side.momentum >= 3 ? 1 : 0);
}

export function beginTurn(side:BattleSideState, enemy:BattleSideState):BattleSideState {
  let next = { ...side, energy: turnEnergy(side), firstPlayDone:false, pirateDrawUsed:false, healerSaveUsed:false };
  if(next.heroHp <= 5 && !next.survivalUsed){
    const drawn = next.deck[0];
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

export function playUnit(side:BattleSideState, enemy:BattleSideState, card:CardData, slot:number):BattleSideState {
  if(card.type !== 'Héros' || slot < 0 || slot > 6 || side.board[slot]) return side;
  let cost = card.cost;
  if(count(side.board,'Magiciens') >= 5 && !side.firstPlayDone) cost = Math.max(0,cost-1);
  if(side.energy < cost) return side;
  const board = [...side.board];
  const comeback = side.heroHp <= 10 && !side.firstPlayDone;
  const robot3 = card.family === 'Robots' && count(side.board,'Robots') >= 2;
  const creature3 = card.family === 'Créatures' && count(side.board,'Créatures') >= 2;
  const hpBoost = (comeback?1:0)+(robot3?1:0)+(creature3?1:0);
  const atkBoost = (comeback?1:0)+(robot3?1:0);
  board[slot] = { ...card, atk:(card.atk??0)+atkBoost, hp:(card.hp??1)+hpBoost, currentHp:(card.hp??1)+hpBoost };
  return { ...side, board, energy:side.energy-cost, hand:side.hand.filter((c,i)=>i!==side.hand.indexOf(card)), firstPlayDone:true };
}

function absorb(heroHp:number, shield:number, damage:number){
  const blocked = Math.min(shield,damage);
  return { heroHp: clampHp(heroHp - (damage-blocked)), shield:shield-blocked };
}

export function resolveCombat(attacker:BattleSideState, defender:BattleSideState){
  const aBoard = attacker.board.map(c=>c ? {...c,currentHp:c.currentHp ?? c.hp ?? 1}:null);
  const dBoard = defender.board.map(c=>c ? {...c,currentHp:c.currentHp ?? c.hp ?? 1}:null);
  let aHp=attacker.heroHp,dHp=defender.heroHp,aShield=attacker.shield,dShield=defender.shield;
  let attackerKills=0, defenderKills=0;

  for(let i=0;i<7;i++){
    const a=aBoard[i], d=dBoard[i];
    if(a && d){
      const aAtk=effectiveAttack(a,{...attacker,board:aBoard},{...defender,board:dBoard});
      const dAtk=effectiveAttack(d,{...defender,board:dBoard},{...attacker,board:aBoard});
      a.currentHp=(a.currentHp??1)-dAtk;
      d.currentHp=(d.currentHp??1)-aAtk;
      if((d.currentHp??0)<=0){
        if(count(dBoard,'Guérisseurs')>=5 && !defender.healerSaveUsed){ d.currentHp=1; defender={...defender,healerSaveUsed:true}; }
        else { dBoard[i]=null; attackerKills++; }
      }
      if((a.currentHp??0)<=0){
        if(count(aBoard,'Guérisseurs')>=5 && !attacker.healerSaveUsed){ a.currentHp=1; attacker={...attacker,healerSaveUsed:true}; }
        else { aBoard[i]=null; defenderKills++; }
      }
    } else if(a){
      const result=absorb(dHp,dShield,effectiveAttack(a,{...attacker,board:aBoard},{...defender,board:dBoard}));dHp=result.heroHp;dShield=result.shield;
    } else if(d){
      const result=absorb(aHp,aShield,effectiveAttack(d,{...defender,board:dBoard},{...attacker,board:aBoard}));aHp=result.heroHp;aShield=result.shield;
    }
  }

  let nextA={...attacker,board:aBoard,heroHp:aHp,shield:aShield,momentum:Math.min(5,Math.max(0,attacker.momentum + (attackerKills?1:0) - (defenderKills?1:0)))};
  let nextD={...defender,board:dBoard,heroHp:dHp,shield:dShield,momentum:Math.min(5,Math.max(0,defender.momentum + (defenderKills?1:0) - (attackerKills?1:0)))};

  // Pirates convert a first kill into tempo, but only once per turn.
  if(attackerKills && count(aBoard,'Pirates')>=3){
    nextA.energy += 1;
    if(count(aBoard,'Pirates')>=5 && !nextA.pirateDrawUsed && nextA.deck[0]) nextA={...nextA,hand:[...nextA.hand,nextA.deck[0]],deck:nextA.deck.slice(1),pirateDrawUsed:true};
  }
  if(defenderKills && count(dBoard,'Pirates')>=3){
    nextD.energy += 1;
    if(count(dBoard,'Pirates')>=5 && !nextD.pirateDrawUsed && nextD.deck[0]) nextD={...nextD,hand:[...nextD.hand,nextD.deck[0]],deck:nextD.deck.slice(1),pirateDrawUsed:true};
  }

  return { attacker:nextA, defender:nextD, attackerKills, defenderKills };
}

export function resolveEndTurn(side:BattleSideState,enemy:BattleSideState){
  const own=endTurnHeroDelta(side), opp=endTurnHeroDelta(enemy);
  let nextSide={...side,heroHp:clampHp(side.heroHp+own.heal)};
  let nextEnemy={...enemy,heroHp:clampHp(enemy.heroHp+opp.heal)};
  const hitEnemy=absorb(nextEnemy.heroHp,nextEnemy.shield,own.enemyDamage);nextEnemy={...nextEnemy,heroHp:hitEnemy.heroHp,shield:hitEnemy.shield};
  const hitSide=absorb(nextSide.heroHp,nextSide.shield,opp.enemyDamage);nextSide={...nextSide,heroHp:hitSide.heroHp,shield:hitSide.shield};

  // Nature 3 heals damaged units by 1 each turn.
  if(count(nextSide.board,'Nature')>=3) nextSide={...nextSide,board:nextSide.board.map(c=>c?{...c,currentHp:Math.min(c.hp??1,(c.currentHp??c.hp??1)+1)}:null)};
  if(count(nextEnemy.board,'Nature')>=3) nextEnemy={...nextEnemy,board:nextEnemy.board.map(c=>c?{...c,currentHp:Math.min(c.hp??1,(c.currentHp??c.hp??1)+1)}:null)};

  // Nobles 5 generate a small renewable shield; capped to avoid stall games.
  if(count(nextSide.board,'Nobles')>=5) nextSide={...nextSide,shield:Math.min(3,nextSide.shield+3)};
  if(count(nextEnemy.board,'Nobles')>=5) nextEnemy={...nextEnemy,shield:Math.min(3,nextEnemy.shield+3)};
  return {side:nextSide,enemy:nextEnemy};
}

export function momentumLabel(value:number){
  if(value>=5) return 'RENVERSEMENT';
  if(value>=3) return 'PRESSION';
  if(value>=1) return 'RÉACTION';
  return 'STABLE';
}
