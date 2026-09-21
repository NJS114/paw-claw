import {useState} from 'react';
import {GameAsset} from './GameAsset';
import {LobbyIcon} from './LobbyIcon';
import {PawMark} from './RealmCompanion';
import {xpForLevel, type Progression} from './data/progression';
import {MISSIONS, type MissionProgress} from './data/missions';
import type {GameScreen} from './GameNavigation';

export function RealmHome({progress,ownedCount,missions,onNavigate}:{progress:Progression;ownedCount:number;missions:MissionProgress;onNavigate:(s:GameScreen)=>void}) {
 const [hello, setHello] = useState('');
 const quest = MISSIONS.find(m => m.id === 'daily-play-3')!;
 const count = Math.min(quest.target, missions.counts[quest.id] ?? 0);
 const claimed = missions.claimed.includes(quest.id);
 return <section className="realm-home" aria-label="Accueil Paw & Claw">
  <header className="realm-player"><button onClick={() => onNavigate('profile')} aria-label="Ouvrir le profil"><span className="realm-avatar"><GameAsset assetId="lobby.hero-cat" decorative/></span><span><strong>À toi, petit héros</strong><small>Niveau {progress.level}</small><progress aria-label="Expérience" value={progress.xp} max={xpForLevel(progress.level)}/></span></button><div className="realm-wallet"><span><GameAsset assetId="icon.coins" decorative/>{progress.coins}</span><span><GameAsset assetId="icon.gems" decorative/>{progress.gems}</span></div></header>
  <div className="realm-brand"><span className="realm-kicker">DES PATTES. DES CARTES. DES LÉGENDES.</span><h1>Paw <span>&</span> Claw</h1></div>
  <div className="realm-heroes"><div className="realm-orbit" aria-hidden="true"/><span className="realm-star star-a" aria-hidden="true">✦</span><span className="realm-star star-b" aria-hidden="true">✦</span><span className="realm-star star-c" aria-hidden="true">✧</span>
   <button className="realm-hero cat" onClick={() => setHello('Moustaches au rapport !')} aria-label="Saluer les Moustaches"><GameAsset assetId="lobby.hero-cat" decorative loading="eager"/><span>Les Moustaches</span></button>
   <button className="realm-hero dog" onClick={() => setHello('Les Truffes sont prêtes !')} aria-label="Saluer les Truffes"><GameAsset assetId="lobby.hero-dog" decorative loading="eager"/><span>Les Truffes</span></button>
   <span className="realm-hello" role="status" key={hello}>{hello || 'Petites pattes. Grandes aventures.'}</span>
  </div>
  <div className="realm-home-actions"><button className="realm-pill realm-play" onClick={() => onNavigate('battle')}><PawMark/><span>À nous de jouer !<small>Un duel, mille possibilités</small></span><span aria-hidden="true">›</span></button>
   <div className="realm-quick"><button onClick={() => onNavigate('deck')}><LobbyIcon name="cards"/><span>Mes équipes<small>{ownedCount} cartes à collectionner</small></span></button><button onClick={() => onNavigate('boosters')}><GameAsset assetId="booster.royal-legends" decorative/><span>Une surprise ?<small>{progress.sealedBoosters} booster{progress.sealedBoosters !== 1 ? 's' : ''} à ouvrir</small></span></button></div>
   <button className="realm-quest" onClick={() => onNavigate('progression')}><LobbyIcon name="gift"/><span><strong>{claimed ? 'Bien joué aujourd’hui !' : count === quest.target ? 'Ta récompense t’attend !' : 'La petite quête du jour'}</strong><small>{quest.description}</small><progress aria-label="Progression de la quête du jour" value={count} max={quest.target}/></span><b>{count}/{quest.target}</b></button>
  </div>
 </section>;
}
