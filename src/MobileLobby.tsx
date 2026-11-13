import {useEffect,useState} from 'react';
import {gameStorage} from './data/storage';
import {GameAsset} from './GameAsset';
import {CozyIcon,CozyNavContent} from './CozyUi';
import {GameDialog} from './GameDialog';
import {xpForLevel,type Progression} from './data/progression';
import {MISSIONS,type MissionProgress} from './data/missions';
import './layered-home.css';

type LobbyTarget='battle'|'collection'|'deck'|'progression'|'shop'|'boosters'|'profile';
type Props={progress:Progression;ownedCount:number;missions?:MissionProgress;onNavigate:(target:LobbyTarget)=>void};

export function MobileLobby({progress,ownedCount,missions,onNavigate}:Props){
 const[event,setEvent]=useState(false);
 const[paused,setPaused]=useState(()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches);
 const quest=MISSIONS.find(m=>m.id==='daily-play-3')!;
 const count=Math.min(quest.target,missions?.counts[quest.id]??0),claimed=missions?.claimed.includes(quest.id)??false;
 useEffect(()=>{
  const media=typeof matchMedia==='function'?matchMedia('(prefers-reduced-motion: reduce)'):null;
  const change=()=>setPaused((media?.matches??false)||gameStorage.getItem('paw-claw.motion')==='reduced');
  change();media?.addEventListener('change',change);window.addEventListener('paw-motion',change);
  return()=>{media?.removeEventListener('change',change);window.removeEventListener('paw-motion',change)};
 },[]);
 const go=(target:LobbyTarget)=>{setEvent(false);onNavigate(target)};
 return <section className="depth-lobby" data-motion={paused?'paused':'playing'} aria-label="Accueil Paw & Claw">
  <div className="depth-world" aria-hidden="true"><img src="/assets/refined/city.webp" alt="" fetchPriority="high"/></div>
  <div className="depth-light" aria-hidden="true"/>
  <header className="depth-topbar">
   <button className="depth-profile" onClick={()=>go('profile')} aria-label="Ouvrir le profil"><img src="/assets/card-art/v1/mag-007-archimage-persan.webp" alt=""/><span><strong>Gardien du Royaume</strong><small>Niveau {progress.level}</small><progress aria-label="Expérience du joueur" value={progress.xp} max={xpForLevel(progress.level)}/></span></button>
   <div className="depth-wallet" aria-label="Ressources"><span><GameAsset assetId="icon.coins" decorative/><b>{progress.coins}</b><small>Pièces</small></span><span><GameAsset assetId="icon.gems" decorative/><b>{progress.gems}</b><small>Gemmes</small></span></div>
  </header>
  <div className="depth-brand"><span>LE ROYAUME T’ATTEND</span><h1>Paw <i>&amp;</i> Claw</h1><div className="depth-brand-line" aria-hidden="true"/></div>
  <nav className="depth-activities" aria-label="Activités du royaume">
   <button onClick={()=>go('progression')}><CozyIcon name="check"/><span>Missions</span></button>
   <button onClick={()=>go('boosters')} aria-label={`Boosters, ${progress.sealedBoosters} disponible${progress.sealedBoosters!==1?'s':''}`}><CozyIcon name="boosters"/><span>Boosters</span><small>{progress.sealedBoosters} disponible{progress.sealedBoosters!==1?'s':''}</small></button>
   <button onClick={()=>window.dispatchEvent(new Event('paw-stories'))}><CozyIcon name="decks"/><span>Histoires</span></button>
  </nav>
  <button className="depth-event" onClick={()=>setEvent(true)} aria-haspopup="dialog">Duel des pirates <span aria-hidden="true">›</span></button>
  <button className="depth-motion" onClick={()=>setPaused(v=>!v)} aria-label={paused?'Reprendre les animations':'Mettre les animations en pause'} aria-pressed={paused}><CozyIcon name={paused?'play':'pause'}/></button>
  <div className="depth-heroes" aria-hidden="true"><img src="/assets/refined/heroes.webp" alt=""/></div>
  <div className="depth-quest"><div><strong>{quest.description}</strong><progress aria-label="Progression de la quête du jour" value={count} max={quest.target}/></div><button onClick={()=>go('progression')} aria-label={claimed?'Récompense récupérée':count===quest.target?'Récupérer la récompense':'Voir les récompenses'}>{count}/{quest.target}<span aria-hidden="true"> ›</span></button></div>
  <button className="depth-play" onClick={()=>go('battle')} aria-label="Jouer en arène"><CozyIcon name="combat"/><span>JOUER</span></button>
  <nav className="depth-dock" aria-label="Navigation de l’accueil">
   <button className="paw-nav-button" aria-current="page"><CozyNavContent name="home" label="Accueil"/></button>
   <button className="paw-nav-button" onClick={()=>go('collection')}><CozyNavContent name="decks" label="Collection"/><small>{ownedCount} cartes</small></button>
   <button className="paw-nav-button" onClick={()=>go('battle')}><CozyNavContent name="combat" label="Combattre"/></button>
   <button className="paw-nav-button" onClick={()=>go('deck')}><CozyNavContent name="decks" label="Decks"/></button>
   <button className="paw-nav-button" onClick={()=>go('shop')}><CozyNavContent name="shop" label="Boutique"/></button>
  </nav>
  {event&&<GameDialog title="Duel des pirates" closeLabel="Fermer l’événement" onClose={()=>setEvent(false)}><div className="refined-crew"><img src="/assets/layered-home/pirate-cat.webp" alt="Capitaine chat"/><img src="/assets/layered-home/pirate-dog.webp" alt="Capitaine chien"/></div><p>Choisis ton équipage. Prépare ton prochain duel.</p><button className="primary" onClick={()=>go('deck')}>Préparer mon équipe</button><button onClick={()=>go('collection')}>Découvrir la collection</button></GameDialog>}
 </section>;
}
