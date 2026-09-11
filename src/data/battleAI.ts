import type { CardData } from './gameCards';
import { effectiveAttack, playUnit, type BattleSideState } from './battleEngine';
import { rarityAIPriority } from './rarityBalance';
import { synergyProgress } from './synergies';

export type AIDifficulty='easy'|'normal'|'hard';
export type AIMove={card:CardData;slot:number;score:number;reason:string};
export type AIPlan={side:BattleSideState;moves:AIMove[];label:string};

const familyCount=(side:BattleSideState,family:string)=>side.board.filter(c=>c?.family===family).length;
const emptySlots=(side:BattleSideState)=>side.board.map((c,i)=>c?-1:i).filter(i=>i>=0);
const affordable=(side:BattleSideState)=>side.hand.filter(c=>c.type==='Héros'&&c.cost<=side.energy);

function laneScore(side:BattleSideState,enemy:BattleSideState,card:CardData,slot:number,difficulty:AIDifficulty){
  const target=enemy.board[slot];
  const same=familyCount(side,card.family);
  const rarityWeight=difficulty==='easy'?.25:difficulty==='normal'?.65:1;
  let score=(card.atk??0)*1.55+(card.hp??1)*1.05-card.cost*.15+rarityAIPriority(card)*rarityWeight;
  let reason='pression de ligne';

  if(same===2){score+=difficulty==='hard'?8:5;reason='palier de synergie 3/3'}
  if(same===4){score+=difficulty==='hard'?12:7;reason='palier de synergie 5/5'}
  if(target){
    const targetAtk=effectiveAttack(target,enemy,side),targetHp=target.currentHp??target.hp??1;
    const ownAtk=(card.atk??0),ownHp=card.hp??1;
    if(ownAtk>=targetHp){score+=difficulty==='hard'?8:5;reason='élimination favorable'}
    if(ownHp>targetAtk)score+=2.5;
    if(ownHp<=targetAtk&&ownAtk<targetHp)score-=difficulty==='hard'?5:2;
  }else{
    const heroPressure=(card.atk??0);
    score+=heroPressure*(difficulty==='hard'?1.6:.8);
    if(heroPressure>=enemy.heroHp){score+=40;reason='attaque létale'}
  }

  if(enemy.heroHp<=7)score+=(card.atk??0)*1.1;
  if(side.heroHp<=7&&target)score+=3;
  if(difficulty==='hard'){
    const before=synergyProgress(side).reduce((n,x)=>n+x.tier,0);
    const simulated=playUnit(side,enemy,card,slot);
    const after=synergyProgress(simulated).reduce((n,x)=>n+x.tier,0);
    score+=(after-before)*5;
    score+=simulated.energy*.12;
  }
  return {score,reason};
}

function candidates(side:BattleSideState,enemy:BattleSideState,difficulty:AIDifficulty):AIMove[]{
  const moves:AIMove[]=[];
  for(const card of affordable(side))for(const slot of emptySlots(side)){
    const rated=laneScore(side,enemy,card,slot,difficulty);
    moves.push({card,slot,score:rated.score,reason:rated.reason});
  }
  return moves.sort((a,b)=>b.score-a.score);
}

export function chooseEnemyPlan(side:BattleSideState,enemy:BattleSideState,difficulty:AIDifficulty):AIPlan{
  let current={...side,board:[...side.board],hand:[...side.hand],deck:[...side.deck]};
  const moves:AIMove[]=[];
  const maxPlays=difficulty==='easy'?1:difficulty==='normal'?2:4;

  for(let step=0;step<maxPlays;step++){
    const options=candidates(current,enemy,difficulty);
    if(!options.length)break;
    let choice: AIMove;
    if(difficulty==='easy'){
      const pool=options.slice(0,Math.min(6,options.length));
      choice=pool[Math.floor(Math.random()*pool.length)];
    }else if(difficulty==='normal'){
      const pool=options.slice(0,Math.min(3,options.length));
      choice=Math.random()<.78?pool[0]:pool[Math.floor(Math.random()*pool.length)];
    }else choice=options[0];

    const next=playUnit(current,enemy,choice.card,choice.slot);
    if(next===current)break;
    current=next;
    moves.push(choice);
    if(current.energy<=0||emptySlots(current).length===0)break;
  }

  const label=moves.length?moves.some(m=>m.reason==='attaque létale')?'Le rival cherche le coup final':moves.some(m=>m.reason.includes('synergie'))?'Le rival construit une synergie':'Le rival renforce son front':'Le rival conserve ses ressources';
  return {side:current,moves,label};
}
