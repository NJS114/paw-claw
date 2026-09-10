import type { BattleState } from './battleEngine';

const ACTIVE_KEY='paw-claw.battle.active.v2';
const HISTORY_KEY='paw-claw.battle.history.v2';

export type BattleHistoryEntry={
  id:string;
  startedAt:number;
  endedAt:number;
  result:'win'|'lose';
  turns:number;
  playerHp:number;
  enemyHp:number;
  maxMomentum:number;
};

export type SavedBattle={
  version:2;
  startedAt:number;
  updatedAt:number;
  maxMomentum:number;
  state:BattleState;
};

export function loadBattle():SavedBattle|null{
  try{
    const raw=localStorage.getItem(ACTIVE_KEY);
    if(!raw)return null;
    const parsed=JSON.parse(raw) as SavedBattle;
    return parsed.version===2?parsed:null;
  }catch{return null}
}

export function saveBattle(saved:SavedBattle){
  localStorage.setItem(ACTIVE_KEY,JSON.stringify({...saved,updatedAt:Date.now()}));
}

export function clearBattle(){localStorage.removeItem(ACTIVE_KEY)}

export function finishBattle(saved:SavedBattle,result:'win'|'lose'){
  const entry:BattleHistoryEntry={
    id:`match-${saved.startedAt}`,
    startedAt:saved.startedAt,
    endedAt:Date.now(),
    result,
    turns:saved.state.turn,
    playerHp:saved.state.player.heroHp,
    enemyHp:saved.state.enemy.heroHp,
    maxMomentum:saved.maxMomentum
  };
  try{
    const current=JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]') as BattleHistoryEntry[];
    localStorage.setItem(HISTORY_KEY,JSON.stringify([entry,...current].slice(0,30)));
  }catch{localStorage.setItem(HISTORY_KEY,JSON.stringify([entry]))}
  clearBattle();
  return entry;
}

export function loadBattleHistory():BattleHistoryEntry[]{
  try{return JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]') as BattleHistoryEntry[]}
  catch{return []}
}
