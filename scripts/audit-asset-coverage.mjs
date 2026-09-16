import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL, fileURLToPath} from 'node:url';
import {stripTypeScriptTypes} from 'node:module';
import AdmZip from 'adm-zip';

// Read the actual project catalog, not a second hand-maintained list.
// Resolve its root PNG URLs against the original module, not the data URL.
const root=process.cwd();
function moduleUrl(relative, replacements={}) {
  const filename=path.resolve(root,relative);
  let source=fs.readFileSync(filename,'utf8');
  source=source.replaceAll('import.meta.url',JSON.stringify(pathToFileURL(filename).href));
  for(const [specifier,url] of Object.entries(replacements)) {
    source=source.replaceAll(`from '${specifier}'`,`from '${url}'`);
  }
  const outputText=stripTypeScriptTypes(source,{mode:'strip'});
  return `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`;
}
const {GAME_ASSETS}=await import(moduleUrl('src/data/uiAssets.ts'));
const {cards}=await import(moduleUrl('src/data/gameCards.ts',{'./cards':moduleUrl('src/data/cards.ts')}));
const zip=new AdmZip(path.join(root,'paw-claw-assets-optimized.zip'));
const packaged=new Set(zip.getEntries().filter(e=>!e.isDirectory).map(e=>e.entryName));
function locate(src) {
  if(src.startsWith('file:')) {
    const filename=fileURLToPath(src);
    return {path:path.relative(root,filename),present:fs.existsSync(filename),source:'committed-root'};
  }
  if(src.startsWith('/assets/generated/')) {
    const name=src.slice('/assets/generated/'.length);
    // Production import overwrites this directory from the ZIP; check its source.
    return {path:src,present:packaged.has(name),source:'zip'};
  }
  return {path:src,present:fs.existsSync(path.join(root,'public',src)),source:'public'};
}
const catalog=GAME_ASSETS.map(a=>({id:a.id,kind:a.kind,required:a.required,usage:a.usage,...locate(a.src),fallback:a.fallback?locate(a.fallback):null}));
const cardImages=cards.map(c=>({id:c.id,name:c.name,family:c.family,...locate(c.assetPath??'')}));
const missingPrimary=catalog.filter(a=>!a.present);
const missingCards=cardImages.filter(a=>!a.present);
const aliases=[...new Set(catalog.map(a=>a.path))].map(src=>({path:src,ids:catalog.filter(a=>a.path===src).map(a=>a.id)})).filter(a=>a.ids.length>1);
const summary={zipImages:[...packaged].filter(n=>/\.(png|webp|jpe?g)$/i.test(n)).length,catalogEntries:catalog.length,missingPrimary:missingPrimary.length,requiredMissing:missingPrimary.filter(a=>a.required).length,cardEntries:cards.length,presentCardFiles:cardImages.length-missingCards.length,missingCardFiles:missingCards.length};
const report={summary,catalog,missingPrimary,cardImages,aliases,limitations:[
 'Presence is not visual approval: an existing image can still be incorrectly cropped or represent the wrong card.',
 'Run npm run assets:import before auditing individual card outputs.',
 'Shared paths are informational: currency/reward reuse is legitimate, character aliases need review.',
 'This audit does not prove that a declared asset is rendered by a screen, nor validate runtime CSS and responsive layouts.'
]};
if(process.argv.includes('--json')) console.log(JSON.stringify(report,null,2));
else {
 console.log(JSON.stringify(summary,null,2));
 console.log('Missing primary catalog assets:',missingPrimary.map(a=>a.id).join(', ')||'none');
 console.log('Missing individual card files:',missingCards.map(a=>a.id).join(', ')||'none');
 console.log('Presence is NOT visual acceptance. See docs/ASSET_DELIVERY.md.');
}
const lobbyMissing=catalog.filter(a=>a.usage.includes('home')&&!a.present);
if(summary.requiredMissing>0 || (process.argv.includes('--lobby')&&lobbyMissing.length>0)) process.exitCode=1;
if(process.argv.includes('--strict')&&(missingPrimary.length>0||missingCards.length>0)) process.exitCode=1;
