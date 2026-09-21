import {PawMark} from './RealmCompanion';
import {useEffect,useMemo,useRef,useState} from 'react';
import {generateStandardBooster} from './data/booster';
import type {CardData} from './data/gameCards';
import type {OwnedCards} from './data/collection';
import {GameAsset} from './GameAsset';
import {GameCard} from './GameCard';
import {BOOSTER_PACKS} from './data/boosterPacks';

type Phase='idle'|'charge'|'tear'|'reveal'|'complete';
type Props={owned:OwnedCards;available:number;onOpen:(cards:CardData[])=>boolean;onShop:()=>void};
const rarityRank:Record<string,number>={Commune:0,Rare:1,'Épique':2,'Légendaire':3};

export function BoosterOpening({owned,available,onOpen,onShop}:Props){
 const[phase,setPhase]=useState<Phase>('idle');
 const[cut,setCut]=useState(0);
 const swipe=useRef<{pointer:number;x:number;width:number}|null>(null);
 const opening=useRef(false);
 const[cards,setCards]=useState<CardData[]>([]);
 const[revealed,setRevealed]=useState(0);
 const[newIds,setNewIds]=useState<Set<string>>(new Set());
 const[selectedPack,setSelectedPack]=useState(0);
 const legendary=useMemo(()=>cards.some(c=>c.rarity==='Légendaire'),[cards]);
 const pack=BOOSTER_PACKS[selectedPack];

 useEffect(()=>{
  if(phase!=='charge'&&phase!=='tear')return;
  const id=window.setTimeout(()=>setPhase(phase==='charge'?'tear':'reveal'),phase==='charge'?650:760);
  return()=>window.clearTimeout(id);
 },[phase]);

 function start(){
  if(opening.current)return;
  if(available<=0){onShop();return}
  opening.current=true;
  const pull=generateStandardBooster();
  if(!onOpen(pull.cards)){opening.current=false;return;}
  setCards(sortBoosterForPresentation(pull.cards));
  setNewIds(new Set(pull.cards.filter(c=>(owned[c.id]??0)===0).map(c=>c.id)));
  setRevealed(0);
  setPhase('charge');
 }

 function revealNext(){
  if(phase!=='reveal')return;
  const next=Math.min(cards.length,revealed+1);
  setRevealed(next);
  if(next>=cards.length){opening.current=false;setCut(0);setPhase('complete');}
 }

 function reset(){opening.current=false;setCut(0);setCards([]);setRevealed(0);setNewIds(new Set());setPhase('idle')}
 function prevPack(){if(phase!=='idle')return;setSelectedPack(i=>(i-1+BOOSTER_PACKS.length)%BOOSTER_PACKS.length)}
 function nextPack(){if(phase!=='idle')return;setSelectedPack(i=>(i+1)%BOOSTER_PACKS.length)}

 return <section className={`booster-opening-v2 phase-${phase} ${legendary?'has-legendary':''}`} aria-label="Ouverture de booster">
  <div className="booster-stage" onClick={phase==='reveal'?revealNext:undefined}>
   <div className="booster-stage-light" aria-hidden="true"/>
   <GameAsset assetId="world.shop" className="booster-stage-bg" decorative/>
   {phase==='idle'&&<div className="booster-picker" aria-label="Choisir un booster">
    <button onClick={e=>{e.stopPropagation();prevPack()}} aria-label="Booster précédent">‹</button>
    <div><strong>{pack.label}</strong><small>{pack.subtitle}</small></div>
    <button onClick={e=>{e.stopPropagation();nextPack()}} aria-label="Booster suivant">›</button>
   </div>}
   <div className="booster-pack-focus">
    {phase==='idle'&&available>0&&<div className="booster-swipe" style={{'--cut':`${cut*100}%`} as React.CSSProperties} aria-hidden="true"
     onPointerDown={e=>{if(e.button!==0)return;swipe.current={pointer:e.pointerId,x:e.clientX,width:e.currentTarget.getBoundingClientRect().width};e.currentTarget.setPointerCapture(e.pointerId);setCut(0)}}
     onPointerMove={e=>{const drag=swipe.current;if(!drag||drag.pointer!==e.pointerId)return;const next=Math.min(1,Math.max(0,(e.clientX-drag.x)/(drag.width*.7)));setCut(next);if(next>=1){swipe.current=null;start()}}}
     onPointerUp={()=>{swipe.current=null;setCut(0)}} onPointerCancel={()=>{swipe.current=null;setCut(0)}}><PawMark/><span>Glisse pour découper →</span></div>}
    <div className="booster-pack-glow" aria-hidden="true"/>
    <GameAsset assetId={pack.id} className="booster-pack-art" loading="eager"/>
    <div className="booster-energy-ring ring-one" aria-hidden="true"/>
    <div className="booster-energy-ring ring-two" aria-hidden="true"/>
    <div className="booster-tear-line" aria-hidden="true"/>
   </div>
   {phase==='idle'&&<div className="booster-callout"><p>{pack.label.toUpperCase()}</p><h2>Ouvre ton booster</h2><span>{available} booster{available>1?'s':''} disponible{available>1?'s':''}</span><button className="game-cta" onClick={e=>{e.stopPropagation();start()}}>{available>0?'Ouvrir':'Aller à la boutique'}</button></div>}
   {(phase==='charge'||phase==='tear')&&<div className="booster-opening-status" aria-live="polite"><strong>{phase==='charge'?'Énergie du royaume…':'Ouverture…'}</strong><span>{phase==='charge'?'Une surprise se prépare':'Le sceau se brise'}</span></div>}
   {(phase==='reveal'||phase==='complete')&&<div className="booster-reveal-v2">
    <div className="reveal-stack" aria-live="polite">
     {cards.map((card,index)=>{
      const visible=index<revealed;
      const offset=Math.min(index,4);
      return <article key={`${card.id}-${index}`} className={`reveal-card rarity-${slug(card.rarity)} ${visible?'is-revealed':'is-hidden'} ${index===revealed-1?'is-latest':''}`} style={{'--offset':offset} as React.CSSProperties}>
       {visible?<GameCard card={card} variant="feature" statusBadge={newIds.has(card.id)?'NOUVELLE':undefined}/>:<div className="card-back-v2"><GameAsset assetId="booster.card-back" decorative loading="eager"/></div>}
      </article>
     })}
    </div>
    {phase==='reveal'&&<button className="reveal-next" onClick={e=>{e.stopPropagation();revealNext()}}>Révéler la carte {Math.min(revealed+1,cards.length)}/{cards.length}</button>}
   </div>}
  </div>
  {phase==='complete'&&<div className="booster-complete-panel"><div><small>{legendary?'OUVERTURE LÉGENDAIRE':'BOOSTER OUVERT'}</small><h3>{newIds.size} nouvelle{newIds.size>1?'s':''} carte{newIds.size>1?'s':''}</h3><p>Les cartes ont été ajoutées immédiatement à ta collection.</p></div><div className="booster-complete-actions"><button onClick={reset}>Voir le booster</button><button className="game-cta" onClick={start} disabled={available<=0}>{available>0?'Ouvrir le suivant':'Plus de booster'}</button></div></div>}
 </section>
}

function slug(value:string){return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-')}
export function sortBoosterForPresentation(input:CardData[]){return [...input].sort((a,b)=>(rarityRank[a.rarity]??0)-(rarityRank[b.rarity]??0))}
