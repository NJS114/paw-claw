import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const generated = path.join(root, 'public', 'assets', 'generated');
const cardsRoot = path.join(root, 'public', 'assets', 'cards');

const jobs = [
  { family: 'magiciens', source: 'chatgpt-image-7-sept.-2026-15_03_35.webp', ids: ['mag-001','mag-002','mag-003','mag-004','mag-005','mag-006','mag-007','mag-008'] },
  { family: 'ombres', source: 'chatgpt-image-7-sept.-2026-15_03_31.webp', ids: ['omb-001','omb-002','omb-003','omb-004','omb-005','omb-006','omb-007','omb-008'] },
  { family: 'nobles', source: 'chatgpt-image-7-sept.-2026-15_07_01.webp', ids: ['nob-001','nob-002','nob-003','nob-004','nob-005','nob-006','nob-007','nob-008'] },
  { family: 'robots', source: 'chatgpt-image-7-sept.-2026-15_03_26.webp', ids: ['rob-001','rob-002','rob-003','rob-004','rob-005','rob-006','rob-007','rob-008'] },
  { family: 'nature', source: 'chatgpt-image-7-sept.-2026-15_04_34.webp', ids: ['nat-001','nat-002','nat-003','nat-004','nat-005','nat-006','nat-007','nat-008'] },
  { family: 'guerisseurs', source: 'chatgpt-image-7-sept.-2026-15_03_15.webp', ids: ['gue-001','gue-002','gue-003','gue-004','gue-005','gue-006','gue-007','gue-008'] },
  { family: 'creatures', source: 'chatgpt-image-7-sept.-2026-15_03_11.webp', ids: ['cre-001','cre-002','cre-003','cre-004','cre-005','cre-006','cre-007','cre-008'] }
];

const cols = 4;
const rows = 2;
const insetX = 8;
const insetY = 8;

let written = 0;
for (const job of jobs) {
  const sourcePath = path.join(generated, job.source);
  if (!fs.existsSync(sourcePath)) {
    console.warn(`Source absente: ${job.source}`);
    continue;
  }
  const meta = await sharp(sourcePath).metadata();
  if (!meta.width || !meta.height) continue;
  const cellW = Math.floor(meta.width / cols);
  const cellH = Math.floor(meta.height / rows);
  const outDir = path.join(cardsRoot, job.family);
  fs.mkdirSync(outDir, { recursive: true });

  for (let i = 0; i < job.ids.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const left = col * cellW + insetX;
    const top = row * cellH + insetY;
    const width = Math.max(1, cellW - insetX * 2);
    const height = Math.max(1, cellH - insetY * 2);
    await sharp(sourcePath)
      .extract({ left, top, width, height })
      .resize({ width: 420, height: 560, fit: 'cover', position: 'centre' })
      .webp({ quality: 86 })
      .toFile(path.join(outDir, `${job.ids[i]}.webp`));
    written++;
  }
}

console.log(`✓ ${written} cartes individuelles générées dans public/assets/cards`);
