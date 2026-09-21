import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../public/assets/animations/pirates/',import.meta.url));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8'));
assert.equal(manifest.cards.length,15);
let frames=0;
for(const card of manifest.cards)for(const orientation of ['front','rear'])for(const sequence of Object.values(card.orientations[orientation]))for(const file of sequence){assert(fs.existsSync(path.join(root,file)),file);frames++;}
assert.equal(frames,manifest.frameCount);
const effects=[...manifest.synergy.frames,...manifest.synergy.opposingFrames,...manifest.ultimateEffects.whale,...manifest.ultimateEffects.anchor];
assert.equal(effects.length,manifest.vfxFrameCount);
for(const file of effects)assert(fs.existsSync(path.join(root,file)),file);
assert.equal(manifest.synergy.minimumAlliedPirates,3);
for(const file of ['index.html','synergie.html'])for(const match of fs.readFileSync(path.join(root,file),'utf8').matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(match[1],{filename:file});
for(const file of fs.readdirSync(root).filter(file=>/^test-.*\.cjs$/.test(file)).sort())execFileSync(process.execPath,[path.join(root,file)],{stdio:'inherit'});
console.log(`Pirates: ${manifest.cards.length} personnages, ${frames} poses, ${effects.length} effets.`);
