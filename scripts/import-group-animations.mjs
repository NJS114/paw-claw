import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const source=fileURLToPath(new URL('../assets/groups/',import.meta.url));
const target=fileURLToPath(new URL('../public/assets/animations/groups/',import.meta.url));
const index=JSON.parse(await fs.readFile(path.join(source,'index.json'),'utf8'));
await fs.mkdir(target,{recursive:true});
for(const entry of index.entries){
 const bytes=Buffer.concat(await Promise.all(entry.parts.map(part=>fs.readFile(path.join(source,part)))));
 await fs.writeFile(path.join(target,entry.file),bytes);
}
console.log(`✓ ${index.entries.length} atlas et décor des familles assemblés`);
