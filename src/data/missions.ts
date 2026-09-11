export type MissionKind='play'|'win'|'open-booster';
export type Mission={id:string;label:string;kind:MissionKind;target:number;coins:number;gems:number};
export const MISSIONS:Mission[]=[
 {id:'daily-play-3',label:'Jouer 3 combats',kind:'play',target:3,coins:120,gems:0},
 {id:'daily-win-1',label:'Gagner 1 combat',kind:'win',target:1,coins:80,gems:3},
 {id:'daily-booster-1',label:'Ouvrir 1 booster',kind:'open-booster',target:1,coins:60,gems:0},
 {id:'weekly-win-5',label:'Gagner 5 combats',kind:'win',target:5,coins:400,gems:15},
];
export type MissionProgress={counts:Record<MissionKind,number>;claimed:string[]};
const KEY='paw-claw.missions.v1';
export function loadMissionProgress():MissionProgress{try{return{counts:{play:0,win:0,'open-booster':0},claimed:[],...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return{counts:{play:0,win:0,'open-booster':0},claimed:[]}}}
export function saveMissionProgress(p:MissionProgress){try{localStorage.setItem(KEY,JSON.stringify(p))}catch{}}
export function recordMission(kind:MissionKind){const p=loadMissionProgress();const next={...p,counts:{...p.counts,[kind]:(p.counts[kind]??0)+1}};saveMissionProgress(next);return next}
