import { useEffect,useMemo,useRef,useState,type CSSProperties } from 'react';
import { BattleArena } from './BattleArena';
import { cards,type CardData } from './data/gameCards';
import { speciesOf,type Species } from './data/loreSynergies';
import { clearBattle } from './data/battleSession';

type Phase='search'|'prepare'|'battle';
const PREP_SECONDS=10;
function opposite(species:Species):Species{return species==='Chat'?'Chien':'Chat'}
function deckSpecies(pool:CardData[]):Species{return pool[0]?speciesOf(pool[0]):'Chat'}
function opponentPoolFor(species:Species){const candidates=cards.filter(c=>c.type==='Héros'&&speciesOf(c)===species);if(!candidates.length)return cards.filter(c=>c.type==='Héros').slice(0,20);const out:CardData[]=[];for(let i=0;i<24;i++)out.push(candidates[i%candidates.length]);return out}
export function Matchmaking({playerPool,onWin,onLose,onDraw,onEditDeck}:{playerPool:CardData[];onWin:()=>void;onLose:()=>void;onDraw:()=>void;onEditDeck:()=>void}){
 const playerSpecies=useMemo(()=>deckSpecies(playerPool),[playerPool]),rivalSpecies=opposite(playerSpecies),enemyPool=useMemo(()=>opponentPoolFor(rivalSpecies),[rivalSpecies]);
 const[phase,setPhase]=useState<Phase>('search'),[seconds,setSeconds]=useState(PREP_SECONDS);const searchTimer=useRef<number|null>(null),locked=useRef(false);
 function launch(){if(locked.current)return;locked.current=true;clearBattle();setPhase('battle')}
 useEffect(()=>{if(phase!=='search')return;searchTimer.current=window.setTimeout(()=>setPhase('prepare'),1300);return()=>{if(searchTimer.current)window.clearTimeout(searchTimer.current)}},[phase]);
 useEffect(()=>{if(phase!=='prepare')return;if(seconds<=0){launch();return}const id=window.setTimeout(()=>setSeconds(v=>v-1),1000);return()=>window.clearTimeout(id)},[phase,seconds]);
 if(phase==='battle')return <BattleArena playerPool={playerPool} enemyPool={enemyPool} playerSpecies={playerSpecies} enemySpecies={rivalSpecies} onWin={onWin} onLose={onLose} onDraw={onDraw}/>;
 return <section className="matchmaking-screen"><div className="matchmaking-backdrop"/>{phase==='search'?<div className="match-search-card"><p className="eyebrow">ARÈNE CLASSÉE</p><h1>Recherche d’un adversaire</h1><div className="search-orbit" aria-hidden="true"><span/><span/><span/></div><p>Ton deck <strong>{playerSpecies}</strong> cherche automatiquement un adversaire <strong>{rivalSpecies}</strong>.</p><button onClick={onEditDeck}>Modifier le deck</button></div>:<div className="match-ready-card"><p className="eyebrow">ADVERSAIRE TROUVÉ</p><div className="versus-species"><div><small>TON CAMP</small><strong>{playerSpecies.toUpperCase()}S</strong><span>{playerPool.length} cartes</span></div><b>VS</b><div><small>RIVAL</small><strong>{rivalSpecies.toUpperCase()}S</strong><span>Deck adverse verrouillé</span></div></div><h2>Prépare ton entrée dans l’arène</h2><p>Le deck actif sera verrouillé au lancement. Dix secondes suffisent pour vérifier ton choix sans ralentir la partie.</p><div className="match-countdown" aria-live="polite"><span style={{'--progress':`${seconds/PREP_SECONDS*100}%`} as CSSProperties}>{seconds}</span><small>secondes</small></div><div className="match-actions"><button onClick={onEditDeck}>Changer de deck</button><button className="primary" onClick={launch}>Prêt</button></div></div>}</section>
}
