import {useState} from 'react';
import {GameAsset} from './GameAsset';
import {NoAdsOffer} from './NoAdsOffer';
import type {Progression} from './data/progression';
import type {MonetizationState} from './data/monetization';

export function PortraitShop({progress,onBuy,onOpen,monetization}:{progress:Progression;onBuy:()=>boolean;onOpen:()=>void;monetization:MonetizationState}){
 const[tab,setTab]=useState<'boosters'|'offers'>('boosters');
 const[message,setMessage]=useState('');
 return <section className="portrait-shop" aria-label="Boutique du royaume">
  <div className="shop-tabs" role="group" aria-label="Rayons"><button aria-pressed={tab==='boosters'} onClick={()=>setTab('boosters')}>Boosters</button><button aria-pressed={tab==='offers'} onClick={()=>setTab('offers')}>Offres</button></div>
  {tab==='boosters'?<>
   <div className="portrait-shop-stage"><span className="shop-edition">COLLECTION DU ROYAUME</span><GameAsset assetId="lobby.booster" className="portrait-shop-pack" loading="eager"/></div>
   <div className="portrait-shop-description"><h2>Booster Royaume</h2><p>12 cartes · 1 épique ou légendaire garantie</p><small>8 communes, 3 rares, 1 épique avec 15 % de chance qu’elle soit légendaire.</small></div>
   <button className="portrait-gold-button shop-buy" disabled={progress.coins<100} onClick={()=>setMessage(onBuy()?'Booster ajouté à ton inventaire.':'Pas assez de pièces.')}><GameAsset assetId="icon.coins" decorative/><span>Acheter · 100 pièces</span></button>
   {progress.coins<100&&<p className="shop-budget-note">Il te manque {100-progress.coins} pièces.</p>}
   <button className="shop-owned-packs" onClick={onOpen}>Ouvrir mes boosters <strong>{progress.sealedBoosters}</strong><span aria-hidden="true">›</span></button>
  </>:<div className="portrait-shop-offers"><NoAdsOffer state={monetization}/><p>Les achats mobiles ne sont pas encore connectés. Aucun paiement n’est effectué ici.</p></div>}
  {message&&<p role="status">{message}</p>}
 </section>;
}
