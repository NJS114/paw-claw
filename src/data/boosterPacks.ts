export type BoosterPackChoice={
 id:string;
 label:string;
 subtitle:string;
 edition:string;
};

export const BOOSTER_PACKS:BoosterPackChoice[]=[
 {id:'booster.royal-legends',label:'Royaumes & Légendes',subtitle:'Collection principale',edition:'COLLECTION DU ROYAUME'},
 {id:'booster.healers-emerald',label:'Guérisseurs Émeraude',subtitle:'Édition sacrée',edition:'ORDRE DES GUÉRISSEURS'},
 {id:'booster.healers-light',label:'Guérisseurs Lumière',subtitle:'Édition royale',edition:'ORDRE DES GUÉRISSEURS'},
];
