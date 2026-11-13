import { gameStorage } from './storage';
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
function isState(value:unknown):value is BattleState{
 if(!value||typeof value!=='object')return false;
 const state=value as BattleState;
 const side=(s:BattleState['player'])=>s&&Number.isFinite(s.heroHp)&&Number.isFinite(s.energy)&&Number.isFinite(s.shield)&&Number.isFinite(s.momentum)&&Array.isArray(s.board)&&s.board.length===7&&Array.isArray(s.hand)&&s.hand.length<=5&&Array.isArray(s.deck)&&s.deck.length<=100&&[...s.hand,...s.deck,...s.board.filter(Boolean)].every(c=>c&&typeof c.id==='string'&&typeof c.name==='string'&&typeof c.family==='string'&&Number.isFinite(c.cost));
 return Number.isInteger(state.turn)&&state.turn>=1&&Array.isArray(state.log)&&state.log.every(s=>typeof s==='string')&&Boolean(side(state.player)&&side(state.enemy));
}
function readSaved(raw:string):SavedBattle|null{
 const parsed=JSON.parse(raw) as SavedBattle;
 if(!parsed||(parsed.version!==2&&parsed.version!==3)||!Number.isFinite(parsed.startedAt)||!isState(parsed.state)||(parsed.checkpointState&&!isState(parsed.checkpointState)))return null;
 if(parsed.phase&&!['intro','player','enemy','combat','result'].includes(parsed.phase))return null;
 return parsed;
}
function cloneState(state:BattleState):BattleState{return JSON.parse(JSON.stringify(state)) as BattleState}
function normalize(parsed:SavedBattle):SavedBattle{const phase=parsed.phase||'player',checkpoint=parsed.checkpoint||(phase==='intro'?'intro':'stable-player'),checkpointState=parsed.checkpointState?cloneState(parsed.checkpointState):cloneState(parsed.state);return{...parsed,version:3,stats:{...emptyBattleStats(),...(parsed.stats||{})},phase,checkpoint,checkpointState}}
function recoverInterrupted(saved:SavedBattle):SavedBattle{const normalized=normalize(saved);if((normalized.phase==='enemy'||normalized.phase==='combat')&&normalized.checkpointState)return{...normalized,state:cloneState(normalized.checkpointState),phase:'player',checkpoint:'stable-player',updatedAt:Date.now()};if(normalized.phase==='result')return{...normalized,phase:'player',checkpoint:'stable-player'};return normalized}
export function loadBattle():SavedBattle|null{try{const raw=gameStorage.getItem(ACTIVE_KEY);if(raw){const recovered=recoverInterrupted(readSaved(raw)??(()=>{throw new Error('Invalid battle')})());if(recovered.phase==='player')saveBattle(recovered);return recovered}const legacyRaw=gameStorage.getItem(LEGACY_ACTIVE_KEY);if(!legacyRaw)return null;const migrated=recoverInterrupted(readSaved(legacyRaw)??(()=>{throw new Error('Invalid battle')})());saveBattle(migrated);gameStorage.removeItem(LEGACY_ACTIVE_KEY);return migrated}catch{return null}}
export function saveBattle(saved:SavedBattle){gameStorage.setItem(ACTIVE_KEY,JSON.stringify({...normalize(saved),updatedAt:Date.now()}))}
export function clearBattle(){gameStorage.removeItem(ACTIVE_KEY);gameStorage.removeItem(LEGACY_ACTIVE_KEY)}
export function finishBattle(saved:SavedBattle,result:BattleResult){const endedAt=Date.now(),entry:BattleHistoryEntry={id:`match-${saved.startedAt}`,startedAt:saved.startedAt,endedAt,durationMs:Math.max(0,endedAt-saved.startedAt),result,turns:saved.state.turn,playerHp:saved.state.player.heroHp,enemyHp:saved.state.enemy.heroHp,maxMomentum:saved.maxMomentum,stats:{...emptyBattleStats(),...(saved.stats||{})}};try{const current=JSON.parse(gameStorage.getItem(HISTORY_KEY)||'[]') as BattleHistoryEntry[];gameStorage.setItem(HISTORY_KEY,JSON.stringify([entry,...current].slice(0,30)))}catch{gameStorage.setItem(HISTORY_KEY,JSON.stringify([entry]))}clearBattle();return entry}
export function loadBattleHistory():BattleHistoryEntry[]{try{const rows=JSON.parse(gameStorage.getItem(HISTORY_KEY)||'[]') as BattleHistoryEntry[];return rows.map(row=>({...row,durationMs:row.durationMs??Math.max(0,(row.endedAt??0)-(row.startedAt??0)),stats:{...emptyBattleStats(),...(row.stats||{})}}))}catch{return[]}}
