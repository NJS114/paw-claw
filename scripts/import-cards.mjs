// scripts/import-cards.mjs
// Importe les cartes générées (PNG, JPG ou WebP) déposées dans cards-src/,
// les convertit en WebP optimisé, crée des miniatures et génère
// src/data/cardImages.ts (ID de carte -> chemins des images).
//
// Utilisation : npm run cards:import
// Nommage des fichiers sources : l'ID de la carte au début du nom
// (ex. « mag-001.png », « mag-001 Apprenti Sorcier.png », « tn-u03.png », « chef-01.png », « chef-01-verso.png »).

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const SRC = path.join(root, 'cards-src');
const OUT = path.join(root, 'public', 'assets', 'cards', 'v2');
const THUMBS = path.join(OUT, 'thumbs');
const MANIFEST = path.join(root, 'src', 'data', 'cardImages.ts');
const PUBLIC_BASE = '/assets/cards/v2';

const ID_PATTERN = /^([a-z]{2,4}-[a-z]?\d{2,3}(?:-verso)?)/i;
const IMAGE_EXT = /\.(png|jpe?g|webp)$/i;

// Taille finale : portrait 768 × 1152, paysage (Zones) 1152 × 768.
const FULL = { portrait: { width: 768, height: 1152 }, landscape: { width: 1152, height: 768 } };
const THUMB_WIDTH = 256;
const QUALITY = 85;

fs.mkdirSync(SRC, { recursive: true });
fs.mkdirSync(THUMBS, { recursive: true });

const sources = fs.readdirSync(SRC).filter((f) => IMAGE_EXT.test(f));
let converted = 0;
let skipped = 0;
const invalid = [];
const seen = new Map();

for (const file of sources) {
  const match = file.match(ID_PATTERN);
  if (!match) { invalid.push(file); continue; }
  const id = match[1].toLowerCase();
  if (seen.has(id)) {
    console.warn(`⚠ Deux fichiers pour ${id} : « ${seen.get(id)} » et « ${file} ». Seul le premier est utilisé.`);
    continue;
  }
  seen.set(id, file);

  const srcPath = path.join(SRC, file);
  const fullPath = path.join(OUT, `${id}.webp`);
  const thumbPath = path.join(THUMBS, `${id}.webp`);

  // Ne reconvertit que les images nouvelles ou modifiées.
  const srcTime = fs.statSync(srcPath).mtimeMs;
  if (fs.existsSync(fullPath) && fs.existsSync(thumbPath) && fs.statSync(fullPath).mtimeMs >= srcTime) {
    skipped++;
    continue;
  }

  const meta = await sharp(srcPath).metadata();
  const size = meta.width > meta.height ? FULL.landscape : FULL.portrait;

  await sharp(srcPath)
    .resize({ ...size, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 5 })
    .toFile(fullPath);

  await sharp(srcPath)
    .resize({ width: THUMB_WIDTH })
    .webp({ quality: 80 })
    .toFile(thumbPath);

  converted++;
}

// Manifeste construit à partir de toutes les cartes présentes dans le dossier de sortie.
const entries = [];
for (const file of fs.readdirSync(OUT).filter((f) => f.endsWith('.webp')).sort()) {
  const id = file.replace(/\.webp$/, '');
  const meta = await sharp(path.join(OUT, file)).metadata();
  entries.push({ id, landscape: meta.width > meta.height });
}

const body = entries
  .map(({ id, landscape }) =>
    `  '${id}': { full: '${PUBLIC_BASE}/${id}.webp', thumb: '${PUBLIC_BASE}/thumbs/${id}.webp', landscape: ${landscape} },`)
  .join('\n');

fs.writeFileSync(
  MANIFEST,
  `// Généré automatiquement par scripts/import-cards.mjs — ne pas modifier à la main.\n` +
  `export interface CardImage { full: string; thumb: string; landscape: boolean }\n\n` +
  `export const CARD_IMAGES: Record<string, CardImage> = {\n${body}\n};\n\n` +
  `export const cardImageFor = (id: string): CardImage | undefined => CARD_IMAGES[id];\n`
);

console.log(`✓ ${converted} carte(s) convertie(s), ${skipped} déjà à jour, ${entries.length} au total dans ${PUBLIC_BASE}`);
if (invalid.length) {
  console.warn(`⚠ Fichiers ignorés (le nom doit commencer par l'ID de la carte, ex. mag-001.png) :\n  ${invalid.join('\n  ')}`);
}
