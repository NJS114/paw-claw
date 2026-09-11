export type PassReward={type:'coins'|'gems'|'booster';amount:number;label:string};
export type PassTier={level:number;xp:number;free:PassReward;premium:PassReward};
export type BattlePassState={version:1;season:string;xp:number;premium:boolean;claimedFree:number[];claimedPremium:number[]};
const KEY='paw-claw.battle-pass.v1';
export const PASS_TIERS:PassTier[]=[
 {level:1,xp:0,free:{type:'coins',amount:80,label:'80 pièces'},premium:{type:'gems',amount:20,label:'20 gemmes'}},
 {level:2,xp:100,free:{type:'booster',amount:1,label:'1 booster'},premium:{type:'coins',amount:140,label:'140 pièces'}},
 {level:3,xp:200,free:{type:'coins',amount:100,label:'100 pièces'},premium:{type:'gems',amount:25,label:'25 gemmes'}},
 {level:4,xp:300,free:{type:'coins',amount:120,label:'120 pièces'},premium:{type:'booster',amount:1,label:'1 booster'}},
 {level:5,xp:400,free:{type:'gems',amount:10,label:'10 gemmes'},premium:{type:'coins',amount:180,label:'180 pièces'}},
 {level:6,xp:500,free:{type:'booster',amount:1,label:'1 booster'},premium:{type:'gems',amount:30,label:'30 gemmes'}},
 {level:7,xp:600,free:{type:'coins',amount:140,label:'140 pièces'},premium:{type:'booster',amount:1,label:'1 booster'}},
 {level:8,xp:700,free:{type:'coins',amount:160,label:'160 pièces'},premium:{type:'gems',amount:35,label:'35 gemmes'}},
 {level:9,xp:800,free:{type:'gems',amount:15,label:'15 gemmes'},premium:{type:'coins',amount:220,label:'220 pièces'}},
 {level:10,xp:900,free:{type:'booster',amount:1,label:'1 booster'},premium:{type:'gems',amount:50,label:'50 gemmes'}},
];
function currentSeason(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`}
function fresh():BattlePassState{return{version:1,season:currentSeason(),xp:0,premium:false,claimedFree:[],claimedPremium:[]}}
function normalize(s:BattlePassState){return s.season===currentSeason()?s:fresh()}
export function loadBattlePass():BattlePassState{try{return normalize(JSON.parse(localStorage.getItem(KEY)||'null')||fresh())}catch{return fresh()}}
export function saveBattlePass(s:BattlePassState){try{localStorage.setItem(KEY,JSON.stringify(normalize(s)))}catch{}}
export function addBattlePassXp(s:BattlePassState,amount:number){const state=normalize(s);return{...state,xp:Math.max(0,state.xp+Math.max(0,amount))}}
export function unlockPremium(s:BattlePassState){return{...normalize(s),premium:true}}
export function claimPassReward(s:BattlePassState,level:number,lane:'free'|'premium'){
 const state=normalize(s),tier=PASS_TIERS.find(t=>t.level===level);if(!tier||state.xp<tier.xp)return null;
 if(lane==='premium'&&!state.premium)return null;
 const claimed=lane==='free'?state.claimedFree:state.claimedPremium;if(claimed.includes(level))return null;
 return{reward:lane==='free'?tier.free:tier.premium,state:{...state,[lane==='free'?'claimedFree':'claimedPremium']:[...claimed,level]}};
}
export function passLevel(s:BattlePassState){const rows=PASS_TIERS.filter(t=>s.xp>=t.xp);return rows.length?rows[rows.length-1].level:1}
