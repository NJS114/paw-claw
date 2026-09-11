export type MissionKind='play'|'win'|'open-booster';
export type MissionCadence='daily'|'weekly';
export type Mission={id:string;label:string;description:string;kind:MissionKind;target:number;coins:number;gems:number;passXp:number;cadence:MissionCadence};
export const MISSIONS:Mission[]=[
 {id:'daily-play-3',label:'Entrer dans l’arène',description:'Jouer 3 combats.',kind:'play',target:3,coins:40,gems:0,passXp:35,cadence:'daily'},
 {id:'daily-win-1',label:'Prendre l’avantage',description:'Gagner 1 combat.',kind:'win',target:1,coins:50,gems:2,passXp:45,cadence:'daily'},
 {id:'daily-booster-1',label:'Nouvelle recrue',description:'Ouvrir 1 booster.',kind:'open-booster',target:1,coins:30,gems:0,passXp:30,cadence:'daily'},
 {id:'weekly-play-10',label:'Habitué de l’arène',description:'Jouer 10 combats.',kind:'play',target:10,coins:160,gems:3,passXp:120,cadence:'weekly'},
 {id:'weekly-win-5',label:'Domination',description:'Gagner 5 combats.',kind:'win',target:5,coins:220,gems:8,passXp:170,cadence:'weekly'},
 {id:'weekly-booster-5',label:'Collectionneur',description:'Ouvrir 5 boosters.',kind:'open-booster',target:5,coins:120,gems:3,passXp:110,cadence:'weekly'},
];
export type MissionProgress={version:2;dailyKey:string;weeklyKey:string;counts:Record<string,number>;claimed:string[]};
const KEY='paw-claw.missions.v1';
function dateKey(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function weekKey(d=new Date()){const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setDate(x.getDate()-((x.getDay()+6)%7));return dateKey(x)}
function fresh():MissionProgress{return{version:2,dailyKey:dateKey(),weeklyKey:weekKey(),counts:{},claimed:[]}}
function normalize(p:MissionProgress):MissionProgress{const d=dateKey(),w=weekKey();let counts={...(p.counts||{})},claimed=[...(p.claimed||[])];if(p.dailyKey!==d){for(const m of MISSIONS.filter(x=>x.cadence==='daily')){delete counts[m.id];claimed=claimed.filter(id=>id!==m.id)}}if(p.weeklyKey!==w){for(const m of MISSIONS.filter(x=>x.cadence==='weekly')){delete counts[m.id];claimed=claimed.filter(id=>id!==m.id)}}return{version:2,dailyKey:d,weeklyKey:w,counts,claimed}}
export function loadMissionProgress():MissionProgress{try{const raw=JSON.parse(localStorage.getItem(KEY)||'null');if(!raw)return fresh();if(raw.version===2)return normalize(raw);const migrated=fresh();for(const m of MISSIONS)migrated.counts[m.id]=raw.counts?.[m.kind]??0;migrated.claimed=raw.claimed??[];return migrated}catch{return fresh()}}
export function saveMissionProgress(p:MissionProgress){try{localStorage.setItem(KEY,JSON.stringify(normalize(p)))}catch{}}
export function recordMission(state:MissionProgress,kind:MissionKind,amount=1){const next=normalize(state),counts={...next.counts};for(const m of MISSIONS.filter(x=>x.kind===kind))counts[m.id]=Math.min(m.target,(counts[m.id]??0)+amount);return{...next,counts}}
export function claimMission(state:MissionProgress,id:string){const next=normalize(state),mission=MISSIONS.find(m=>m.id===id);if(!mission||next.claimed.includes(id)||(next.counts[id]??0)<mission.target)return null;return{mission,state:{...next,claimed:[...next.claimed,id]}}}
