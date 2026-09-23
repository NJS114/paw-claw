import {useEffect,useRef,useState} from 'react';
import {GameAsset} from './GameAsset';
import {LobbyIcon} from './LobbyIcon';
import {GameCard} from './GameCard';
import {cards} from './data/gameCards';
import {xpForLevel,type Progression} from './data/progression';
import {MISSIONS,type MissionProgress} from './data/missions';
import './layered-home.css';

type LobbyTarget='battle'|'collection'|'deck'|'progression'|'shop'|'boosters'|'profile';
type Props={progress:Progression;ownedCount:number;missions?:MissionProgress;onNavigate:(target:LobbyTarget)=>void};
const art='/assets/layered-home/';
const pirates=cards.filter(c=>c.family==='Pirates').slice(0,3);

function PiratePreview({onClose,onNavigate}:{onClose:()=>void;onNavigate:Props['onNavigate']}){
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const el=dialog.current!;if(typeof el.showModal==='function')el.showModal();else el.setAttribute('open','');return()=>el.close?.()},[]);
 return <dialog ref={dialog} className="depth-dialog" aria-labelledby="pirate-title" onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
  <article className="pirate-panel">
   <div className="pirate-scene" aria-hidden="true"/>
   <img className="pirate-hero pirate-cat" src={art+'pirate-cat.webp'} alt=""/>
   <img className="pirate-hero pirate-dog" src={art+'pirate-dog.webp'} alt=""/>
   <header className="pirate-ribbon"><span>À LA DÉCOUVERTE DES ÉQUIPAGES</span><h2 id="pirate-title">Duel des pirates</h2></header>
   <button className="depth-close" autoFocus onClick={onClose} aria-label="Fermer l’événement">×</button>
   <div className="pirate-copy"><span className="depth-pill">Chats contre chiens</span><p>Choisis ton équipage.<br/>Prépare ton prochain duel.</p></div>
   <div className="pirate-cards" aria-label="Aperçu des cartes Pirates">{pirates.map(c=><div key={c.id}><GameCard card={c} variant="compact"/></div>)}</div>
   <div className="pirate-actions"><button className="depth-gold" onClick={()=>onNavigate('deck')}>Préparer mon équipe <span aria-hidden="true">›</span></button><button className="pirate-collection" onClick={()=>onNavigate('collection')}>Découvrir la collection</button></div>
  </article>
 </dialog>
}

export function MobileLobby({progress,ownedCount,missions,onNavigate}:Props){
 const [event,setEvent]=useState(false);
 const [paused,setPaused]=useState(()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches);
 const scene=useRef<HTMLElement>(null);
 const quest=MISSIONS.find(m=>m.id==='daily-play-3')!;
 const count=Math.min(quest.target,missions?.counts[quest.id]??0);
 const claimed=missions?.claimed.includes(quest.id)??false;
 useEffect(()=>{
  const media=typeof matchMedia==='function'?matchMedia('(prefers-reduced-motion: reduce)'):null;
  const change=()=>setPaused(media?.matches??false);media?.addEventListener('change',change);
  return()=>media?.removeEventListener('change',change);
 },[]);
 const reset=()=>{scene.current?.style.setProperty('--mx','0');scene.current?.style.setProperty('--my','0')};
 useEffect(()=>{if(paused)reset()},[paused]);
 const go=(target:LobbyTarget)=>{setEvent(false);onNavigate(target)};
 return <section ref={scene} className="depth-lobby" data-motion={paused?'paused':'playing'} aria-label="Accueil Paw & Claw" onPointerMove={e=>{if(paused||e.pointerType!=='mouse')return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--mx',String((e.clientX-r.left)/r.width-.5));e.currentTarget.style.setProperty('--my',String((e.clientY-r.top)/r.height-.5))}} onPointerLeave={reset}>
  <div className="depth-world" aria-hidden="true"><img src={art+'village.webp'} alt="" fetchPriority="high"/></div>
  <div className="depth-light" aria-hidden="true"/>
  <header className="depth-topbar">
   <button className="depth-profile" onClick={()=>go('profile')} aria-label="Ouvrir le profil"><img src={art+'cat.webp'} alt=""/><span><strong>Gardien du Royaume</strong><small>Niveau {progress.level}</small><progress aria-label="Expérience du joueur" value={progress.xp} max={xpForLevel(progress.level)}/></span></button>
   <div className="depth-wallet" aria-label="Ressources"><span><GameAsset assetId="icon.coins" decorative/><b>{progress.coins}</b><small>Pièces</small></span><span><GameAsset assetId="icon.gems" decorative/><b>{progress.gems}</b><small>Gemmes</small></span></div>
  </header>
  <div className="depth-brand"><span>BIENVENUE AU ROYAUME</span><h1>Paw <i>&amp;</i> Claw</h1><p>Deux rivaux. Une grande aventure.</p></div>
  <nav className="depth-side" aria-label="Activités du royaume"><button onClick={()=>go('progression')}><LobbyIcon name="scroll"/><span>Missions</span></button><button onClick={()=>go('collection')}><LobbyIcon name="cards"/><span>Collection</span><small>{ownedCount} cartes</small></button><button onClick={()=>go('progression')}><LobbyIcon name="crown"/><span>Passe</span></button></nav>
  <div className="depth-heroes" aria-hidden="true"><div className="depth-hero depth-cat"><img src={art+'cat.webp'} alt=""/></div><div className="depth-hero depth-dog"><img src={art+'dog.webp'} alt=""/></div></div>
  <button className="depth-event" onClick={()=>setEvent(true)} aria-haspopup="dialog"><span className="depth-event-picture"><img src={art+'pirate-cat.webp'} alt=""/><img src={art+'pirate-dog.webp'} alt=""/></span><strong>Duel des pirates</strong><small>Découvrir les équipages <span aria-hidden="true">›</span></small></button>
  <button className="depth-motion" onClick={()=>setPaused(v=>!v)} aria-label={paused?'Reprendre les animations':'Mettre les animations en pause'} aria-pressed={paused}>{paused?'▷':'Ⅱ'}</button>
  <div className="depth-foliage" aria-hidden="true"><img src={art+'foliage.webp'} alt=""/><img src={art+'foliage.webp'} alt=""/></div>
  <div className="depth-quest"><div><span>QUÊTE DU JOUR</span><strong>{quest.description}</strong><progress aria-label="Progression de la quête du jour" value={count} max={quest.target}/></div><button onClick={()=>go('progression')} aria-label={claimed?'Récompense récupérée':count===quest.target?'Récupérer la récompense':'Voir les récompenses'}>{count}/{quest.target}<span aria-hidden="true">›</span></button></div>
  <nav className="depth-dock" aria-label="Navigation de l’accueil">
   <button aria-current="page"><LobbyIcon name="home"/><span>Accueil</span></button>
   <button onClick={()=>go('deck')}><LobbyIcon name="cards"/><span>Decks</span></button>
   <button className="depth-combat depth-gold" onClick={()=>go('battle')} aria-label="Jouer en arène"><LobbyIcon name="swords"/><span>Combattre</span></button>
   <button onClick={()=>go('shop')}><LobbyIcon name="shop"/><span>Boutique</span></button>
   <button onClick={()=>go('boosters')}><LobbyIcon name="gift"/><span>Boosters</span><small>{progress.sealedBoosters} disponible{progress.sealedBoosters!==1?'s':''}</small></button>
  </nav>
  {event&&<PiratePreview onClose={()=>setEvent(false)} onNavigate={go}/>}
 </section>
}
