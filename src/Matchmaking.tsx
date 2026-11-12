import { rivalDeck } from './data/opponentDeck';
import { GameDialog } from './GameDialog';
import { gameStorage } from './data/storage';
import { useEffect,useMemo,useRef,useState,type CSSProperties } from 'react';
import { BattleArena } from './BattleArena';
import { GameAsset } from './GameAsset';
import { cards,type CardData } from './data/gameCards';
import { speciesOf,type Species } from './data/loreSynergies';
import { clearBattle, loadBattle } from './data/battleSession';

type Phase='search'|'prepare'|'battle';
const PREP_SECONDS=10;
const GUIDE_KEY='paw-claw.combat-guide.seen.v1';
function opposite(species:Species):Species{return species==='Chat'?'Chien':'Chat'}
function deckSpecies(pool:CardData[]):Species{return pool[0]?speciesOf(pool[0]):'Chat'}

function loadGuide(){try{return gameStorage.getItem(GUIDE_KEY)!=='1'}catch{return true}}
export function Matchmaking({playerPool,onWin,onLose,onDraw,onEditDeck,onAbandon}:{playerPool:CardData[];onWin:()=>void;onLose:()=>void;onDraw:()=>void;onEditDeck:()=>void;onAbandon?:()=>void}){
 const[resume,setResume]=useState(()=>loadBattle()),[discard,setDiscard]=useState(false);
 const playerSpecies=useMemo(()=>deckSpecies(resume?[...resume.state.player.hand,...resume.state.player.deck,...resume.state.player.board.filter((c):c is NonNullable<typeof c>=>Boolean(c))]:playerPool),[playerPool,resume]),rivalSpecies=opposite(playerSpecies),enemyPool=useMemo(()=>rivalDeck(rivalSpecies),[rivalSpecies]);
 const[phase,setPhase]=useState<Phase>('search'),[seconds,setSeconds]=useState(PREP_SECONDS),[guideOpen,setGuideOpen]=useState(loadGuide);const searchTimer=useRef<number|null>(null),locked=useRef(false);
 function launch(){if(locked.current)return;locked.current=true;try{gameStorage.setItem(GUIDE_KEY,'1')}catch{}clearBattle();setPhase('battle')}
 useEffect(()=>{if(phase!=='search'||resume)return;searchTimer.current=window.setTimeout(()=>setPhase('prepare'),1300);return()=>{if(searchTimer.current)window.clearTimeout(searchTimer.current)}},[phase,resume]);
 useEffect(()=>{if(phase!=='prepare')return;if(seconds<=0){launch();return}const id=window.setTimeout(()=>setSeconds(v=>v-1),1000);return()=>window.clearTimeout(id)},[phase,seconds]);
 if(resume&&phase!=='battle')return <section className="matchmaking-screen match-resume"><GameAsset assetId="world.matchmaking" className="matchmaking-world" decorative/><div className="royal-resume-panel"><p className="eyebrow">DUEL SAUVEGARDÉ</p><h2>Un duel t’attend</h2><p>Tour {resume.state.turn} · {resume.state.player.heroHp} PV. Reprends ta place dans l’arène.</p><button className="primary" onClick={()=>{locked.current=true;setPhase('battle')}}>Reprendre le duel</button><button onClick={()=>setDiscard(true)}>Abandonner ce duel</button></div>{discard&&<GameDialog title="Abandonner le duel ?" onClose={()=>setDiscard(false)}><p>Ce duel sera compté comme une défaite, sans récompense.</p><button onClick={()=>{clearBattle();onAbandon?.();setResume(null);setDiscard(false)}}>Confirmer l’abandon</button><button onClick={()=>setDiscard(false)}>Continuer mon duel</button></GameDialog>}</section>;
 if(phase==='battle')return <BattleArena playerPool={playerPool} enemyPool={enemyPool} playerSpecies={playerSpecies} enemySpecies={rivalSpecies} onWin={onWin} onLose={onLose} onDraw={onDraw} onAbandon={onAbandon}/>;
 return <section className={`matchmaking-screen matchmaking-${phase}`}>
  <GameAsset assetId="world.matchmaking" className="matchmaking-world" decorative loading="eager"/>
  <div className="matchmaking-backdrop"/>
  {phase==='search'?<div className="match-search-card game-panel-v2">
   <p className="eyebrow">DUEL SOLO · ADVERSAIRE IA</p><h1>Préparation du duel</h1>
   <div className="match-search-visual"><GameAsset assetId="character.royal-cat" className="match-hero match-hero-player" decorative/><div className="search-orbit" aria-hidden="true"><span/><span/><span/></div><GameAsset assetId="character.shadow-dog" className="match-hero match-hero-rival" decorative/></div>
   <p>Ton deck <strong>{playerSpecies}</strong> affronte un rival IA <strong>{rivalSpecies}</strong>.</p><small className="match-subcopy">Duel hors ligne · aucune connexion requise · difficulté au choix</small>
   <button onClick={onEditDeck}>Modifier le deck</button>
  </div>:<div className="match-ready-card game-panel-v2">
   <p className="eyebrow">RIVAL IA PRÊT</p>
   <div className="versus-stage"><div className="versus-character player"><GameAsset assetId="character.royal-cat" decorative/><small>TON CAMP</small><strong>{playerSpecies.toUpperCase()}S</strong><span>{playerPool.length} cartes</span></div><div className="versus-mark"><b>VS</b><span>DUEL</span></div><div className="versus-character rival"><GameAsset assetId="character.shadow-dog" decorative/><small>RIVAL</small><strong>{rivalSpecies.toUpperCase()}S</strong><span>Deck adverse verrouillé</span></div></div>
   <h2>Prépare ton entrée dans l’arène</h2><p>Le deck actif sera verrouillé au lancement. Dix secondes suffisent pour vérifier ton choix sans ralentir la partie.</p>
   <button className="combat-guide-toggle" onClick={()=>setGuideOpen(v=>!v)} aria-expanded={guideOpen}>{guideOpen?'Masquer le guide':'Règles du combat'}</button>
   {guideOpen&&<div className="combat-guide" role="note"><div><strong>1. Construis le front</strong><span>Pose tes cartes dans l’une des 7 lignes. Une carte ennemie en face provoque un duel simultané.</span></div><div><strong>2. Gère ton énergie</strong><span>Chaque carte coûte de l’énergie. Les familles, le Momentum et les histoires peuvent modifier un tour.</span></div><div><strong>3. Anticipe la pioche</strong><span>Main limitée à 5 cartes. Quand la pioche est vide, la fatigue augmente à chaque nouvelle tentative de pioche.</span></div><div><strong>4. Fin de partie</strong><span>Le premier héros à 0 PV perd. Double K.O. ou limite de 40 tours : égalité.</span></div></div>}
   <div className="match-countdown" aria-live="polite"><span style={{'--progress':`${seconds/PREP_SECONDS*100}%`} as CSSProperties}>{seconds}</span><small>secondes</small></div><div className="match-actions"><button onClick={onEditDeck}>Changer de deck</button><button className="primary" onClick={launch}>Prêt</button></div>
  </div>}
 </section>
}
