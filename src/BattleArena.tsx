import { useEffect, useMemo, useRef, useState } from 'react';
import { cards, type CardData } from './data/gameCards';
import { beginTurn, momentumLabel, playUnit, resolveCombat, resolveEndTurn, type BattleSideState, type BattleState } from './data/battleEngine';
import { synergies } from './data/synergies';
import { clearBattle, finishBattle, loadBattle, saveBattle, type SavedBattle } from './data/battleSession';

const generatedBase='/assets/generated/';
const battlefield=`${generatedBase}chatgpt-image-6-sept.-2026-01_35_40.webp`;
const familySheet:Record<string,string>={
  Magiciens:'chatgpt-image-7-sept.-2026-15_03_35.webp',
  Ombres:'chatgpt-image-7-sept.-2026-15_03_31.webp',
  Nobles:'chatgpt-image-7-sept.-2026-15_07_01.webp',
  Robots:'chatgpt-image-7-sept.-2026-15_01_47.webp',
  Nature:'chatgpt-image-7-sept.-2026-22_07_59.webp',
  Guérisseurs:'chatgpt-image-7-sept.-2026-15_03_15.webp',
  Créatures:'chatgpt-image-7-sept.-2026-15_04_45.webp'
};

type Phase='intro'|'player'|'enemy'|'combat'|'result';
type Result='win'|'lose'|null;

function rc(r:string){return r.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function artFor(card:CardData){return card.assetPath||`${generatedBase}${familySheet[card.family]||'carte-bleue.webp'}`}
function emptyBoard(){return Array(7).fill(null)}
function shuffle<T>(input:T[]){const a=[...input];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

function createSide(pool:CardData[]):BattleSideState{
  const deck=shuffle(pool);
  return {board:emptyBoard(),heroHp:20,energy:5,hand:deck.slice(0,5),deck:deck.slice(5),shield:0,momentum:0,survivalUsed:false,pirateDrawUsed:false,healerSaveUsed:false,firstPlayDone:false};
}
function createBattle(playerPool:CardData[],enemyPool:CardData[]):SavedBattle{
  const state:BattleState={player:createSide(playerPool),enemy:createSide(enemyPool),turn:1,log:['Le duel commence.']};
  return {version:2,startedAt:Date.now(),updatedAt:Date.now(),maxMomentum:0,state};
}
function drawOne(side:BattleSideState){if(side.hand.length>=5||!side.deck[0])return side;return {...side,hand:[...side.hand,side.deck[0]],deck:side.deck.slice(1)}}

export function BattleArena({playerPool,onWin,onLose}:{playerPool:CardData[];onWin:()=>void;onLose:()=>void}){
  const enemyPool=useMemo(()=>cards.filter(c=>c.type==='Héros').slice(8,36),[]);
  const initial=useMemo(()=>loadBattle()||createBattle(playerPool,enemyPool),[playerPool,enemyPool]);
  const [saved,setSaved]=useState<SavedBattle>(initial);
  const [phase,setPhase]=useState<Phase>(()=>loadBattle()?'player':'intro');
  const [selected,setSelected]=useState<string|null>(null);
  const [result,setResult]=useState<Result>(null);
  const [banner,setBanner]=useState('Prépare ton premier tour');
  const rewarded=useRef(false);
  const state=saved.state;
  const playerSyn=synergies(state.player,state.enemy);
  const enemySyn=synergies(state.enemy,state.player);

  useEffect(()=>{if(phase!=='result')saveBattle(saved)},[saved,phase]);
  useEffect(()=>{
    if(state.player.heroHp<=0&&!result){endMatch('lose')}
    else if(state.enemy.heroHp<=0&&!result){endMatch('win')}
  },[state.player.heroHp,state.enemy.heroHp,result]);

  function patchState(next:BattleState,extra?:Partial<SavedBattle>){
    const maxMomentum=Math.max(saved.maxMomentum,next.player.momentum);
    setSaved({...saved,...extra,maxMomentum,state:next,updatedAt:Date.now()});
  }
  function start(){
    let player=beginTurn(state.player,state.enemy);player=drawOne(player);
    patchState({...state,player,log:['Tour 1 : à toi de jouer.']});
    setPhase('player');setBanner('À toi de jouer');
  }
  function select(card:CardData){if(phase!=='player')return;setSelected(selected===card.id?null:card.id)}
  function place(slot:number){
    if(phase!=='player'||!selected)return;
    const card=state.player.hand.find(c=>c.id===selected);if(!card)return;
    const nextPlayer=playUnit(state.player,state.enemy,card,slot);
    if(nextPlayer===state.player)return;
    patchState({...state,player:nextPlayer,log:[`${card.name} entre en jeu sur la ligne ${slot+1}.`,...state.log].slice(0,5)});
    setSelected(null);setBanner(`${card.name} est en position`);
  }
  function enemyTurn(){
    setPhase('enemy');setBanner('Le rival prépare sa réponse');
    setTimeout(()=>{
      let enemy=beginTurn(state.enemy,state.player);enemy=drawOne(enemy);
      const empties=enemy.board.map((u,i)=>u? -1:i).filter(i=>i>=0);
      const affordable=enemy.hand.filter(c=>c.cost<=enemy.energy);
      if(affordable.length&&empties.length){
        const card=affordable.sort((a,b)=>(b.cost-a.cost))[0];
        const slot=empties[Math.floor(Math.random()*empties.length)];
        enemy=playUnit(enemy,state.player,card,slot);
      }
      const staged={...state,enemy,log:['Le rival a terminé son placement.',...state.log].slice(0,5)};
      patchState(staged);
      setPhase('combat');setBanner('Résolution du combat');
      setTimeout(()=>resolveRound(staged),650);
    },650);
  }
  function resolveRound(current:BattleState){
    const clash=resolveCombat(current.player,current.enemy);
    const end=resolveEndTurn(clash.attacker,clash.defender);
    let player=drawOne(end.side),enemy=drawOne(end.enemy);
    const nextTurn=current.turn+1;
    player=beginTurn(player,enemy);enemy=beginTurn(enemy,player);
    const line=clash.attackerKills||clash.defenderKills
      ? `${clash.attackerKills} unité adverse éliminée, ${clash.defenderKills} unité alliée perdue.`
      : 'Le front tient. Aucun combattant n’est tombé.';
    const next:BattleState={player,enemy,turn:nextTurn,log:[line,`Tour ${nextTurn} : à toi de jouer.`,...current.log].slice(0,5)};
    patchState(next);
    setSelected(null);setPhase('player');setBanner(`Tour ${nextTurn}`);
  }
  function endMatch(value:'win'|'lose'){
    if(rewarded.current)return;rewarded.current=true;
    setResult(value);setPhase('result');setSelected(null);
    finishBattle({...saved,state},value);
    if(value==='win')onWin();else onLose();
    setBanner(value==='win'?'Victoire':'Défaite');
  }
  function newMatch(){
    clearBattle();rewarded.current=false;const fresh=createBattle(playerPool,enemyPool);setSaved(fresh);setResult(null);setSelected(null);setPhase('intro');setBanner('Prépare ton premier tour');
  }

  return <section className={`battle-screen cinematic-battle phase-${phase}`} style={{backgroundImage:`linear-gradient(rgba(4,9,20,.14),rgba(4,9,20,.38)),url('${battlefield}')`}}>
    <div className="battle-vignette"/>
    <div className="battle-header-panel">
      <PlayerStatus name="Rival" hp={state.enemy.heroHp} energy={state.enemy.energy} shield={state.enemy.shield} momentum={state.enemy.momentum} side="enemy"/>
      <div className="turn-center"><span className="turn-label">Tour</span><strong>{state.turn}</strong><span className="phase-label">{banner}</span></div>
      <PlayerStatus name="Toi" hp={state.player.heroHp} energy={state.player.energy} shield={state.player.shield} momentum={state.player.momentum} side="player"/>
    </div>

    <SynergyStrip title="Synergies adverses" items={enemySyn}/>
    <div className="enemy-zone battle-row">{state.enemy.board.map((u,i)=><ArenaSlot key={i} unit={u} index={i} side="enemy"/>)}</div>

    <div className="arena-center cinematic-center">
      <div className={`phase-banner ${phase}`}>{banner}</div>
      <div className="battle-log-panel">{state.log.slice(0,3).map((line,i)=><p key={`${line}-${i}`}>{line}</p>)}</div>
    </div>

    <div className="player-zone battle-row">{state.player.board.map((u,i)=><ArenaSlot key={i} unit={u} index={i} side="player" target={!!selected&&phase==='player'} onClick={()=>place(i)}/>)}</div>
    <SynergyStrip title="Tes synergies" items={playerSyn}/>

    <div className="battle-command-bar">
      <div className="hand-title"><span>Main</span><small>{state.player.hand.length}/5 cartes</small></div>
      <div className="hand cinematic-hand">{state.player.hand.map(c=><button key={c.id} className={`hand-card ${selected===c.id?'selected':''}`} onClick={()=>select(c)} disabled={phase!=='player'||c.cost>state.player.energy}><BattleCard card={c} hp={c.hp??1}/></button>)}</div>
      <button className="end-turn-button" onClick={enemyTurn} disabled={phase!=='player'}>Terminer le tour</button>
    </div>

    {phase==='intro'&&<div className="battle-overlay intro-overlay"><div className="battle-modal"><span className="modal-kicker">Arène classée</span><h2>Le duel commence</h2><p>Construis tes synergies à 3 puis 5 unités. Garde de l’énergie pour préparer un retournement de partie.</p><div className="intro-stats"><span>20 PV</span><span>5 énergie</span><span>7 lignes</span></div><button className="primary" onClick={start}>Entrer dans l’arène</button></div></div>}

    {result&&<div className="battle-overlay result-overlay"><div className={`battle-modal result-card ${result}`}><span className="modal-kicker">Fin de partie</span><h2>{result==='win'?'Victoire dans l’arène':'Le rival remporte le duel'}</h2><p>{result==='win'?'Récompenses : 80 pièces et 60 XP.':'Analyse ton placement, modifie ton deck et relance un duel.'}</p><div className="result-stats"><span><small>Tours</small>{state.turn}</span><span><small>PV restants</small>{state.player.heroHp}</span><span><small>Momentum max</small>{saved.maxMomentum}/5</span></div><button className="primary" onClick={newMatch}>Nouvelle partie</button></div></div>}
  </section>
}

function PlayerStatus({name,hp,energy,shield,momentum,side}:{name:string;hp:number;energy:number;shield:number;momentum:number;side:'player'|'enemy'}){
  return <div className={`status-card ${side}`}><div className="status-name"><strong>{name}</strong><span>{momentumLabel(momentum)}</span></div><div className="status-bars"><Meter label="PV" value={hp} max={20}/><Meter label="Énergie" value={energy} max={8}/><Meter label="Momentum" value={momentum} max={5}/></div>{shield>0&&<span className="shield-badge">Bouclier {shield}</span>}</div>
}
function Meter({label,value,max}:{label:string;value:number;max:number}){return <div className="meter"><div className="meter-label"><span>{label}</span><strong>{value}</strong></div><div className="meter-track"><span style={{width:`${Math.max(0,Math.min(100,value/max*100))}%`}}/></div></div>}
function SynergyStrip({title,items}:{title:string;items:{id:string;title:string;description:string;tier:number}[]}){return <div className="synergy-strip"><span className="synergy-strip-title">{title}</span>{items.length?items.slice(0,4).map(s=><div className={`synergy-chip tier-${s.tier}`} key={s.id}><strong>{s.title}</strong><span>{s.description}</span></div>):<span className="synergy-empty">Aucune synergie active</span>}</div>}
function ArenaSlot({unit,index,side,target,onClick}:{unit:BattleSideState['board'][number];index:number;side:'player'|'enemy';target?:boolean;onClick?:()=>void}){const content=unit?<BattleCard card={unit} hp={unit.currentHp??unit.hp??1}/>:<span className="slot-number">{String(index+1).padStart(2,'0')}</span>;return side==='player'?<button className={`arena-slot ${target&&!unit?'target':''} ${unit?'occupied':''}`} onClick={onClick} disabled={!target&&!!onClick}>{content}</button>:<div className={`arena-slot enemy ${unit?'occupied':''}`}>{content}</div>}
function BattleCard({card,hp}:{card:CardData;hp:number}){return <article className={`battle-card ${rc(card.rarity)}`}><div className="battle-card-top"><span className="card-cost">{card.cost}</span><span className="card-family">{card.family}</span></div><div className="battle-card-art"><img src={artFor(card)} alt={card.name} onError={e=>{(e.currentTarget as HTMLImageElement).src=`${generatedBase}${familySheet[card.family]||'carte-bleue.webp'}`}}/></div><div className="battle-card-copy"><strong>{card.name}</strong><small>{card.rarity}</small></div><div className="battle-card-stats"><span><small>ATQ</small>{card.atk??0}</span><span><small>PV</small>{hp}</span></div></article>}
