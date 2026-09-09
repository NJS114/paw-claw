import fs from 'node:fs';
import path from 'node:path';
import AdmZip from 'adm-zip';

const root = process.cwd();
const candidates = [
  'paw-claw-assets-optimized.zip',
  'Image_paw_claw (2).zip',
  'Image_paw_claw.zip'
];

const zipName = candidates.find((name) => fs.existsSync(path.join(root, name)));
if (!zipName) {
  console.error('Aucun ZIP Paw & Claw trouvé à la racine du dépôt.');
  console.error(`Noms acceptés : ${candidates.join(', ')}`);
  process.exit(1);
}

const target = path.join(root, 'public', 'assets', 'generated');
fs.mkdirSync(target, { recursive: true });

const zip = new AdmZip(path.join(root, zipName));
zip.extractAllTo(target, true);

const manifestPath = path.join(target, 'manifest.json');
const entries = zip.getEntries()
  .filter((entry) => !entry.isDirectory)
  .map((entry) => entry.entryName);

if (!fs.existsSync(manifestPath)) {
  fs.writeFileSync(manifestPath, JSON.stringify({ sourceZip: zipName, entries }, null, 2));
}

console.log(`✓ ${entries.length} assets Paw & Claw extraits vers public/assets/generated`);
