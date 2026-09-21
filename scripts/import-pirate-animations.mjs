import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const source=fileURLToPath(new URL('../assets/pirates/',import.meta.url));
const target=fileURLToPath(new URL('../public/assets/animations/pirates/',import.meta.url));
const index=JSON.parse(await fs.readFile(path.join(source,'atlas-index.json'),'utf8'));
let count=0;
for(const atlas of index.atlases){
 const input=Buffer.concat(await Promise.all(atlas.parts.map(file=>fs.readFile(path.join(source,file)))));
 const {data,info}=await sharp(input).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 for(let i=0;i<atlas.paths.length;i++){
  const file=path.join(target,atlas.paths[i]);await fs.mkdir(path.dirname(file),{recursive:true});
  let frame=sharp(data,{raw:{width:info.width,height:info.height,channels:4}});
  if(!atlas.board)frame=frame.extract({left:(i%atlas.columns)*atlas.size,top:Math.floor(i/atlas.columns)*atlas.size,width:atlas.size,height:atlas.size});
  await frame.png().toFile(file);count++;
 }
}
console.log(`✓ ${count} images Pirates extraites des atlas optimisés`);
