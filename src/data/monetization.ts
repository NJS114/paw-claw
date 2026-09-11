export type MonetizationState={version:1;noAds:boolean;rewardedAdsEnabled:boolean};
const KEY='paw-claw.monetization.v1';
export const NO_ADS_PRODUCT_ID='pawclaw.no_ads.lifetime';
export const NO_ADS_DISPLAY_PRICE='4,99 €';
const initial:MonetizationState={version:1,noAds:false,rewardedAdsEnabled:true};
export function loadMonetization():MonetizationState{try{return{...initial,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return initial}}
export function saveMonetization(state:MonetizationState){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}}
export function setNoAdsEntitlement(state:MonetizationState,owned:boolean):MonetizationState{return{...state,noAds:owned}}
export function shouldShowInterstitial(state:MonetizationState){return !state.noAds}
export function shouldOfferRewardedAd(state:MonetizationState){return state.rewardedAdsEnabled}
