import { NO_ADS_DISPLAY_PRICE,NO_ADS_PRODUCT_ID,type MonetizationState } from './data/monetization';

export function NoAdsOffer({state}:{state:MonetizationState}){
 return <article className={`shop-item no-ads-offer ${state.noAds?'owned':''}`}>
  <div className="shop-coming">NO ADS</div>
  <h3>Supprimer les publicités</h3>
  <p>Supprime définitivement les interstitiels. Les vidéos récompensées restent volontaires afin de conserver leurs bonus.</p>
  <div className="no-ads-benefits"><span>Aucun interstitiel</span><span>Achat permanent</span><span>Vidéos récompensées facultatives</span></div>
  {state.noAds?<button disabled>Déjà activé</button>:<button disabled title={`Produit ${NO_ADS_PRODUCT_ID}`}>{NO_ADS_DISPLAY_PRICE} · achat mobile à connecter</button>}
 </article>
}
