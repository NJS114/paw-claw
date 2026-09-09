import { useEffect, useMemo, useState } from 'react';
import { cards, type CardData } from './data/gameCards';

type Unit = { card: CardData; hp: number };
const generatedBase='/assets/generated/';
const familySheet:Record<string,string>={Magiciens:'chatgpt-image-7-sept.-2026-15_03_35.webp',Ombres:'chatgpt-image-7-sept.-2026-15_03_31.webp',Nobles:'chatgpt-image-7-sept.-2026-15_07_01.webp',Robots:'chatgpt-image-7-sept.-2026-15_01_47.webp',Nature:'chatgpt-image-7-sept.-2026-22_07_59.webp',Guérisseurs:'chatgpt-image-7-sept.-2026-15_03_15.webp',Créatures:'chatgpt-image-7-sept.-2026-15_04_45.webp'};

function artFor(card:CardData){return card.assetPath||`${generatedBase}${familySheet[card.family]||'carte-bleue.webp'}`}
function rc(r:string){return r.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function icon(f:string){return ({Armée:'🛡️',Magiciens:'🌀',Nobles:'👑',Ombres:'🌘',Robots:'⚙️',Nature:'🍃',Éléments:'🔥',Guérisseurs:'✚',Pirates:'☠️',Créatures:'✦'} as Record<string,string>)[f]||'🐾'}

export function BattleArena({playerPool,onWin,onLose}:{playerPool:CardData[];onWin:()=>void;onLose:()=>void}){
  const enemyPool=useMemo(()=>cards.filter(c=>c.type==='Héros').slice(8,28),[]);
  const [playerHp,setPlayerHp]=useState(20),[enemyHp,setEnemyHp]=useState(20),[energy,setEnergy]=useState(5),[enemyEnergy,setEnemyEnergy]=useState(5);
  const [playerBoard,setPlayerBoard]=useState<(Unit|null)[]>(Array(7).fill(null)),[enemyBoard,setEnemyBoard]=useState<(Unit|null)[]>(Array(7).fill(null));
  const [hand,setHand]=useState<CardData[]>(playerPool.slice(0,5)),[selected,setSelected]=useState<string|null>(null),[turn,setTurn]=useState(1),[result,setResult]=useState<'win'|'lose'|null>(null),[log,setLog]=useState('À toi de jouer.');
  useEffect(()=>{if(enemyHp<=0&&!result){setResult('win');onWin()}},[enemyHp,result,onWin]);
  useEffect(()=>{if(playerHp<=0&&!result){setResult('lose');onLose()}},[playerHp,result,onLose]);
  function reset(){setPlayerHp(20);setEnemyHp(20);setEnergy(5);setEnemyEnergy(5);setPlayerBoard(Array(7).fill(null));setEnemyBoard(Array(7).fill(null));setHand(playerPool.slice(0,5));setSelected(null);setTurn(1);setResult(null);setLog('À toi de jouer.')}
  function place(i:number){if(result||playerBoard[i]||!selected)return;const card=hand.find(c=>c.id===selected);if(!card||card.cost>energy)return;const b=[...playerBoard];b[i]={card,hp:card.hp??1};setPlayerBoard(b);setHand(h=>h.filter(c=>c.id!==card.id));setEnergy(e=>e-card.cost);setSelected(null);setLog(`${card.name} rejoint l’emplacement ${i+1}.`)}
  function enemyPlay(board:(Unit|null)[],e:number){const affordable=enemyPool.filter(c=>c.cost<=e);const empty=board.map((x,i)=>x? -1:i).filter(i=>i>=0);if(!affordable.length||!empty.length)return {board,energy:e};const card=affordable[Math.floor(Math.random()*affordable.length)],slot=empty[Math.floor(Math.random()*empty.length)];const next=[...board];next[slot]={card,hp:card.hp??1};return {board:next,energy:e-card.cost}}
  function resolveCombat(){let pb=playerBoard.map(u=>u?{...u}:null),eb=enemyBoard.map(u=>u?{...u}:null),pDmg=0,eDmg=0;for(let i=0;i<7;i++){const p=pb[i],e=eb[i];if(p&&e){p.hp-=e.card.atk??0;e.hp-=p.card.atk??0}else if(p&&!e)eDmg+=p.card.atk??0;else if(e&&!p)pDmg+=e.card.atk??0;}pb=pb.map(u=>u&&u.hp>0?u:null);eb=eb.map(u=>u&&u.hp>0?u:null);setPlayerBoard(pb);setEnemyBoard(eb);setPlayerHp(h=>Math.max(0,h-pDmg));setEnemyHp(h=>Math.max(0,h-eDmg));return {pb,eb}}
  function endTurn(){if(result)return;const played=enemyPlay(enemyBoard,enemyEnergy);setEnemyBoard(played.board);setEnemyEnergy(played.energy);setLog('L’IA joue puis les unités combattent…');setTimeout(()=>{resolveCombat();setTurn(t=>t+1);setEnergy(5);setEnemyEnergy(5);setHand(h=>{const used=new Set([...h,...playerBoard.filter(Boolean).map(u=>u!.card)].map(c=>c.id));const draw=playerPool.find(c=>!used.has(c.id));return draw&&h.length<5?[...h,draw]:h});setLog('Nouveau tour. À toi de jouer.');},320)}
  return <section className="battle-screen real-battle" style={{backgroundImage:`linear-gradient(rgba(4,10,24,.18),rgba(4,10,24,.28)),url('${generatedBase}chatgpt-image-6-sept.-2026-01_35_40.webp')`}}>
    <div className="battle-topline"><div className="battle-hud">Rival IA <strong>❤️ {enemyHp}</strong><strong>✨ {enemyEnergy}/5</strong></div><div className="turn-pill">Tour {turn}</div></div>
    <div className="enemy-zone">{enemyBoard.map((u,i)=><div className={`slot ${u?'occupied':''}`} key={i}>{u?<BattleCard unit={u}/>:<span>🐾</span>}</div>)}</div>
    <div className="arena-center"><div className="battle-log">{log}</div></div>
    <div className="player-zone">{playerBoard.map((u,i)=><button className={`slot ${selected&&!u?'target':''}`} key={i} onClick={()=>place(i)}>{u?<BattleCard unit={u}/>:<span>🐾</span>}</button>)}</div>
    <div className="battle-footer"><div className="battle-hud">Joueur <strong>❤️ {playerHp}</strong><strong>✨ {energy}/5</strong></div><div className="hand">{hand.map(c=><button key={c.id} className={`hand-card ${selected===c.id?'selected':''}`} onClick={()=>setSelected(selected===c.id?null:c.id)} disabled={c.cost>energy}><BattleCard unit={{card:c,hp:c.hp??1}}/></button>)}</div><div className="turn-actions"><button className="primary" onClick={endTurn}>Fin du tour</button></div></div>
    {result&&<div className="victory-overlay"><div className="victory-card"><div className="victory-crown">{result==='win'?'👑':'⚔️'}</div><p className="eyebrow">{result==='win'?'VICTOIRE':'DÉFAITE'}</p><h2>{result==='win'?'Arène remportée':'Le rival l’emporte'}</h2><p>{result==='win'?'+80 pièces · +60 XP':'Réessaie avec un autre deck.'}</p><button className="primary" onClick={reset}>Rejouer</button></div></div>}
  </section>
}
function BattleCard({unit}:{unit:Unit}){const c=unit.card;return <article className={`mini-card ${rc(c.rarity)}`}><div className="cost">{c.cost}</div><div className="card-art"><img src={artFor(c)} alt="" onError={e=>{(e.currentTarget as HTMLImageElement).src=`${generatedBase}${familySheet[c.family]||'carte-bleue.webp'}`}}/></div><strong>{c.name}</strong><small>{icon(c.family)} {c.family}</small><div className="stats"><span>⚔️ {c.atk??0}</span><span>❤️ {unit.hp}</span></div></article>}
