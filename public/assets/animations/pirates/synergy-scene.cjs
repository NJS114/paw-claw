const combat=require('./synergy-model.cjs');
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;');
function render(t,count,assets,enemyCount=3){
 const clip=t%22,{units,waves}=combat.simulate(clip,count,enemyCount);
 const active=combat.eligible(units.filter(u=>clip>=u.spawnAt),0),alliedCount=units.filter(u=>u.team===0&&u.onBoard&&clip>=u.spawnAt).length;
 const image=(p,x,y,w,h=w,opacity=1)=>`<image href="${assets[p]}" x="${x}" y="${y}" width="${w}" height="${h}" opacity="${opacity}"/>`;
 const text=(s,x,y,size=20,color='#f4e4bf',weight='normal')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}">${esc(s)}</text>`;
 let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><style>text{font-family:DejaVu Sans,sans-serif}</style>`;
 svg+=image('plateau.png',0,0,1200,800);
 svg+='<rect width="1200" height="90" fill="#101e32"/>'+text('ULTIMES & RENFORTS',30,38,28,'#ffe0a1','bold')+text('Sphynx : baleine · Amiral : ancre · Boost des alliés',30,70,17,'#b3d9df');
 for(const team of [0,1]){const n=units.filter(u=>u.team===team&&u.onBoard&&u.hp>0&&clip>=u.spawnAt).length,y=team===0?9:47;svg+=`<rect x="887" y="${y}" width="298" height="32" rx="11" fill="${n>=3?(team===0?'#21675f':'#793b46'):'#383e4b'}"/>`+text(`${team===0?'ALLIÉS':'ADVERSAIRES'} : ${n} / 3 PIRATES`,900,y+23,17,'#fff0c9','bold');}
 let phase=clip<3.5?'Approche : attaque normale uniquement à portée':clip<6.2?'Sphynx : la baleine frappe sa cible adverse':clip<8.5?'Les alliés du Sphynx attaquent plus vite':clip<10.7?'Amiral : l’ancre tombe sur son adversaire':clip<12.5?'Les alliés de l’Amiral attaquent plus vite':clip<16?'Ton bateau frappe les Pirates adverses':clip<20?'Le bateau adverse revient vers tes Pirates':'Fin des vagues : reprise du combat';
 svg+='<rect x="18" y="99" width="730" height="39" rx="12" fill="#102338" opacity=".9"/>'+text(phase,30,126,20,'#e2f5ee','bold');
 // Animated team buff: pulse leaving the caster, aura and rising chevrons on allies.
 for(const ally of units.filter(u=>u.onBoard&&u.hp>0&&clip<u.boostUntil)){
  const caster=units.find(u=>u.id===ally.boostFrom),age=clip-ally.boostAt,color=combat.legendarySkills[ally.boostFrom].color;
  if(age<.9&&caster){const p=Math.min(1,age/.65),x=caster.x+(ally.x-caster.x)*p,y=caster.y-50+(ally.y-caster.y)*p;svg+=`<path d="M${caster.x} ${caster.y-50} Q${(caster.x+ally.x)/2} ${Math.min(caster.y,ally.y)-160} ${ally.x} ${ally.y-50}" fill="none" stroke="${color}" stroke-width="3" opacity="${1-age/.9}"/><circle cx="${x}" cy="${y}" r="${8+6*Math.sin(age*12)**2}" fill="${color}"/>`;}
  const pulse=1+Math.sin(age*9)*.12;
  svg+=`<ellipse cx="${ally.x}" cy="${ally.y}" rx="${61*pulse}" ry="${18*pulse}" fill="${color}" fill-opacity=".12" stroke="${color}" stroke-width="4"/><ellipse cx="${ally.x}" cy="${ally.y}" rx="${48*pulse}" ry="${12*pulse}" fill="none" stroke="${color}" stroke-width="1.5"/>`;
  for(let k=0;k<3;k++){const y=ally.y-25-((age*48+k*35)%110),x=ally.x-55;svg+=`<path d="M${x-6} ${y+6} L${x} ${y} L${x+6} ${y+6}" fill="none" stroke="${color}" stroke-width="3"/>`;}
 }
 for(const u of [...units].sort((a,b)=>a.y-b.y)){
  if(!u.onBoard||u.state==='empty')continue;
  const state=u.state==='ultimate'?'attack':u.state,f=u.state==='ultimate'?[0,1,2,3,3,2,1,0][u.frame]:u.frame,orient=u.facing||(u.team===0?'rear':'front'),size=145;
  svg+=`<ellipse cx="${u.x}" cy="${u.y}" rx="46" ry="13" fill="#152c3d" opacity=".25"/>`;
  svg+=image(`${u.id}/${orient}/${state}/${f+1}.png`,u.x-size/2,u.y-size*.92,size);
 }
 for(const u of units){
  const effect=combat.ultimateVisual(u,clip);if(!effect)continue;
  const color=u.id==='fantome-sphynx'?'#63eee8':'#ffd36d';
  svg+=`<ellipse cx="${effect.target.x}" cy="${effect.target.y}" rx="65" ry="24" fill="${color}" fill-opacity=".12" stroke="${color}" stroke-width="3"/>`;
  svg+=image(effect.path,effect.x-effect.size/2,effect.y-effect.size*.78,effect.size,effect.size,effect.opacity);
  // Keep the caster readable in front of any wide splash overlapping its location.
  const orient=u.facing||(u.team===0?'rear':'front'),f=[0,1,2,3,3,2,1,0][u.frame];
  svg+=image(`${u.id}/${orient}/attack/${f+1}.png`,u.x-72.5,u.y-145*.92,145);
 }
 for(const wave of waves){if(clip<wave.time||clip>=wave.time+3.65)continue;const source=wave.source,target=wave.target;
  const p=Math.min(1,(clip-wave.time)/3),i=Math.min(7,Math.floor((clip-wave.time)/3.65*8)),x=source.x+(target.x-source.x)*p,y=source.y+(target.y-source.y)*p;
  const size=320+60*Math.sin(p*Math.PI),opacity=clip>wave.time+3?Math.max(0,1-(clip-wave.time-3)/.65):1;
  svg+=image(`vfx/${wave.team===0?'red-pirate-ship':'red-pirate-ship-reverse'}/${i+1}.png`,x-size/2,Math.max(95,y-size*.5),size,size,opacity);
 }
 // UI appears above the effect so hits and status remain readable.
 for(const u of units.filter(u=>u.onBoard&&u.state!=='empty')){
  const stunned=clip<u.stunnedUntil,remaining=Math.max(0,(u.stunnedUntil||0)-clip);
  svg+=`<rect x="${u.x-48}" y="${u.y+8}" width="96" height="10" rx="5" fill="#253748"/><rect x="${u.x-48}" y="${u.y+8}" width="${u.hp*.96}" height="10" rx="5" fill="${stunned?'#efb34f':'#78cb92'}"/>`;
  svg+=`<rect x="${u.x-40}" y="${u.y+21}" width="80" height="21" rx="7" fill="#132c40"/>`+text(`${u.hp} / 100`,u.x-33,u.y+37,14,'#ecf2e1','bold');
  if(clip<u.boostUntil){const color=combat.legendarySkills[u.boostFrom].color;svg+=`<rect x="${u.x-68}" y="${u.y+46}" width="136" height="24" rx="9" fill="#142839" stroke="${color}"/>`+text(`+40 % · ${(u.boostUntil-clip).toFixed(1)} s`,u.x-57,u.y+63,14,color,'bold');}
  if(stunned){
   for(let k=0;k<3;k++){const a=clip*5+k*Math.PI*2/3,x=u.x+Math.cos(a)*36,y=u.y-133+Math.sin(a)*12;svg+=text('★',x-10,y,24,'#fff09a','bold');}
   svg+=`<rect x="${u.x-55}" y="${u.y-110}" width="110" height="25" rx="8" fill="#282740"/>`+text(`STUN ${remaining.toFixed(1)} s`,u.x-46,u.y-92,14,'#ffe9a3','bold');
  }
  if(u.lastDamage&&clip-u.hitAt<.7){svg+=text('−'+u.lastDamage,u.x-25,Math.max(159,u.y-158-(clip-u.hitAt)*26),u.lastDamage>3?31:23,'#b82730','bold');}
 }
 svg+='<rect y="716" width="1200" height="84" fill="#101e32"/>'+text('ULTIMES',30,748,20,'#81e3d2','bold')+text('→',200,748,22)+text('BOOST DES ALLIÉS',245,748,20,'#9edcfa','bold')+text('→',505,748,22)+text('BATEAU + STUN',555,748,20,'#ffe0a1','bold');
 svg+=text('Chaque camp : 3 Pirates pour son bateau · Dégâts et stun sur les ennemis uniquement',30,780,16,'#a9bfcf');
 return svg+'</svg>';
}
module.exports={render};
