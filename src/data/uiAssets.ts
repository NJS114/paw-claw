export type AssetKind='background'|'character'|'booster'|'icon'|'fx'|'ui'|'loading'|'battle'|'result';
export type GameAsset={id:string;kind:AssetKind;src:string;fallback?:string;required:boolean;usage:string[];alt:string;priority?:'critical'|'high'|'normal'|'lazy'};

const generated='/assets/generated/';

/**
 * Single source of truth for visual assets used by the game shell.
 * `required` assets are verified against paw-claw-assets-optimized.zip by tests.
 * Planned assets can be added with required:false and a safe fallback until generated.
 */
export const GAME_ASSETS:GameAsset[]=[
 {id:'brand.hero-duo',kind:'character',src:`${generated}heros-duo.webp`,required:true,usage:['splash','home','loading'],alt:'Héros Paw & Claw',priority:'critical'},
 {id:'world.throne-arena',kind:'background',src:`${generated}plateau-salle-du-trone.webp`,fallback:`${generated}heros-duo.webp`,required:true,usage:['home','matchmaking','battle-transition'],alt:'Royaume Paw & Claw',priority:'critical'},
 {id:'booster.standard-violet',kind:'booster',src:`${generated}booster-violet.webp`,fallback:`${generated}heros-duo.webp`,required:true,usage:['shop','booster-room','booster-opening'],alt:'Booster Paw & Claw',priority:'high'},
 {id:'family.magiciens',kind:'background',src:`${generated}chatgpt-image-7-sept.-2026-15_03_35.webp`,required:true,usage:['collection-fallback','magiciens'],alt:'Univers Magiciens Paw & Claw',priority:'lazy'},
 {id:'family.ombres',kind:'background',src:`${generated}chatgpt-image-7-sept.-2026-15_03_31.webp`,required:true,usage:['collection-fallback','ombres'],alt:'Univers Ombres Paw & Claw',priority:'lazy'},
 {id:'family.nobles',kind:'background',src:`${generated}chatgpt-image-7-sept.-2026-15_07_01.webp`,required:true,usage:['collection-fallback','nobles'],alt:'Univers Nobles Paw & Claw',priority:'lazy'},
 {id:'family.robots',kind:'background',src:`${generated}chatgpt-image-7-sept.-2026-15_01_47.webp`,required:true,usage:['collection-fallback','robots'],alt:'Univers Robots Paw & Claw',priority:'lazy'},
 {id:'family.nature',kind:'background',src:`${generated}chatgpt-image-7-sept.-2026-22_07_59.webp`,required:true,usage:['collection-fallback','nature'],alt:'Univers Nature Paw & Claw',priority:'lazy'},
 {id:'family.guerisseurs',kind:'background',src:`${generated}chatgpt-image-7-sept.-2026-15_03_15.webp`,required:true,usage:['collection-fallback','guerisseurs'],alt:'Univers Guérisseurs Paw & Claw',priority:'lazy'},
 {id:'family.creatures',kind:'background',src:`${generated}chatgpt-image-7-sept.-2026-15_04_45.webp`,required:true,usage:['collection-fallback','creatures'],alt:'Univers Créatures Paw & Claw',priority:'lazy'},
 {id:'family.pirates',kind:'background',src:`${generated}chatgpt-image-5-sept.-2026-23_17_33.webp`,required:true,usage:['collection-fallback','pirates'],alt:'Univers Pirates Paw & Claw',priority:'lazy'},
 {id:'family.elements',kind:'background',src:`${generated}chatgpt-image-7-sept.-2026-15_04_34.webp`,required:true,usage:['collection-fallback','elements'],alt:'Univers Éléments Paw & Claw',priority:'lazy'},

 // Planned dedicated assets: the component system already supports them and safely falls back.
 {id:'loading.portal',kind:'loading',src:`${generated}ui-loading-portal.webp`,fallback:`${generated}plateau-salle-du-trone.webp`,required:false,usage:['startup','screen-transition'],alt:'Portail de chargement Paw & Claw',priority:'high'},
 {id:'battle.victory',kind:'result',src:`${generated}ui-victory.webp`,fallback:`${generated}heros-duo.webp`,required:false,usage:['victory'],alt:'Victoire Paw & Claw',priority:'normal'},
 {id:'battle.defeat',kind:'result',src:`${generated}ui-defeat.webp`,fallback:`${generated}heros-duo.webp`,required:false,usage:['defeat'],alt:'Défaite Paw & Claw',priority:'normal'},
 {id:'fx.booster-glow',kind:'fx',src:`${generated}fx-booster-glow.webp`,required:false,usage:['booster-opening'],alt:'',priority:'lazy'},
];

export const REQUIRED_GAME_ASSETS=GAME_ASSETS.filter(a=>a.required);
export const asset=(id:string)=>{
 const found=GAME_ASSETS.find(a=>a.id===id);
 if(!found)throw new Error(`Asset Paw & Claw inconnu: ${id}`);
 return found;
};

export const assetsFor=(usage:string)=>GAME_ASSETS.filter(a=>a.usage.includes(usage));
