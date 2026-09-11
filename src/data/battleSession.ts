import type { BattleState } from './battleEngine';

const ACTIVE_KEY='paw-claw.battle.active.v3';
const LEGACY_ACTIVE_KEY='paw-claw.battle.active.v2';
const HISTORY_KEY='paw-claw.battle.history.v2';

export type BattlePhase='intro'|'player'|'enemy'|'combat'|'result';
export type BattleCheckpoint='intro'|'stable-player';
export type BattleResult='win'|'lose'|'draw';
export type BattleStats={cardsPlayed:number;unitsDestroyed:number;unitsLost:number;damageDealt:number;damageTaken:number;healingDone:number;synergyActivations:number;comebackTriggered:boolean;maxBoard:number;};
export const emptyBattleStats=():BattleStats=>({cardsPlayed:0,unitsDestroyed:0,unitsLost:0,damageDealt:0,damageTaken:0,healingDone:0,synergyActivations:0,comebackTriggered:false,maxBoard:0});
export type BattleHistoryEntry={id:string;startedAt:number;endedAt:number;durationMs:number;result:BattleResult;turns:number;playerHp:number;enemyHp:number;maxMomentum:number;stats:BattleStats;};
export type SavedBattle={version:2|3;startedAt:number;updatedAt:number;maxMomentum:number;stats:BattleStats;phase?:BattlePhase;checkpoint?:BattleCheckpoint;checkpointState?:BattleState;state:BattleState;};
function cloneState(state:BattleState):BattleState{return JSON.parse(JSON.stringify(state)) as BattleState}
function normalize(parsed:SavedBattle):SavedBattle{const phase=parsed.phase||'player',checkpoint=parsed.checkpoint||(phase==='intro'?'intro':'stable-player'),checkpointState=parsed.checkpointState?cloneState(parsed.checkpointState):cloneState(parsed.state);return{...parsed,version:3,stats:{...emptyBattleStats(),...(parsed.stats||{})},phase,checkpoint,checkpointState}}
function recoverInterrupted(saved:SavedBattle):SavedBattle{const normalized=normalize(saved);if((normalized.phase==='enemy'||normalized.phase==='combat')&&normalized.checkpointState)return{...normalized,state:cloneState(normalized.checkpointState),phase:'player',checkpoint:'stable-player',updatedAt:Date.now()};if(normalized.phase==='result')return{...normalized,phase:'player',checkpoint:'stable-player'};return normalized}
export function loadBattle():SavedBattle|null{try{const raw=localStorage.getItem(ACTIVE_KEY);if(raw){const recovered=recoverInterrupted(JSON.parse(raw) as SavedBattle);if(recovered.phase==='player')saveBattle(recovered);return recovered}const legacyRaw=localStorage.getItem(LEGACY_ACTIVE_KEY);if(!legacyRaw)return null;const migrated=recoverInterrupted(JSON.parse(legacyRaw) as SavedBattle);saveBattle(migrated);localStorage.removeItem(LEGACY_ACTIVE_KEY);return migrated}catch{return null}}
export function saveBattle(saved:SavedBattle){localStorage.setItem(ACTIVE_KEY,JSON.stringify({...normalize(saved),updatedAt:Date.now()}))}
export function clearBattle(){localStorage.removeItem(ACTIVE_KEY);localStorage.removeItem(LEGACY_ACTIVE_KEY)}
export function finishBattle(saved:SavedBattle,result:BattleResult){const endedAt=Date.now(),entry:BattleHistoryEntry={id:`match-${saved.startedAt}`,startedAt:saved.startedAt,endedAt,durationMs:Math.max(0,endedAt-saved.startedAt),result,turns:saved.state.turn,playerHp:saved.state.player.heroHp,enemyHp:saved.state.enemy.heroHp,maxMomentum:saved.maxMomentum,stats:{...emptyBattleStats(),...(saved.stats||{})}};try{const current=JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]') as BattleHistoryEntry[];localStorage.setItem(HISTORY_KEY,JSON.stringify([entry,...current].slice(0,30)))}catch{localStorage.setItem(HISTORY_KEY,JSON.stringify([entry]))}clearBattle();return entry}
export function loadBattleHistory():BattleHistoryEntry[]{try{const rows=JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]') as BattleHistoryEntry[];return rows.map(row=>({...row,durationMs:row.durationMs??Math.max(0,(row.endedAt??0)-(row.startedAt??0)),stats:{...emptyBattleStats(),...(row.stats||{})}}))}catch{return[]}}
