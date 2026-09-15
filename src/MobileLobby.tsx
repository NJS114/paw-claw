import {GameAsset} from './GameAsset';
import type {Progression} from './data/progression';

type LobbyTarget='battle'|'collection'|'deck'|'progression'|'shop'|'boosters'|'profile';

type Props={
 progress:Progression;
 ownedCount:number;
 onNavigate:(target:LobbyTarget)=>void;
};

function ActionAsset({assetId}:{assetId:string}){return <span className="lobby-action-asset" aria-hidden="true"><GameAsset assetId={assetId} decorative/></span>}

export function MobileLobby({progress,ownedCount,onNavigate}:Props){
 return <section className="mobile-lobby" aria-label="Accueil Paw & Claw">
   <GameAsset assetId="world.lobby-day" className="mobile-lobby-bg" decorative loading="eager"/>
   <div className="mobile-lobby-scrim"/>

   <header className="lobby-player-strip">
    <button className="lobby-avatar" onClick={()=>onNavigate('profile')} aria-label="Ouvrir le profil">
      <GameAsset assetId="icon.profile" decorative loading="eager"/>
    </button>
    <div className="lobby-player-copy"><strong>Gardien du Royaume</strong><span>Niveau {progress.level}</span></div>
    <div className="lobby-wallet" aria-label="Ressources">
      <span><GameAsset assetId="icon.coins" decorative/><b>{progress.coins}</b><small>Pièces</small></span>
      <span><GameAsset assetId="icon.gems" decorative/><b>{progress.gems}</b><small>Gemmes</small></span>
    </div>
   </header>

   <div className="lobby-side-actions lobby-side-left">
    <button onClick={()=>onNavigate('progression')}><ActionAsset assetId="icon.missions"/><strong>Missions</strong><small>Récompenses</small></button>
    <button onClick={()=>onNavigate('progression')}><ActionAsset assetId="icon.pass"/><strong>Passe</strong><small>Saison en cours</small></button>
   </div>

   <div className="lobby-side-actions lobby-side-right">
    <button onClick={()=>onNavigate('boosters')}><ActionAsset assetId="booster.standard-violet"/><strong>Booster</strong><small>{progress.sealedBoosters} disponible{progress.sealedBoosters>1?'s':''}</small></button>
    <button onClick={()=>onNavigate('shop')}><ActionAsset assetId="icon.shop"/><strong>Boutique</strong><small>Nouveautés</small></button>
   </div>

   <div className="lobby-character-stage" aria-hidden="true">
    <div className="lobby-aura lobby-aura-one"/>
    <div className="lobby-aura lobby-aura-two"/>
    <GameAsset assetId="lobby.hero-cat" className="lobby-hero lobby-hero-cat" decorative loading="eager"/>
    <GameAsset assetId="lobby.hero-dog" className="lobby-hero lobby-hero-dog" decorative loading="eager"/>
   </div>

   <div className="lobby-callout">
    <small>UN MÊME ROYAUME · MILLE DESTINS</small>
    <h1>PAW &amp; CLAW</h1>
    <p>{ownedCount} cartes dans ta collection</p>
   </div>

   <div className="lobby-primary-zone">
    <button className="lobby-play-button image-button" onClick={()=>onNavigate('battle')} aria-label="Jouer en arène">
      <GameAsset assetId="button.play" decorative loading="eager"/>
      <span className="lobby-play-caption">PRÉPARER MON DUEL</span>
    </button>
    <div className="lobby-quick-row">
      <button className="quick-image-button" onClick={()=>onNavigate('collection')}><GameAsset assetId="icon.collection" decorative/><span><strong>Collection</strong><small>Voir mes cartes</small></span></button>
      <button className="quick-image-button" onClick={()=>onNavigate('deck')}><GameAsset assetId="icon.decks" decorative/><span><strong>Decks</strong><small>Préparer l'équipe</small></span></button>
    </div>
   </div>

   <div className="lobby-event-card" role="status">
    <GameAsset assetId="icon.missions" className="lobby-event-visual" decorative/>
    <div><small>PROGRESSION DU ROYAUME</small><strong>Missions et récompenses</strong><span>Consulte tes objectifs et ton passe</span></div>
    <button onClick={()=>onNavigate('progression')}>Voir</button>
   </div>
 </section>
}
