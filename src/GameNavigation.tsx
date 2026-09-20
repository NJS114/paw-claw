import {LobbyIcon} from './LobbyIcon';
import {GameAsset} from './GameAsset';
import type {Progression} from './data/progression';

export type GameScreen='home'|'battle'|'boosters'|'collection'|'deck'|'progression'|'balance'|'assets'|'shop'|'profile';
const names:Record<GameScreen,string>={home:'Accueil',battle:'Combat',boosters:'Boosters',collection:'Collection',deck:'Decks',progression:'Missions et passe',balance:'Équilibrage',assets:'Assets',shop:'Boutique',profile:'Compagnon'};
const tabs=[['home','home'],['collection','cards'],['battle','swords'],['profile','shield']] as const;

export function GameNavigation({screen,onNavigate}:{screen:GameScreen;onNavigate:(screen:GameScreen)=>void}){
 return <nav className="game-navigation" aria-label="Navigation principale">{tabs.map(([target,icon])=><button key={target} aria-current={screen===target?'page':undefined} onClick={()=>onNavigate(target)}><LobbyIcon name={icon}/><span>{names[target]}</span></button>)}</nav>;
}
export function GameHeader({screen,progress,onNavigate}:{screen:GameScreen;progress:Progression;onNavigate:(screen:GameScreen)=>void}){
 if(screen==='home')return null;
 return <header className="game-page-header"><button className="game-back" onClick={()=>onNavigate('home')} aria-label="Retour à l’accueil">‹</button><h1>{names[screen]}</h1><div className="game-header-wallet"><span><GameAsset assetId="icon.coins" decorative/>{progress.coins}<span className="sr-only"> pièces</span></span><span><GameAsset assetId="icon.gems" decorative/>{progress.gems}<span className="sr-only"> gemmes</span></span></div></header>;
}
