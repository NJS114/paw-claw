import fs from 'node:fs';
import path from 'node:path';
import AdmZip from 'adm-zip';

const root = process.cwd();
const zipName = 'paw-claw-assets-optimized.zip';
const zipPath = path.join(root, zipName);
const target = path.join(root, 'public', 'assets', 'generated');

if (!fs.existsSync(zipPath)) {
  console.error(`ZIP introuvable: ${zipName}`);
  process.exit(1);
}

fs.mkdirSync(target, { recursive: true });
const zip = new AdmZip(zipPath);
zip.extractAllTo(target, true);

const entries = zip.getEntries()
  .filter((entry) => !entry.isDirectory)
  .map((entry) => entry.entryName)
  .filter((name) => /\.(webp|png|jpg|jpeg)$/i.test(name));

const manifest = {
  sourceZip: zipName,
  count: entries.length,
  entries
};

fs.writeFileSync(path.join(target, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`✓ ${entries.length} assets Paw & Claw extraits vers public/assets/generated`);
