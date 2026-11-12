export type BoosterPackChoice={
 id:string;
 label:string;
 subtitle:string;
 edition:string;
 family?:string;
};

export const BOOSTER_PACKS:BoosterPackChoice[]=[
 {id:'booster.royal-legends',label:'Royaumes & Légendes',subtitle:'Collection principale',edition:'COLLECTION DU ROYAUME'},
 {id:'booster.healers-emerald',label:'Guérisseurs Émeraude',subtitle:'Édition sacrée',edition:'ORDRE DES GUÉRISSEURS',family:'Guérisseurs'},
 {id:'booster.healers-light',label:'Guérisseurs Lumière',subtitle:'Édition royale',edition:'ORDRE DES GUÉRISSEURS',family:'Guérisseurs'},
];

// Purchased boosters are universal tokens; players select their edition when opening.
const SELECTED_PACK_KEY='paw-claw.booster.selected.v1';
export function loadSelectedBoosterPackIndex():number{
 try{const id=localStorage.getItem(SELECTED_PACK_KEY);const index=BOOSTER_PACKS.findIndex(pack=>pack.id===id);return index<0?0:index}catch{return 0}
}
export function saveSelectedBoosterPackIndex(index:number):void{
 if(!Number.isInteger(index)||index<0||index>=BOOSTER_PACKS.length)return;
 try{localStorage.setItem(SELECTED_PACK_KEY,BOOSTER_PACKS[index].id)}catch{}
}
