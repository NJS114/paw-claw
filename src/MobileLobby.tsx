import {GameAsset} from './GameAsset';
import {xpForLevel, type Progression} from './data/progression';
import {MISSIONS, type MissionProgress} from './data/missions';
import {LobbyIcon} from './LobbyIcon';
import {lobbyAssetId,useLocalLobbyPeriod} from './lobbyTime';

type LobbyTarget='battle'|'collection'|'deck'|'progression'|'shop'|'boosters'|'profile';
type Props={progress:Progression;ownedCount:number;missions?:MissionProgress;onNavigate:(target:LobbyTarget)=>void};

export function MobileLobby({progress,ownedCount,missions,onNavigate}:Props){
 const lobbyPeriod=useLocalLobbyPeriod();
 const quest=MISSIONS.find(m=>m.id==='daily-play-3')!;
 const questCount=Math.min(quest.target,missions?.counts[quest.id]??0);
 const claimed=missions?.claimed.includes(quest.id)??false;
 const xpTarget=xpForLevel(progress.level);
 return <section className="mobile-lobby" data-lobby-period={lobbyPeriod} aria-label="Accueil Paw & Claw">
  <GameAsset assetId={lobbyAssetId(lobbyPeriod)} className="mobile-lobby-bg" decorative loading="eager"/>
  <div className="mobile-lobby-scrim"/>
  <header className="lobby-player-strip">
   <button className="lobby-profile" onClick={()=>onNavigate('profile')} aria-label="Ouvrir le profil">
    <span className="lobby-avatar"><GameAsset assetId="lobby.hero-cat" decorative loading="eager"/></span>
    <span className="lobby-player-copy"><strong>Gardien du Royaume</strong><span>Niveau {progress.level}</span><progress aria-label="Expérience du joueur" value={progress.xp} max={xpTarget}/></span>
   </button>
   <div className="lobby-wallet" aria-label="Ressources">
    <span><GameAsset assetId="icon.coins" decorative/><b>{progress.coins}</b><small>Pièces</small></span>
    <span><GameAsset assetId="icon.gems" decorative/><b>{progress.gems}</b><small>Gemmes</small></span>
   </div>
  </header>
  <div className="lobby-callout">
   <h1 aria-label="Paw & Claw"><GameAsset assetId="lobby.logo" className="lobby-logo" decorative loading="eager"/></h1>
   <p>UN MÊME ROYAUME. MILLE DESTINS.</p>
  </div>
  <nav className="lobby-side-actions" aria-label="Activités du royaume">
   <button className="lobby-tile" onClick={()=>onNavigate('shop')}><LobbyIcon name="shop"/><span>Boutique</span></button>
   <button className="lobby-tile" onClick={()=>onNavigate('progression')}><LobbyIcon name="scroll"/><span>Missions</span></button>
   <button className="lobby-tile" onClick={()=>onNavigate('progression')}><LobbyIcon name="crown"/><span>Passe</span></button>
   <button className="lobby-tile" onClick={()=>onNavigate('boosters')}><LobbyIcon name="cards"/><span>Boosters</span><small>{progress.sealedBoosters} disponible{progress.sealedBoosters!==1?'s':''}</small></button>
  </nav>
  <aside className="lobby-rewards" aria-label="Objectifs et récompenses">
   <button className="lobby-booster-card lobby-frame" onClick={()=>onNavigate('boosters')} aria-label="Ouvrir mes boosters">
    <GameAsset assetId="lobby.booster" decorative/>
    <span><small>ROYAUMES &amp; LÉGENDES</small><strong>Une nouvelle aventure</strong><em>Découvre tes boosters</em></span><span className="lobby-chevron" aria-hidden="true">›</span>
   </button>
   <div className="lobby-quest lobby-frame">
    <h2>QUÊTE DU JOUR</h2>
    <div className="lobby-quest-body"><div><p>{quest.description}</p><div className="lobby-quest-meter"><progress aria-label="Progression de la quête du jour" value={questCount} max={quest.target}/><span>{questCount}/{quest.target}</span></div></div><GameAsset assetId="reward.chest-wood" decorative/></div>
    <button onClick={()=>onNavigate('progression')}><LobbyIcon name="gift"/><span>{claimed?'Récompense récupérée':questCount===quest.target?'Récupérer la récompense':'Voir les récompenses'}</span><span aria-hidden="true">›</span></button>
   </div>
  </aside>
  <div className="lobby-primary-zone">
   <button className="lobby-destination lobby-frame" onClick={()=>onNavigate('collection')}><LobbyIcon name="cards"/><strong>COLLECTION</strong><small>{ownedCount} cartes dans ta collection</small></button>
   <button className="lobby-play-button lobby-frame" onClick={()=>onNavigate('battle')} aria-label="Jouer en arène"><LobbyIcon name="swords"/><span><strong>JOUER</strong><small>ENTRER DANS L’ARÈNE</small></span><span className="lobby-play-spark" aria-hidden="true"/></button>
   <button className="lobby-destination lobby-frame" onClick={()=>onNavigate('deck')}><LobbyIcon name="shield"/><strong>DECKS</strong><small>Prépare ton équipe</small></button>
  </div>
  <footer className="lobby-footer"><span className="lobby-welcome">Bienvenue dans Paw &amp; Claw.<br/><em>Que l’aventure commence !</em></span><button className="lobby-profile-shortcut" onClick={()=>onNavigate('profile')}><LobbyIcon name="shield"/>Mon profil</button></footer>
 </section>
}
