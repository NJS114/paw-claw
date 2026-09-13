import {GameAsset} from './GameAsset';
import type {Progression} from './data/progression';

type LobbyTarget='battle'|'collection'|'deck'|'progression'|'shop'|'boosters'|'profile';

type Props={
 progress:Progression;
 ownedCount:number;
 onNavigate:(target:LobbyTarget)=>void;
};

export function MobileLobby({progress,ownedCount,onNavigate}:Props){
 return <section className="mobile-lobby" aria-label="Accueil Paw & Claw">
   <GameAsset assetId="world.throne-arena" className="mobile-lobby-bg" decorative loading="eager"/>
   <div className="mobile-lobby-scrim"/>

   <header className="lobby-player-strip">
    <button className="lobby-avatar" onClick={()=>onNavigate('profile')} aria-label="Ouvrir le profil">
      <GameAsset assetId="brand.hero-duo" decorative/>
    </button>
    <div className="lobby-player-copy"><strong>Gardien du Royaume</strong><span>Niveau {progress.level}</span></div>
    <div className="lobby-wallet" aria-label="Ressources">
      <span><b>{progress.coins}</b><small>Pièces</small></span>
      <span><b>{progress.gems}</b><small>Gemmes</small></span>
    </div>
   </header>

   <div className="lobby-side-actions lobby-side-left">
    <button onClick={()=>onNavigate('progression')}><span className="lobby-action-glyph">M</span><strong>Missions</strong><small>Récompenses</small></button>
    <button onClick={()=>onNavigate('progression')}><span className="lobby-action-glyph">P</span><strong>Passe</strong><small>Saison en cours</small></button>
   </div>

   <div className="lobby-side-actions lobby-side-right">
    <button onClick={()=>onNavigate('boosters')}><span className="lobby-action-glyph">B</span><strong>Booster</strong><small>{progress.sealedBoosters} disponible{progress.sealedBoosters>1?'s':''}</small></button>
    <button onClick={()=>onNavigate('shop')}><span className="lobby-action-glyph">S</span><strong>Boutique</strong><small>Nouveautés</small></button>
   </div>

   <div className="lobby-character-stage" aria-hidden="true">
    <div className="lobby-aura lobby-aura-one"/>
    <div className="lobby-aura lobby-aura-two"/>
    <GameAsset assetId="brand.hero-duo" className="lobby-heroes" decorative loading="eager"/>
   </div>

   <div className="lobby-callout">
    <small>UN MÊME ROYAUME · MILLE DESTINS</small>
    <h1>PAW &amp; CLAW</h1>
    <p>{ownedCount} cartes dans ta collection</p>
   </div>

   <div className="lobby-primary-zone">
    <button className="lobby-play-button" onClick={()=>onNavigate('battle')}>
      <span className="lobby-crossed-blades" aria-hidden="true">×</span>
      <span><small>ARÈNE CLASSÉE</small><strong>JOUER</strong></span>
    </button>
    <div className="lobby-quick-row">
      <button onClick={()=>onNavigate('collection')}><strong>Collection</strong><small>Voir mes cartes</small></button>
      <button onClick={()=>onNavigate('deck')}><strong>Decks</strong><small>Préparer l'équipe</small></button>
    </div>
   </div>

   <div className="lobby-event-card" role="status">
    <div><small>ÉVÉNEMENT DU ROYAUME</small><strong>Festival lunaire</strong><span>Récompenses bonus aujourd'hui</span></div>
    <button onClick={()=>onNavigate('progression')}>Voir</button>
   </div>
 </section>
}
