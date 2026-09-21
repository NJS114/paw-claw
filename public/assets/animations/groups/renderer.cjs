(function(root){
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
function circle(c,x,y,r,color,alpha=1){c.save();c.globalAlpha=alpha;c.fillStyle=color;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();c.restore();}
function star(c,x,y,r,color,rotation=0){c.save();c.translate(x,y);c.rotate(rotation);c.fillStyle=color;c.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,s=i%2?r*.35:r;c.lineTo(Math.cos(a)*s,Math.sin(a)*s);}c.closePath();c.fill();c.restore();}
function ring(c,x,y,r,color,alpha=1){c.save();c.globalAlpha=alpha;c.strokeStyle=color;c.lineWidth=3;c.beginPath();c.ellipse(x,y,r,r*.38,0,0,Math.PI*2);c.stroke();c.restore();}
function glow(c,x,y,r,color){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,color.slice(0,7)+'00');c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r);}
function line(c,pts,color,width=3){c.strokeStyle=color;c.lineWidth=width;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
function label(c,text,x,y,color='#fff2d6',size=15,align='center'){c.font=`600 ${size}px sans-serif`;c.textAlign=align;c.fillStyle=color;c.fillText(text,x,y);}
function box(c,x,y,w,h,color,r=10){c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();}
function sprite(c,img,slot,rear,frame,x,y,size=155,alpha=1,flip=false){
 const cw=img.width/8,ch=img.height/6;
 c.save();c.globalAlpha=alpha;c.translate(x,y);if(flip)c.scale(-1,1);
 const bound=img.frameBounds?.[(slot*2+(rear?1:0))*8+frame];
 if(bound){const scale=size/Math.max(cw,ch),w=bound.w*scale,h=bound.h*scale;c.drawImage(img,bound.x,bound.y,bound.w,bound.h,-w/2,-h,w,h);}
 else c.drawImage(img,frame*cw,(slot*2+(rear?1:0))*ch,cw,ch,-size/2,-size,size,size);
 c.restore();
}
function shield(c,x,y,r,color,alpha=1){
 c.save();c.globalAlpha=alpha;c.strokeStyle=color;c.fillStyle=color+'22';c.lineWidth=3;c.beginPath();c.moveTo(x,y-r);c.lineTo(x+r*.72,y-r*.7);c.lineTo(x+r*.65,y+r*.3);c.quadraticCurveTo(x+r*.4,y+r*.8,x,y+r);c.quadraticCurveTo(x-r*.4,y+r*.8,x-r*.65,y+r*.3);c.lineTo(x-r*.72,y-r*.7);c.closePath();c.fill();c.stroke();c.restore();
}
function particle(c,type,x,y,r,color,t){
 c.save();c.translate(x,y);c.rotate(t);
 if(type==='leaves'||type==='roots'){c.fillStyle=color;c.beginPath();c.ellipse(0,0,r,r*.38,-.4,0,Math.PI*2);c.fill();line(c,[[-r,0],[r,0]],'#efffd1',1);}
 else if(type==='ravens'){c.fillStyle=color;c.beginPath();c.moveTo(-r,-r*.2);c.lineTo(-r*.55,-r*.65);c.lineTo(0,0);c.lineTo(r*.55,-r*.65);c.lineTo(r,-r*.2);c.lineTo(r*.35,0);c.lineTo(0,r*.5);c.lineTo(-r*.35,0);c.closePath();c.fill();}
 else if(type==='heal'){c.fillStyle=color;c.fillRect(-r/4,-r,r/2,r*2);c.fillRect(-r,-r/4,r*2,r/2);}
 else if(type==='ghosts'){c.fillStyle=color;c.beginPath();c.arc(0,-r*.25,r*.65,Math.PI,0);c.lineTo(r*.65,r);c.lineTo(0,r*.65);c.lineTo(-r*.65,r);c.closePath();c.fill();circle(c,-r*.23,-r*.3,r*.1,'#183550');circle(c,r*.23,-r*.3,r*.1,'#183550');}
 else star(c,0,0,r,color);
 c.restore();
}
function drawEffect(c,b,fx,img){
 const now=b.time,age=now-fx.start,p=clamp(age/fx.duration),post=age-fx.duration;
 if(age<0||post>1.1)return;
 const big=fx.kind!=='normal',combo=fx.kind==='synergy',color=fx.color;
 const x=fx.source.x+(fx.dest.x-fx.source.x)*p,y=fx.source.y+(fx.dest.y-fx.source.y)*p-(big?Math.sin(p*Math.PI)*30:0);
 const radius=combo?130:big?85:13,alpha=post>0?clamp(1-post/1.1):1;
 c.save();c.globalAlpha=alpha;c.shadowColor=color;c.shadowBlur=18;
 if(!big){
  if(p<1){line(c,[[x-(fx.dest.x-fx.source.x)*.05,y-(fx.dest.y-fx.source.y)*.05],[x,y]],color,5);circle(c,x,y,6,'#fff8e0');}
  else ring(c,fx.dest.x,fx.dest.y,15+post*25,color,1-post);
  c.restore();return;
 }
 const type=fx.effect;
 glow(c,x,y,radius,color+'77');
 if(type==='laser'||type==='lightning'){
  const pts=[];for(let i=0;i<13;i++){const q=i/12;pts.push([fx.source.x+(x-fx.source.x)*q,fx.source.y+(y-fx.source.y)*q+((i%2)?18:-18)*Math.sin(q*Math.PI)]);}
  line(c,pts,color,combo?15:8);line(c,pts,'#ecfdff',3);
  for(let j=0;j<3;j++)ring(c,x,y,30+j*18+Math.sin(now*12)*4,color,.7);
 }else if(type==='meteor'||type==='stars'){
  for(let j=0;j<(combo?8:5);j++){
   const a=j*2.4,s=post>0?80*post:25,tx=x+Math.cos(a)*s,ty=y+Math.sin(a)*s;
   line(c,[[tx-42,ty-95],[tx,ty]],color,7);star(c,tx,ty,14+j*2,'#fff4ca',now+j);
  }
 }else if(type==='vortex'||type==='runes'||type==='pulse'||type==='elements'){
  for(let j=0;j<4;j++){c.strokeStyle=type==='elements'?(j%2?'#8de5ff':'#ffc078'):color;c.lineWidth=3+j;c.beginPath();c.ellipse(x,y,25+j*15,12+j*13,now*(j%2?-1:1),0,Math.PI*1.65);c.stroke();}
  for(let j=0;j<10;j++){const a=j*Math.PI/5+now;particle(c,'star',x+Math.cos(a)*radius*.7,y+Math.sin(a)*radius*.6,7,color,-a);}
 }else if(type==='swords'||type==='slash'||type==='charge'){
  for(let j=0;j<(combo?5:3);j++){c.save();c.translate(x+(j-1)*24,y);c.rotate(-.6+j*.5);c.fillStyle='#fff7d8';c.beginPath();c.moveTo(0,-62);c.lineTo(10,-40);c.lineTo(7,25);c.lineTo(-7,25);c.lineTo(-10,-40);c.closePath();c.fill();box(c,-20,23,40,7,color,2);box(c,-4,29,8,22,color,2);c.restore();}
 }else if(type==='crown'){
  c.save();c.translate(x,y);c.fillStyle=color;c.beginPath();c.moveTo(-70,-32);c.lineTo(-38,-7);c.lineTo(0,-58);c.lineTo(38,-7);c.lineTo(70,-32);c.lineTo(57,35);c.lineTo(-57,35);c.closePath();c.fill();star(c,0,6,15,'#fffbe3');c.restore();
 }else if(type==='roots'){
  for(let j=0;j<8;j++){const dx=(j-3.5)*21;line(c,[[x+dx,y+45],[x+dx*.9,y+10],[x+dx*1.25,y-22-j%3*20]],color,7);particle(c,'leaves',x+dx*1.25,y-20-j%3*20,13,'#ceff9a',j);}
 }else if(type==='wave'){
  for(let j=0;j<5;j++){c.strokeStyle=j%2?'#ecffff':color;c.lineWidth=7;c.beginPath();for(let k=0;k<30;k++){const xx=x-90+k*6,yy=y+(j-2)*14+Math.sin(k*.24+now*8+j)*13;k?c.lineTo(xx,yy):c.moveTo(xx,yy);}c.stroke();}
 }else if(type==='ice'){
  for(let j=0;j<6;j++){const a=j*Math.PI/3;line(c,[[x,y],[x+Math.cos(a)*55,y+Math.sin(a)*55]],'#d9ffff',5);}
 }else if(type==='phoenix'||type==='dragon'){
  const slot=type==='phoenix'?0:1;
  sprite(c,img,slot,fx.team===0,7,x,y+80,combo?290:220,.88,fx.team===1);
  for(let j=0;j<9;j++)particle(c,'star',x-Math.sign(fx.dest.x-fx.source.x)*j*12,y+Math.sin(j+now*9)*22,12-j*.6,color,j);
 }else{
  const typeP=['ravens','ghosts','leaves','heal'].includes(type)?type:'star';
  for(let j=0;j<(combo?14:9);j++){const a=j*2.4+now*.8,r=20+j*5;particle(c,typeP,x+Math.cos(a)*r,y+Math.sin(a)*r*.7,12+(j%3)*4,color,type==='heal'?0:Math.sin(a)*.6);}
 }
 ring(c,x,y+20,35+p*40,color,.6);
 if(post>=0){
  const affected=b.units.filter(u=>u.onBoard&&(b.group.id==='guerisseurs'?u.team===fx.team:u.team!==fx.team));
  for(const u of affected){
   if(!combo&&Math.hypot(u.x-fx.dest.x,u.y-55-fx.dest.y)>155)continue;
   ring(c,u.x,u.y,30+post*110,color,alpha);ring(c,u.x,u.y,18+post*80,'#fff6d9',alpha*.6);
   if(b.group.id==='guerisseurs')for(let j=0;j<3;j++)particle(c,'heal',u.x-26+j*26,u.y-45-post*65,9,color,0);
  }
 }
 c.restore();
}
function draw(c,b,assets){
 const W=1200,H=800,t=b.time,g=b.group,img=assets[g.id];
 c.clearRect(0,0,W,H);
 if(assets.board)c.drawImage(assets.board,0,0,W,H);else{c.fillStyle='#25394c';c.fillRect(0,0,W,H);}
 c.fillStyle='#10203950';c.fillRect(0,0,W,H);
 const shade=c.createLinearGradient(0,0,0,H);shade.addColorStop(0,'#081221ed');shade.addColorStop(.17,'#08122100');shade.addColorStop(.8,'#08122100');shade.addColorStop(1,'#081221e8');c.fillStyle=shade;c.fillRect(0,0,W,H);
 label(c,'PAW & CLAW',38,40,'#d9c38f',15,'left');label(c,g.name.toUpperCase(),600,42,'#fff2d6',28);label(c,'ATELIER DES COMBATS',1162,40,'#cbd5e5',12,'right');
 for(const team of [0,1]){const x=team?925:275,live=b.units.filter(u=>u.onBoard&&u.hp>0&&u.team===team).length;label(c,`${team?'ADVERSAIRES':'ALLIÉS'}   ${live}/3`,x,83,team?'#ffb7ae':'#a8eff1',14);}
 line(c,[[540,76],[660,76]],g.accent,1);label(c,'VS',600,94,'#fff1cf',16);
 for(const u of b.units.filter(u=>u.onBoard).sort((a,z)=>a.y-z.y)){
  const dead=u.hp<=0,opacity=dead?.18:1,teamColor=u.team?'#ef9e99':'#8de5e4';
  c.save();c.globalAlpha=opacity;
  c.fillStyle='#06112455';c.beginPath();c.ellipse(u.x,u.y-4,48,15,0,0,Math.PI*2);c.fill();ring(c,u.x,u.y-4,47,teamColor,.75);
  if(u.boost&&t<u.boost.until){
   const color=g.accent,alpha=.45+.2*Math.sin(t*5);
   ring(c,u.x,u.y-4,58,color,alpha);ring(c,u.x,u.y-4,64,color,alpha*.5);
   if(u.boost.type==='shield')shield(c,u.x,u.y-74,65,color,.45);
   else for(let j=0;j<4;j++){const a=t*2+j*Math.PI/2;particle(c,u.boost.type==='regen'?'heal':u.boost.type==='evasion'?'ravens':'star',u.x+Math.cos(a)*55,u.y-55+Math.sin(a)*12,7,color,u.boost.type==='regen'?0:a);}
  }
  const appear=clamp(t/.6),dodge=u.dodgeAt&&t-u.dodgeAt<.35;
  const size=u.slot===0&&g.id==='nature'?165:145;
  if(img)sprite(c,img,u.slot,u.team===0,u.frame,u.x,u.y,size,appear*(dodge?.4:1),u.team===1);
  if(t<u.stunUntil){for(let j=0;j<3;j++){const a=t*4+j*2.1;star(c,u.x+Math.cos(a)*29,u.y-148+Math.sin(a)*8,7,'#ffe7a0',a);}label(c,'ÉTOURDI',u.x,u.y-173,'#ffdf8e',11);}
  box(c,u.x-56,u.y+5,112,9,'#0a1829');box(c,u.x-55,u.y+6,110*clamp(u.hp/u.maxHp),7,teamColor,3);
  if(u.shield>0)box(c,u.x-55,u.y+16,110*clamp(u.shield/25),3,g.accent,1);
  const tx=u.x+(u.team?88:-88),align=u.team?'left':'right';
  label(c,u.hero.name,tx,u.y-59,'#fff5de',11,align);
  const status=u.boost&&t<u.boost.until?({speed:'VITESSE',shield:'BOUCLIER',regen:'RÉGÉNÉRATION',evasion:'ESQUIVE'}[u.boost.type]+' '+Math.ceil(u.boost.until-t)+'s'):u.state==='walk'?'EN APPROCHE':u.state==='ultimate'?'ATTAQUE SPÉCIALE':u.state==='dead'?'HORS COMBAT':'';
  if(status)label(c,status,tx,u.y-42,u.boost?g.accent:'#dbe2ed',9,align);
  if(t-u.hitAt<.7&&u.lastAmount){label(c,(u.lastAmount>0?'+':'')+Math.round(u.lastAmount),u.x,u.y-135-(t-u.hitAt)*35,u.lastAmount>0?'#baffd4':'#ffdbb0',21);}
  c.restore();
 }
 for(const fx of b.effects)drawEffect(c,b,fx,img);
 const recent=[...b.events].reverse().find(e=>(e.type==='synergy'||e.type==='ultimate-start')&&t-e.time<2);
 if(recent){
  const u=b.units.find(u=>u.id===recent.from),text=recent.type==='synergy'?g.synergy:(u.hero.name+' · '+(g.id==='guerisseurs'?'Grand soin':'Attaque spéciale'));
  box(c,310,650,580,47,'#0b172ee8',16);label(c,text.toUpperCase(),600,680,g.accent,17);
 }
 const frac=clamp(t/24);box(c,300,733,600,4,'#c2d0df33',2);box(c,300,733,600*frac,4,g.accent,2);
 label(c,'MARCHE',300,762,t<4?g.accent:'#9eb0c8',11);label(c,'ATTAQUES & ULTIMES',600,762,t>=4&&t<16?g.accent:'#9eb0c8',11);label(c,'SYNERGIES DES 2 CAMPS',900,762,t>=16?g.accent:'#9eb0c8',11);
}
if(typeof module!=='undefined')module.exports={draw,sprite};else root.PawRenderer={draw,sprite};
})(typeof globalThis!=='undefined'?globalThis:this);
