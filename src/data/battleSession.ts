import type { BattleState } from './battleEngine';

const ACTIVE_KEY='paw-claw.battle.active.v2';
const HISTORY_KEY='paw-claw.battle.history.v2';

export type BattleStats={
  cardsPlayed:number;
  unitsDestroyed:number;
  unitsLost:number;
  damageDealt:number;
  damageTaken:number;
  healingDone:number;
  synergyActivations:number;
  comebackTriggered:boolean;
  maxBoard:number;
};

export const emptyBattleStats=():BattleStats=>({
  cardsPlayed:0,
  unitsDestroyed:0,
  unitsLost:0,
  damageDealt:0,
  damageTaken:0,
  healingDone:0,
  synergyActivations:0,
  comebackTriggered:false,
  maxBoard:0
});

export type BattleHistoryEntry={
  id:string;
  startedAt:number;
  endedAt:number;
  durationMs:number;
  result:'win'|'lose';
  turns:number;
  playerHp:number;
  enemyHp:number;
  maxMomentum:number;
  stats:BattleStats;
};

export type SavedBattle={
  version:2;
  startedAt:number;
  updatedAt:number;
  maxMomentum:number;
  stats:BattleStats;
  state:BattleState;
};

export function loadBattle():SavedBattle|null{
  try{
    const raw=localStorage.getItem(ACTIVE_KEY);
    if(!raw)return null;
    const parsed=JSON.parse(raw) as SavedBattle;
    if(parsed.version!==2)return null;
    return {...parsed,stats:{...emptyBattleStats(),...(parsed.stats||{})}};
  }catch{return null}
}

export function saveBattle(saved:SavedBattle){
  localStorage.setItem(ACTIVE_KEY,JSON.stringify({...saved,updatedAt:Date.now()}));
}

export function clearBattle(){localStorage.removeItem(ACTIVE_KEY)}

export function finishBattle(saved:SavedBattle,result:'win'|'lose'){
  const endedAt=Date.now();
  const entry:BattleHistoryEntry={
    id:`match-${saved.startedAt}`,
    startedAt:saved.startedAt,
    endedAt,
    durationMs:Math.max(0,endedAt-saved.startedAt),
    result,
    turns:saved.state.turn,
    playerHp:saved.state.player.heroHp,
    enemyHp:saved.state.enemy.heroHp,
    maxMomentum:saved.maxMomentum,
    stats:{...emptyBattleStats(),...(saved.stats||{})}
  };
  try{
    const current=JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]') as BattleHistoryEntry[];
    localStorage.setItem(HISTORY_KEY,JSON.stringify([entry,...current].slice(0,30)));
  }catch{localStorage.setItem(HISTORY_KEY,JSON.stringify([entry]))}
  clearBattle();
  return entry;
}

export function loadBattleHistory():BattleHistoryEntry[]{
  try{
    const rows=JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]') as BattleHistoryEntry[];
    return rows.map(row=>({...row,durationMs:row.durationMs??Math.max(0,(row.endedAt??0)-(row.startedAt??0)),stats:{...emptyBattleStats(),...(row.stats||{})}}));
  }
  catch{return []}
}
