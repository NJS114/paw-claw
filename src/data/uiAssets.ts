export type AssetKind='background'|'character'|'booster'|'icon'|'fx'|'ui'|'loading'|'battle'|'result';
export type GameAsset={id:string;kind:AssetKind;src:string;fallback?:string;required:boolean;usage:string[];alt:string;priority?:'critical'|'high'|'normal'|'lazy'};

const generated='/assets/generated/';

/**
 * Single source of truth for visual assets used by the game shell.
 * Required assets are verified in CI. Planned assets remain usable through fallbacks.
 */
export const GAME_ASSETS:GameAsset[]=[
 {id:'brand.hero-duo',kind:'character',src:`${generated}heros-duo.webp`,required:true,usage:['splash','home','loading','empty-state'],alt:'Héros Paw & Claw',priority:'critical'},
 {id:'world.throne-arena',kind:'background',src:`${generated}plateau-salle-du-trone.webp`,fallback:`${generated}heros-duo.webp`,required:true,usage:['home','matchmaking','battle-transition','booster-opening'],alt:'Royaume Paw & Claw',priority:'critical'},
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

 // Shell and world
 {id:'loading.portal',kind:'loading',src:`${generated}ui-loading-portal.webp`,fallback:`${generated}plateau-salle-du-trone.webp`,required:false,usage:['startup','screen-transition','reconnect'],alt:'Portail de chargement Paw & Claw',priority:'high'},
 {id:'world.lobby-day',kind:'background',src:`${generated}bg-lobby-day.webp`,fallback:`${generated}plateau-salle-du-trone.webp`,required:false,usage:['home'],alt:'Place royale Paw & Claw',priority:'high'},
 {id:'world.collection-hall',kind:'background',src:`${generated}bg-collection-hall.webp`,fallback:`${generated}plateau-salle-du-trone.webp`,required:false,usage:['collection'],alt:'Galerie de collection Paw & Claw',priority:'normal'},
 {id:'world.deck-forge',kind:'background',src:`${generated}bg-deck-forge.webp`,fallback:`${generated}plateau-salle-du-trone.webp`,required:false,usage:['deck'],alt:'Atelier de decks Paw & Claw',priority:'normal'},
 {id:'world.shop',kind:'background',src:`${generated}bg-shop.webp`,fallback:`${generated}plateau-salle-du-trone.webp`,required:false,usage:['shop'],alt:'Boutique Paw & Claw',priority:'normal'},
 {id:'world.matchmaking',kind:'background',src:`${generated}bg-matchmaking.webp`,fallback:`${generated}plateau-salle-du-trone.webp`,required:false,usage:['matchmaking'],alt:'Portail de matchmaking Paw & Claw',priority:'high'},

 // Characters
 {id:'character.royal-cat',kind:'character',src:`${generated}char-royal-cat.webp`,fallback:`${generated}heros-duo.webp`,required:false,usage:['home','victory','profile'],alt:'Chat royal Paw & Claw',priority:'high'},
 {id:'character.pirate-dog',kind:'character',src:`${generated}char-pirate-dog.webp`,fallback:`${generated}heros-duo.webp`,required:false,usage:['home','shop','matchmaking'],alt:'Chien pirate Paw & Claw',priority:'normal'},
 {id:'character.shadow-dog',kind:'character',src:`${generated}char-shadow-dog.webp`,fallback:`${generated}heros-duo.webp`,required:false,usage:['matchmaking','defeat','lore'],alt:'Chien des Ombres Paw & Claw',priority:'normal'},
 {id:'character.healer-cat',kind:'character',src:`${generated}char-healer-cat.webp`,fallback:`${generated}heros-duo.webp`,required:false,usage:['missions','battle-pass','lore'],alt:'Chat guérisseur Paw & Claw',priority:'normal'},

 // Booster system
 {id:'booster.royal-gold',kind:'booster',src:`${generated}booster-royal-gold.webp`,fallback:`${generated}booster-violet.webp`,required:false,usage:['shop','booster-opening'],alt:'Booster royal doré Paw & Claw',priority:'normal'},
 {id:'booster.pirates',kind:'booster',src:`${generated}booster-pirates.webp`,fallback:`${generated}booster-violet.webp`,required:false,usage:['shop','booster-opening'],alt:'Booster Pirates Paw & Claw',priority:'normal'},
 {id:'booster.healers',kind:'booster',src:`${generated}booster-healers.webp`,fallback:`${generated}booster-violet.webp`,required:false,usage:['shop','booster-opening'],alt:'Booster Guérisseurs Paw & Claw',priority:'normal'},
 {id:'booster.card-back',kind:'ui',src:`${generated}card-back.webp`,fallback:`${generated}carte-bleue.webp`,required:false,usage:['booster-opening','battle-hand','deck'],alt:'Dos de carte Paw & Claw',priority:'high'},
 {id:'fx.booster-glow',kind:'fx',src:`${generated}fx-booster-glow.webp`,fallback:`${generated}booster-violet.webp`,required:false,usage:['booster-opening'],alt:'',priority:'lazy'},
 {id:'fx.legendary-burst',kind:'fx',src:`${generated}fx-legendary-burst.webp`,fallback:`${generated}booster-violet.webp`,required:false,usage:['booster-opening','legendary-reveal'],alt:'',priority:'lazy'},

 // Battle and results
 {id:'battle.arena-main',kind:'battle',src:`${generated}bg-battle-arena.webp`,fallback:`${generated}plateau-salle-du-trone.webp`,required:false,usage:['battle'],alt:'Arène principale Paw & Claw',priority:'critical'},
 {id:'battle.victory',kind:'result',src:`${generated}ui-victory.webp`,fallback:`${generated}heros-duo.webp`,required:false,usage:['victory'],alt:'Victoire Paw & Claw',priority:'normal'},
 {id:'battle.defeat',kind:'result',src:`${generated}ui-defeat.webp`,fallback:`${generated}heros-duo.webp`,required:false,usage:['defeat'],alt:'Défaite Paw & Claw',priority:'normal'},
 {id:'battle.draw',kind:'result',src:`${generated}ui-draw.webp`,fallback:`${generated}heros-duo.webp`,required:false,usage:['draw'],alt:'Égalité Paw & Claw',priority:'normal'},
 {id:'fx.attack',kind:'fx',src:`${generated}fx-attack.webp`,required:false,usage:['battle','attack'],alt:'',priority:'lazy'},
 {id:'fx.heal',kind:'fx',src:`${generated}fx-heal.webp`,required:false,usage:['battle','heal'],alt:'',priority:'lazy'},
 {id:'fx.buff',kind:'fx',src:`${generated}fx-buff.webp`,required:false,usage:['battle','buff'],alt:'',priority:'lazy'},
 {id:'fx.lore',kind:'fx',src:`${generated}fx-lore.webp`,required:false,usage:['battle','lore'],alt:'',priority:'lazy'},

 // Core UI icons
 {id:'icon.coins',kind:'icon',src:`${generated}icon-coins.webp`,required:false,usage:['currency','shop','reward'],alt:'Pièces',priority:'lazy'},
 {id:'icon.gems',kind:'icon',src:`${generated}icon-gems.webp`,required:false,usage:['currency','shop','reward'],alt:'Gemmes',priority:'lazy'},
 {id:'icon.profile',kind:'icon',src:`${generated}icon-profile.webp`,required:false,usage:['nav','profile'],alt:'Profil',priority:'lazy'},
 {id:'icon.settings',kind:'icon',src:`${generated}icon-settings.webp`,required:false,usage:['nav','settings'],alt:'Paramètres',priority:'lazy'},
 {id:'icon.messages',kind:'icon',src:`${generated}icon-messages.webp`,required:false,usage:['nav','messages'],alt:'Messages',priority:'lazy'},
 {id:'icon.missions',kind:'icon',src:`${generated}icon-missions.webp`,required:false,usage:['nav','missions'],alt:'Missions',priority:'lazy'},
 {id:'icon.pass',kind:'icon',src:`${generated}icon-pass.webp`,required:false,usage:['nav','battle-pass'],alt:'Passe de combat',priority:'lazy'},
 {id:'icon.shop',kind:'icon',src:`${generated}icon-shop.webp`,required:false,usage:['nav','shop'],alt:'Boutique',priority:'lazy'},
 {id:'icon.decks',kind:'icon',src:`${generated}icon-decks.webp`,required:false,usage:['nav','deck'],alt:'Decks',priority:'lazy'},
 {id:'icon.ranking',kind:'icon',src:`${generated}icon-ranking.webp`,required:false,usage:['nav','ranking'],alt:'Classement',priority:'lazy'},
];

export const REQUIRED_GAME_ASSETS=GAME_ASSETS.filter(a=>a.required);
export const asset=(id:string)=>{
 const found=GAME_ASSETS.find(a=>a.id===id);
 if(!found)throw new Error(`Asset Paw & Claw inconnu: ${id}`);
 return found;
};
export const assetsFor=(usage:string)=>GAME_ASSETS.filter(a=>a.usage.includes(usage));
export const assetIds=()=>GAME_ASSETS.map(a=>a.id);
