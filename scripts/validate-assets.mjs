import fs from 'node:fs';
import path from 'node:path';
import AdmZip from 'adm-zip';

const root=process.cwd();
const zipPath=path.join(root,'paw-claw-assets-optimized.zip');
if(!fs.existsSync(zipPath)){console.error('Asset ZIP missing: paw-claw-assets-optimized.zip');process.exit(1)}

const required=[
 'heros-duo.webp','plateau-salle-du-trone.webp','booster-violet.webp',
 'chatgpt-image-7-sept.-2026-15_03_35.webp','chatgpt-image-7-sept.-2026-15_03_31.webp','chatgpt-image-7-sept.-2026-15_07_01.webp','chatgpt-image-7-sept.-2026-15_01_47.webp','chatgpt-image-7-sept.-2026-22_07_59.webp','chatgpt-image-7-sept.-2026-15_03_15.webp','chatgpt-image-7-sept.-2026-15_04_45.webp','chatgpt-image-5-sept.-2026-23_17_33.webp','chatgpt-image-7-sept.-2026-15_04_34.webp',
];
const rootVisuals=[
 'Contour_carte_commune-removebg-preview.png','contour_carte_rare-removebg-preview.png','contour_carte_epique-removebg-preview.png','Contour_carte_legendaire-removebg-preview.png',
 'booster.png','booster_magician.png','booster_pirate.png','booster_sante.png','dos_de_carte.png','heros-duo-removebg-preview.png','chat-bienvenue.png',
 'icone-piece.png','icone-gemme.png','icone-lettre.png','icone-livre.png','icone-parchemin.png','icone-couronne.png','icone-boussole.png','icone-banniere.png','icone-carte-tresor.png','icone-cle.png','icone-coeur.png','icone-eclair.png','icone-potion.png',
 'coffre-bleu.png','coffre-bois.png','coffre-rouge.png','btn-jouer.png','btn-arene.png','btn-combattre.png','btn-collection.png','btn-boutique.png','btn-missions.png','btn-evenements.png',
 'rarete-commune.png','rarete-rare.png','rarete-epique.png','rarete-legendaire.png',
];
const backgrounds=[
 'bg-lobby-day.svg','bg-collection-hall.svg','bg-deck-forge.svg','bg-shop.svg','bg-matchmaking.svg','bg-battle-arena.svg',
];

const zip=new AdmZip(zipPath);const entries=zip.getEntries().filter(e=>!e.isDirectory);
const basenames=new Set(entries.map(e=>path.basename(e.entryName)));
const missing=required.filter(name=>!basenames.has(name));
const missingRoot=rootVisuals.filter(name=>!fs.existsSync(path.join(root,name)));
const backgroundDir=path.join(root,'public','assets','backgrounds');
const missingBackgrounds=backgrounds.filter(name=>!fs.existsSync(path.join(backgroundDir,name)));
const duplicates=[...basenames].filter(name=>entries.filter(e=>path.basename(e.entryName)===name).length>1);
if(missing.length){console.error(`Missing required Paw & Claw assets (${missing.length}):`);for(const name of missing)console.error(` - ${name}`);process.exit(1)}
if(missingRoot.length){console.error(`Missing committed root visuals (${missingRoot.length}):`);for(const name of missingRoot)console.error(` - ${name}`);process.exit(1)}
if(missingBackgrounds.length){console.error(`Missing dedicated backgrounds (${missingBackgrounds.length}):`);for(const name of missingBackgrounds)console.error(` - public/assets/backgrounds/${name}`);process.exit(1)}
if(duplicates.length)console.warn(`Warning: ${duplicates.length} duplicate asset basenames detected.`);
const imageEntries=entries.filter(e=>/\.(webp|png|jpg|jpeg)$/i.test(e.entryName));
console.log(`Asset validation OK: ${required.length} packaged / ${rootVisuals.length} committed root visuals / ${backgrounds.length} dedicated backgrounds / ${imageEntries.length} ZIP images.`);
