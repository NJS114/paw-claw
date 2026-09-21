// Pure demo combat logic, distances in board pixels and times in seconds.
const config={minimumAlliedPirates:3,damage:30,stunSeconds:2,startTime:3,travelSeconds:3,halfWidth:125};
function eligible(units,team){return units.filter(u=>u.team===team&&u.pirate&&u.hp>0&&u.onBoard).length>=config.minimumAlliedPirates;}
function cast(units,team,source,target,time,settings={}){
 if(!eligible(units,team))return null;
 return {team,source,target,time,settings:{...config,...settings},hits:new Set()};
}
function update(wave,units,now){
 if(!wave||now<wave.time)return [];
 const {source:s,target:d,settings:c}=wave,dx=d.x-s.x,dy=d.y-s.y,len=Math.hypot(dx,dy);
 if(!len)return [];
 const progress=Math.min(1,(now-wave.time)/c.travelSeconds),events=[];
 for(const u of units){
  if(u.team===wave.team||!u.onBoard||u.hp<=0||wave.hits.has(u.id))continue;
  const projection=((u.x-s.x)*dx+(u.y-s.y)*dy)/(len*len),distance=Math.abs((u.x-s.x)*dy-(u.y-s.y)*dx)/len;
  if(projection<0||projection>1||projection>progress||distance>c.halfWidth)continue;
  const contactTime=wave.time+projection*c.travelSeconds;
  wave.hits.add(u.id);u.hp=Math.max(0,u.hp-c.damage);u.stunnedUntil=Math.max(u.stunnedUntil||0,contactTime+c.stunSeconds);u.hitAt=contactTime;
  events.push({id:u.id,damage:c.damage,time:contactTime});
 }
 return events;
}
function canAct(unit,now){return unit.hp>0&&unit.onBoard&&now>=(unit.stunnedUntil||0);}
module.exports={config,eligible,cast,update,canAct};

const legendarySkills={'fantome-sphynx':{name:'Baleine spectrale',readyAt:4,color:'#74fff1'},'amiral-bouvier':{name:'Ancre des abysses',readyAt:8.5,color:'#ffd36d'}};
const ultimateConfig={duration:2,impactAt:.6,range:230,damage:14,radius:170,boostSeconds:4,boostMultiplier:1.4};
const battleConfig={range:112,speed:88,attackDamage:3,windup:.3,attackDuration:2/3,cooldown:1.3,duration:22,waveAt:12.5,waveWidth:210};
function createBattle(count=3,enemyCount=3){
 const ids=['fantome-sphynx','matelot-tabby','corsaire-bengal','mousse-carlin','cordage-teckel','amiral-bouvier'];
 const points=[[280,510],[185,390],[380,640],[780,290],[685,170],[880,420]];
 return {time:0,count,enemyCount,wave:null,waves:[],teamWaveAttempted:[false,false],waveAttempted:false,events:[],units:ids.map((id,i)=>({id,x:points[i][0],y:points[i][1],team:i<3?0:1,pirate:true,hp:100,onBoard:(i!==2||count>=3)&&(i!==4||enemyCount>=3),spawnAt:i===2?.8:0,range:battleConfig.range,speed:battleConfig.speed,targetId:ids[(i+3)%6],state:'appear',frame:0,nextAttack:0,stunnedUntil:0,hitAt:-100,attack:null,ultimate:null,ultimateUsed:false,boostUntil:0,boostFrom:null}))};
}
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function targetFor(u,units){
 const live=units.filter(v=>v.team!==u.team&&v.hp>0&&v.onBoard);
 return live.find(v=>v.id===u.targetId)||live.sort((a,b)=>distance(u,a)-distance(u,b))[0];
}
function stepBattle(b,dt){
 const previous=b.time,now=b.time+dt;b.time=now;const cfg=battleConfig;
 const before=new Map(b.units.map(u=>[u.id,{x:u.x,y:u.y}]));
 const hits=[],moves=[];
 for(const u of b.units){
  if(!u.onBoard||u.hp<=0){u.state='empty';continue;}
  if(now<u.spawnAt){u.state='empty';continue;}
  if(now<u.spawnAt+.65){u.state='appear';u.frame=Math.min(3,Math.floor((now-u.spawnAt)*6));continue;}
  if(!canAct(u,now)){u.state='hurt';u.frame=3;u.attack=null;u.ultimate=null;continue;}
  const target=targetFor(u,b.units);
  if(!target){u.state='idle';u.frame=Math.floor(now*6)%4;u.attack=null;continue;}
  u.targetId=target.id;u.facing=target.y>=u.y?'front':'rear';
  const d=distance(u,target);
  const skill=legendarySkills[u.id];
  if(skill&&!u.ultimateUsed&&now>=skill.readyAt&&d<=ultimateConfig.range){u.ultimate={start:now,struck:false,targetId:target.id,source:{x:u.x,y:u.y},target:{x:target.x,y:target.y}};u.ultimateUsed=true;u.attack=null;b.events.push({type:'ultimate-start',id:u.id,time:now,distance:d});}
  if(u.ultimate){
   const elapsed=now-u.ultimate.start;
   if(elapsed>=ultimateConfig.impactAt&&!u.ultimate.struck){
    u.ultimate.struck=true;u.ultimate.target={x:target.x,y:target.y};
    if(d<=ultimateConfig.range){for(const victim of b.units.filter(v=>v.team!==u.team&&v.onBoard&&v.hp>0&&distance(v,target)<=ultimateConfig.radius)){hits.push({from:u,target:victim,damage:ultimateConfig.damage,ultimate:true});}}
    for(const ally of b.units.filter(v=>v.id!==u.id&&v.team===u.team&&v.pirate&&v.hp>0&&v.onBoard&&now>=v.spawnAt+.65)){ally.boostUntil=now+ultimateConfig.boostSeconds;ally.boostFrom=u.id;ally.boostAt=now;ally.nextAttack=Math.min(ally.nextAttack,now+.2);b.events.push({type:'boost',time:now,id:u.id,targetId:ally.id});}
    b.events.push({type:'ultimate-impact',id:u.id,time:now,x:u.x,y:u.y});
   }
   if(elapsed<ultimateConfig.duration){u.state='ultimate';u.frame=Math.min(7,Math.floor(elapsed*4));continue;}
   u.ultimate=null;u.nextAttack=now+.25;
  }
  if(d>u.range+.001){
   u.attack=null;u.state='walk';u.frame=Math.floor(now*8)%4;
   const travel=Math.min(u.speed*dt,(d-u.range)*.5);
   moves.push({u,x:u.x+(target.x-u.x)/d*travel,y:u.y+(target.y-u.y)/d*travel});continue;
  }
  if(!u.attack&&now>=u.nextAttack){const rate=now<u.boostUntil?ultimateConfig.boostMultiplier:1;u.attack={start:now,targetId:target.id,struck:false,rate};u.nextAttack=now+cfg.cooldown/rate;b.events.push({type:'attack-start',time:now,id:u.id,targetId:target.id,distance:d,range:u.range,rate});}
  if(u.attack){
   const elapsed=(now-u.attack.start)*(u.attack.rate||1);
   if(elapsed>=cfg.windup&&!u.attack.struck){u.attack.struck=true;hits.push({from:u,target,damage:cfg.attackDamage});}
   if(elapsed<cfg.attackDuration){u.state='attack';u.frame=Math.min(3,Math.floor(elapsed*6));}
   else{u.attack=null;u.state='idle';u.frame=Math.floor(now*6)%4;}
  }else{u.state='idle';u.frame=Math.floor(now*6)%4;}
 }
 for(const m of moves){m.u.x=m.x;m.u.y=m.y;}
 for(const h of hits){
  if(canAct(h.from,now)&&(h.ultimate||distance(h.from,h.target)<=h.from.range+.001)){h.target.hp=Math.max(0,h.target.hp-h.damage);h.target.hitAt=now;h.target.lastDamage=h.damage;b.events.push({type:h.ultimate?'ultimate-hit':'hit',time:now,id:h.from.id,targetId:h.target.id,distance:distance(h.from,h.target),range:h.ultimate?ultimateConfig.range:h.from.range});}
 }
 if(!b.waveAttempted)for(const team of [0,1]){
  const readyAt=team===0?cfg.waveAt:16;
  if(now>=readyAt&&!b.teamWaveAttempted[team]){
   b.teamWaveAttempted[team]=true;
   const start=team===0?{x:260,y:550}:{x:900,y:195},end=team===0?{x:900,y:195}:{x:260,y:550};
   const ship=cast(b.units,team,start,end,now,{halfWidth:cfg.waveWidth});
   if(ship){b.waves.push(ship);if(team===0)b.wave=ship;b.events.push({type:'wave-start',team,time:now});}
  }
 }
 for(const ship of b.waves){
  const w=ship,s=w.source,d=w.target,dx=d.x-s.x,dy=d.y-s.y,len=Math.hypot(dx,dy),p0=Math.max(0,(previous-w.time)/w.settings.travelSeconds),p1=Math.min(1,(now-w.time)/w.settings.travelSeconds);
  if(now>=w.time&&p0<=1)for(const u of b.units){
   if(u.team===w.team||!u.onBoard||u.hp<=0||w.hits.has(u.id))continue;
   const old=before.get(u.id),proj=(v)=>((v.x-s.x)*dx+(v.y-s.y)*dy)/(len*len),q0=proj(old),q1=proj(u),cross=Math.abs((u.x-s.x)*dy-(u.y-s.y)*dx)/len;
   if(q0>=p0-.02&&q1<=p1+.02&&q1>=0&&q1<=1&&cross<=w.settings.halfWidth){w.hits.add(u.id);u.hp=Math.max(0,u.hp-w.settings.damage);u.hitAt=now;u.lastDamage=w.settings.damage;u.stunnedUntil=now+w.settings.stunSeconds;u.attack=null;u.state='hurt';u.frame=0;b.events.push({type:'wave-hit',team:w.team,time:now,targetId:u.id});}
  }
 }
 for(const u of b.units)if(u.onBoard&&u.state!=='ultimate'&&now>=u.spawnAt+.65&&now-u.hitAt<.25){u.state='hurt';u.frame=Math.min(3,Math.floor((now-u.hitAt)*16));}
}
function simulate(time,count=3,enemyCount=3){const b=createBattle(count,enemyCount);while(b.time<time-1e-8)stepBattle(b,Math.min(1/30,time-b.time));return b;}
module.exports={...module.exports,battleConfig,ultimateConfig,legendarySkills,createBattle,stepBattle,simulate,distance};

function ultimateVisual(u,now){
 if(!u.ultimate||u.state!=='ultimate')return null;
 const a=u.ultimate,age=now-a.start,impact=ultimateConfig.impactAt;
 if(age<0||age>=ultimateConfig.duration)return null;
 const whale=u.id==='fantome-sphynx',p=Math.min(1,age/impact),x=whale?a.source.x+(a.target.x-a.source.x)*p:a.target.x,y=whale?a.source.y+(a.target.y-a.source.y)*p:a.target.y;
 const frame=age<impact?Math.min(whale?3:2,Math.floor(age/impact*(whale?4:3))):(whale?4:3)+Math.min(whale?3:4,Math.floor((age-impact)/(ultimateConfig.duration-impact)*(whale?4:5)));
 return {x,y,frame,size:220,opacity:age>1.65?Math.max(0,(2-age)/.35):1,path:`vfx/${whale?'tidal-whale':'golden-anchor'}/${frame+1}.png`,targetId:a.targetId,source:a.source,target:a.target};
}
module.exports.ultimateVisual=ultimateVisual;
