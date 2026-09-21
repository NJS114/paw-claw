import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const root=fileURLToPath(new URL('../public/assets/animations/pirates/',import.meta.url));
const output=fileURLToPath(new URL('../assets/pirates/',import.meta.url));
const manifest=JSON.parse(await fs.readFile(path.join(root,'manifest.json'),'utf8'));
const groups=manifest.cards.map(card=>({id:card.id,size:192,paths:Object.values(card.orientations).flatMap(o=>Object.values(o).flat())}));
groups.push({id:'effects',size:384,paths:[...manifest.synergy.frames,...manifest.synergy.opposingFrames,...manifest.ultimateEffects.whale,...manifest.ultimateEffects.anchor]});
groups.push({id:'board',size:0,paths:['plateau.png']});
await fs.mkdir(output,{recursive:true});
const atlases=[];
for(const group of groups){
 const columns=8,rows=Math.ceil(group.paths.length/columns);
 const image=group.size?sharp({create:{width:columns*group.size,height:rows*group.size,channels:4,background:'#00000000'}}).composite(await Promise.all(group.paths.map(async (p,i)=>({input:await sharp(path.join(root,p)).resize(group.size,group.size).png().toBuffer(),left:i%columns*group.size,top:Math.floor(i/columns)*group.size})))):sharp(path.join(root,'plateau.png'));
 const bytes=await image.webp({quality:82,alphaQuality:70,effort:5}).toBuffer();
 const parts=[];
 for(let offset=0;offset<bytes.length;offset+=384000){
  const name=`${group.id}.webp.part${String(parts.length).padStart(2,'0')}`;
  await fs.writeFile(path.join(output,name),bytes.subarray(offset,offset+384000));parts.push(name);
 }
 atlases.push({parts,paths:group.paths,columns,size:group.size,board:!group.size});
 console.log(group.id,bytes.length);
}
await fs.writeFile(path.join(output,'atlas-index.json'),JSON.stringify({format:'webp-mobile',atlases},null,2)+'\n');
