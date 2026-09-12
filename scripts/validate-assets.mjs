import fs from 'node:fs';
import path from 'node:path';
import AdmZip from 'adm-zip';

const root=process.cwd();
const zipPath=path.join(root,'paw-claw-assets-optimized.zip');
if(!fs.existsSync(zipPath)){console.error('Asset ZIP missing: paw-claw-assets-optimized.zip');process.exit(1)}

const required=[
 'heros-duo.webp',
 'plateau-salle-du-trone.webp',
 'booster-violet.webp',
 'chatgpt-image-7-sept.-2026-15_03_35.webp',
 'chatgpt-image-7-sept.-2026-15_03_31.webp',
 'chatgpt-image-7-sept.-2026-15_07_01.webp',
 'chatgpt-image-7-sept.-2026-15_01_47.webp',
 'chatgpt-image-7-sept.-2026-22_07_59.webp',
 'chatgpt-image-7-sept.-2026-15_03_15.webp',
 'chatgpt-image-7-sept.-2026-15_04_45.webp',
 'chatgpt-image-5-sept.-2026-23_17_33.webp',
 'chatgpt-image-7-sept.-2026-15_04_34.webp',
];

const zip=new AdmZip(zipPath);const entries=zip.getEntries().filter(e=>!e.isDirectory);
const basenames=new Set(entries.map(e=>path.basename(e.entryName)));
const missing=required.filter(name=>!basenames.has(name));
const duplicates=[...basenames].filter(name=>entries.filter(e=>path.basename(e.entryName)===name).length>1);
if(missing.length){console.error(`Missing required Paw & Claw assets (${missing.length}):`);for(const name of missing)console.error(` - ${name}`);process.exit(1)}
if(duplicates.length)console.warn(`Warning: ${duplicates.length} duplicate asset basenames detected.`);
const imageEntries=entries.filter(e=>/\.(webp|png|jpg|jpeg)$/i.test(e.entryName));
console.log(`Asset validation OK: ${required.length} required / ${imageEntries.length} images available.`);
