import { GameDialog } from './GameDialog';
import { Collection } from './Collection';
import { useEffect, useState, type ReactNode } from 'react';
import { cards, type CardData } from './data/gameCards';
import { addCards, loadCollection, ownedCount, saveCollection, type OwnedCards } from './data/collection';
import { battleDefeat, battleDraw, battleVictory, buyBooster, loadProgression, openBooster, saveProgression, xpForLevel, type Progression } from './data/progression';
import { DECK_SIZE, deckCards, loadDeck, saveDeck, starterDeck, validateDeck, type SavedDeck } from './data/deck';
import { claimMission, loadMissionProgress, recordMission, saveMissionProgress, type MissionProgress } from './data/missions';
import { addBattlePassXp, claimPassReward, loadBattlePass, saveBattlePass, unlockPremium, type BattlePassState, type PassReward } from './data/battlePass';
import { loadMonetization,saveMonetization,type MonetizationState } from './data/monetization';
import { Matchmaking } from './Matchmaking';
import { BalanceLab } from './BalanceLab';
import { DeckStudio } from './DeckStudio';
import { ProgressionHub } from './ProgressionHub';
import { PortraitShop } from './PortraitShop';
import {GameNavigation,GameHeader,type GameScreen} from './GameNavigation';
import { BoosterOpening } from './BoosterOpening';
import { MobileLobby } from './MobileLobby';
import { GameAsset } from './GameAsset';

type Screen=GameScreen;
type AssetManifest={sourceZip:string;count:number;entries:string[]};
const generatedBase='/assets/generated/';


function ScreenBackdrop({assetId,children,className='' }:{assetId:string;children:ReactNode;className?:string}){return <section className={`screen-with-background ${className}`.trim()}><GameAsset assetId={assetId} className="screen-background-art" decorative loading="eager"/><div className="screen-background-scrim"/><div className="screen-background-content">{children}</div></section>}

export function App(){
 const[screen,setScreen]=useState<Screen>('home');
 const[leaveTarget,setLeaveTarget]=useState<Screen|null>(null);
 function navigate(target:Screen){if(screen==='battle'&&target!=='battle'){setLeaveTarget(target);return}setScreen(target)}
 useEffect(()=>{const back=(event:Event)=>{if(document.querySelector('dialog[open], [role=dialog]'))return;if(screen!=='home'){event.preventDefault();navigate('home')}};window.addEventListener('paw-back',back);return()=>window.removeEventListener('paw-back',back)},[screen]);
 const[owned,setOwned]=useState<OwnedCards>(()=>loadCollection());
 const[progress,setProgress]=useState<Progression>(()=>loadProgression());
 const[deck,setDeck]=useState<SavedDeck>(()=>loadDeck()||starterDeck(cards,loadCollection()));
 const[missions,setMissions]=useState<MissionProgress>(()=>loadMissionProgress());
 const[pass,setPass]=useState<BattlePassState>(()=>loadBattlePass());
 const[monetization]=useState<MonetizationState>(()=>loadMonetization());
 useEffect(()=>saveCollection(owned),[owned]);useEffect(()=>saveProgression(progress),[progress]);useEffect(()=>saveDeck(deck),[deck]);useEffect(()=>saveMissionProgress(missions),[missions]);useEffect(()=>saveBattlePass(pass),[pass]);useEffect(()=>saveMonetization(monetization),[monetization]);
 useEffect(()=>{const checked=validateDeck(deck,cards,owned);if(checked.cardIds.length!==deck.cardIds.length)setDeck(d=>({...d,cardIds:checked.cardIds,updatedAt:Date.now()}))},[owned]);
 useEffect(()=>{
  const refresh=()=>{const next=loadMissionProgress(),nextPass=loadBattlePass();setMissions(current=>current.dailyKey===next.dailyKey&&current.weeklyKey===next.weeklyKey?current:next);setPass(current=>current.season===nextPass.season?current:nextPass)};
  const timer=window.setInterval(refresh,60000);window.addEventListener('focus',refresh);window.addEventListener('paw-resume',refresh);
  return()=>{window.clearInterval(timer);window.removeEventListener('focus',refresh);window.removeEventListener('paw-resume',refresh)};
 },[]);
 const battlePool=deckCards(deck,cards,owned);const deckValidation=validateDeck(deck,cards,owned);
 const win=()=>{setProgress(p=>battleVictory(p));setMissions(m=>recordMission(recordMission(m,'play'),'win'));setPass(p=>addBattlePassXp(p,25))};
 const lose=()=>{setProgress(p=>battleDefeat(p));setMissions(m=>recordMission(m,'play'));setPass(p=>addBattlePassXp(p,15))};
 const draw=()=>{setProgress(p=>battleDraw(p));setMissions(m=>recordMission(m,'play'));setPass(p=>addBattlePassXp(p,20))};
 function buy(){const n=buyBooster(progress,100);if(!n)return false;setProgress(n);setScreen('boosters');return true}
 function openPack(pull:CardData[]){const next=openBooster(progress);if(!next)return false;setProgress(next);setOwned(o=>addCards(o,pull));setMissions(m=>recordMission(m,'open-booster'));setPass(p=>addBattlePassXp(p,10));return true}
 function rewardProgress(p:Progression,reward:PassReward){if(reward.type==='coins')return{...p,coins:p.coins+reward.amount};if(reward.type==='gems')return{...p,gems:p.gems+reward.amount};return{...p,sealedBoosters:p.sealedBoosters+reward.amount}}
 function claimMissionReward(id:string){const result=claimMission(missions,id);if(!result)return;setMissions(result.state);setProgress(p=>({...p,coins:p.coins+result.mission.coins,gems:p.gems+result.mission.gems}));setPass(p=>addBattlePassXp(p,result.mission.passXp))}
 function claimPass(level:number,lane:'free'|'premium'){const result=claimPassReward(pass,level,lane);if(!result)return;setPass(result.state);setProgress(p=>rewardProgress(p,result.reward))}
 function activatePremium(){if(pass.premium||progress.gems<600)return;setProgress(p=>({...p,gems:p.gems-600}));setPass(p=>unlockPremium(p))}
 return <div className={`app-shell portrait-app ${screen==='battle'?'battle-mode':''}`}><GameHeader screen={screen} progress={progress} onNavigate={navigate}/><GameNavigation screen={screen} onNavigate={navigate}/><main>{screen==='home'&&<MobileLobby progress={progress} missions={missions} ownedCount={ownedCount(owned)} onNavigate={navigate}/>} {screen==='battle'&&(deckValidation.valid&&battlePool.length===DECK_SIZE?<Matchmaking playerPool={battlePool} onWin={win} onLose={lose} onDraw={draw} onAbandon={()=>setProgress(p=>({...p,losses:p.losses+1}))} onEditDeck={()=>setScreen('deck')}/>:<InvalidDeck go={setScreen} count={battlePool.length} issues={deckValidation.issues}/>)} {screen==='collection'&&<ScreenBackdrop assetId="world.collection-hall" className="collection-world"><Collection owned={owned}/></ScreenBackdrop>} {screen==='boosters'&&<BoosterOpening owned={owned} available={progress.sealedBoosters} onOpen={openPack} onShop={()=>setScreen('shop')}/>} {screen==='deck'&&<ScreenBackdrop assetId="world.deck-forge" className="deck-world"><DeckStudio owned={owned} activeDeck={deck} onActiveDeckChange={setDeck} onPlay={()=>setScreen('battle')}/></ScreenBackdrop>} {screen==='progression'&&<ScreenBackdrop assetId="world.events" className="events-world"><ProgressionHub progress={progress} missions={missions} pass={pass} onClaimMission={claimMissionReward} onClaimPass={claimPass} onUnlockPremium={activatePremium}/></ScreenBackdrop>} {screen==='balance'&&<BalanceLab/>} {screen==='shop'&&<ScreenBackdrop assetId="world.shop" className="shop-world"><PortraitShop progress={progress} onBuy={buy} onOpen={()=>setScreen('boosters')} monetization={monetization}/></ScreenBackdrop>} {screen==='profile'&&<Profile progress={progress} owned={owned}/>} {screen==='assets'&&<AssetsLibrary/>}</main>{leaveTarget&&<GameDialog title="Retourner au royaume ?" onClose={()=>setLeaveTarget(null)}><p>Ton duel reste sauvegardé. Tu pourras le reprendre en revenant dans l’arène.</p><button className="primary" onClick={()=>{setScreen(leaveTarget);setLeaveTarget(null)}}>Sauvegarder et quitter</button><button onClick={()=>setLeaveTarget(null)}>Continuer le duel</button></GameDialog>}</div>
}
function InvalidDeck({go,count,issues}:{go:(s:Screen)=>void;count:number;issues:string[]}){return <section className="placeholder"><h2>Deck non prêt</h2><p>Ton deck actif contient {count}/{DECK_SIZE} cartes valides. Un deck compétitif doit être composé uniquement de Chats ou uniquement de Chiens.</p>{issues.length>0&&<div className="deck-issues">{issues.slice(0,4).map(x=><p key={x}>{x}</p>)}</div>}<button className="primary" onClick={()=>go('deck')}>Orchestrer mon deck</button></section>}
function Profile({progress,owned}:{progress:Progression;owned:OwnedCards}){const need=xpForLevel(progress.level),discovered=Object.keys(owned).filter(id=>owned[id]>0).length;return <section className="collection-screen"><div className="profile-card"><div className="profile-avatar">P&C</div><div><p className="eyebrow">PROFIL JOUEUR</p><h2>Niveau {progress.level}</h2><div className="xp-bar"><span style={{width:`${Math.min(100,progress.xp/need*100)}%`}}/></div><p>{progress.xp}/{need} XP</p></div></div><div className="profile-stats"><div><strong>{progress.wins}</strong><span>Victoires</span></div><div><strong>{progress.losses}</strong><span>Défaites</span></div><div><strong>{progress.draws}</strong><span>Égalités</span></div><div><strong>{progress.boostersOpened}</strong><span>Boosters ouverts</span></div><div><strong>{progress.sealedBoosters}</strong><span>Boosters stockés</span></div><div><strong>{discovered}</strong><span>Cartes découvertes</span></div><div><strong>{progress.coins}</strong><span>Pièces</span></div><div><strong>{progress.gems}</strong><span>Gemmes</span></div></div></section>}
function AssetsLibrary(){const[m,setM]=useState<AssetManifest|null>(null);useEffect(()=>{fetch(`${generatedBase}manifest.json`).then(r=>r.json()).then(setM).catch(()=>{})},[]);return <section className="collection-screen"><div className="collection-head"><div><p className="eyebrow">ASSETS</p><h2>Bibliothèque visuelle</h2><p>{m?.count??0} images du pack source.</p></div></div><div className="asset-grid">{(m?.entries??[]).map(n=><article className="asset-tile" key={n}><img src={`${generatedBase}${n}`} alt="" loading="lazy"/><small>{n}</small></article>)}</div></section>}
