import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root=process.cwd();
const generated=path.join(root,'public','assets','generated');
const cardsRoot=path.join(root,'public','assets','cards');
const sequential=(ids)=>ids.map((id,index)=>({id,index}));

const jobs=[
 {family:'magiciens',source:'chatgpt-image-7-sept.-2026-15_03_35.webp',cols:4,rows:2,bounds:[.01,.08,.98,.82],cards:sequential(['mag-001','mag-002','mag-003','mag-004','mag-005','mag-006','mag-007','mag-008'])},
 {family:'ombres',source:'chatgpt-image-7-sept.-2026-15_03_31.webp',cols:4,rows:2,bounds:[.01,.08,.98,.82],cards:sequential(['omb-001','omb-002','omb-003','omb-004','omb-005','omb-006','omb-007','omb-008'])},
 {family:'nobles',source:'chatgpt-image-7-sept.-2026-15_07_01.webp',cols:7,rows:3,bounds:[.01,.09,.98,.82],artHeight:.48,cards:[
  {id:'nob-001',index:0},{id:'nob-002',index:1},{id:'nob-003',index:2},{id:'nob-004',index:3},
  {id:'nob-005',index:7},{id:'nob-006',index:12},{id:'nob-007',index:20},{id:'nob-008',index:18},{id:'nob-009',index:17},
 ]},
 {family:'robots',source:'chatgpt-image-7-sept.-2026-15_03_26.webp',cols:4,rows:2,bounds:[.01,.08,.98,.82],cards:sequential(['rob-001','rob-002','rob-003','rob-004','rob-005','rob-006','rob-007','rob-008'])},
 {family:'nature',source:'chatgpt-image-7-sept.-2026-15_04_34.webp',cols:6,rows:4,bounds:[0,0,1,1],cards:sequential(['nat-001','nat-002','nat-003','nat-004','nat-005','nat-006','nat-007','nat-008'])},
 {family:'guérisseurs',source:'chatgpt-image-7-sept.-2026-15_03_15.webp',cols:4,rows:2,bounds:[.01,.08,.98,.82],cards:sequential(['hea-001','hea-002','hea-003','hea-004','hea-005','hea-006','hea-007','hea-008'])},
 {family:'créatures',source:'chatgpt-image-7-sept.-2026-15_03_11.webp',cols:4,rows:2,bounds:[.01,.08,.98,.82],cards:sequential(['cre-001','cre-002','cre-003','cre-004','cre-005','cre-006','cre-007','cre-008'])},
];

let written=0;
for(const job of jobs){
 const sourcePath=path.join(generated,job.source);
 if(!fs.existsSync(sourcePath)){console.warn(`Source absente: ${job.source}`);continue}
 const meta=await sharp(sourcePath).metadata();
 if(!meta.width||!meta.height)continue;
 const [bx,by,bw,bh]=job.bounds;
 const gridX=Math.round(meta.width*bx),gridY=Math.round(meta.height*by);
 const gridW=Math.round(meta.width*bw),gridH=Math.round(meta.height*bh);
 const cellW=Math.floor(gridW/job.cols),cellH=Math.floor(gridH/job.rows);
 const outDir=path.join(cardsRoot,job.family);fs.mkdirSync(outDir,{recursive:true});
 for(const card of job.cards){
  const col=card.index%job.cols,row=Math.floor(card.index/job.cols);
  // Each source cell contains UI. Extract only its artwork window, below the
  // rarity strip and above title/stats, so one output can never contain two cards.
  const left=gridX+col*cellW+Math.round(cellW*.075);
  const top=gridY+row*cellH+Math.round(cellH*.16);
  const width=Math.max(1,Math.round(cellW*.85));
  const height=Math.max(1,Math.round(cellH*(job.artHeight??.57)));
  await sharp(sourcePath)
   .extract({left,top,width,height})
   .resize({width:720,height:960,fit:'cover',position:'centre'})
   .webp({quality:88})
   .toFile(path.join(outDir,`${card.id}.webp`));
  written++;
 }
}

console.log(`✓ ${written} illustrations individuelles recadrées sans cadre ni texte`);
