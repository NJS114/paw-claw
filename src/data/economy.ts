import type { Progression } from './progression';

export const ECONOMY={
 standardBoosterCoins:100,
 premiumBoosterGems:80,
 winCoins:80,
 winGems:2,
 lossCoins:25,
 battlePassPremiumGems:600,
} as const;

export function grantMatchRewards(p:Progression,result:'win'|'lose'):Progression{
 const coins=result==='win'?ECONOMY.winCoins:ECONOMY.lossCoins;
 const gems=result==='win'?ECONOMY.winGems:0;
 return {...p,coins:p.coins+coins,gems:p.gems+gems};
}

export function spendGems(p:Progression,amount:number):Progression|null{
 if(amount<0||p.gems<amount)return null;
 return {...p,gems:p.gems-amount};
}
