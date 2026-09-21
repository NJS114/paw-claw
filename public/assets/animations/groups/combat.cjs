(function(root){
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const alive=u=>u.onBoard&&u.hp>0;
const active=(u,t)=>alive(u)&&t>=u.stunUntil;
const boostActive=(u,t)=>u.boost&&t<u.boost.until;
function create(group,count=3,enemyCount=3){
 const points=[[235,320],[210,475],[275,630],[940,220],[975,375],[930,530]];
 return {group,time:0,events:[],effects:[],synergyUsed:[false,false],units:points.map(([x,y],i)=>({id:`${i<3?0:1}-${i%3}`,team:i<3?0:1,slot:i%3,hero:group.heroes[i%3],x,y,hp:group.id==='guerisseurs'?105:160,maxHp:160,onBoard:i%3<(i<3?count:enemyCount),state:'appear',frame:0,attack:null,skill:null,skillUsed:false,nextAttack:0,stunUntil:0,shield:0,boost:null,hitAt:-100,lastAmount:0,regenTick:0,incomingHits:0}))};
}
function targetFor(b,u,friendly=false){
 const candidates=b.units.filter(v=>alive(v)&&(friendly?v.team===u.team&&v.id!==u.id:v.team!==u.team));
 if(friendly)return candidates.sort((a,c)=>a.hp/a.maxHp-c.hp/c.maxHp)[0];
 return candidates.find(v=>v.slot===u.slot)||candidates.sort((a,c)=>distance(a,u)-distance(c,u))[0];
}
function log(b,event){b.events.push({time:b.time,...event});}
function applyBoost(b,from){
 for(const u of b.units.filter(v=>alive(v)&&v.team===from.team&&v.id!==from.id)){
  u.boost={type:b.group.boost,until:b.time+4,from:from.id,start:b.time};
  if(b.group.boost==='shield')u.shield=Math.max(u.shield,18);
  log(b,{type:'boost',from:from.id,target:u.id,kind:b.group.boost});
 }
}
function heal(b,from,u,amount){
 if(!alive(u)||u.team!==from.team)return;
 const actual=Math.min(amount,u.maxHp-u.hp);u.hp+=actual;u.lastAmount=actual;u.hitAt=b.time;
 log(b,{type:'heal',from:from.id,target:u.id,amount:actual});
}
function damage(b,from,u,amount,stun=0){
 if(!alive(u)||u.team===from.team)return;
 u.incomingHits++;
 if(boostActive(u,b.time)&&u.boost.type==='evasion'&&u.incomingHits%2===0){log(b,{type:'dodge',from:from.id,target:u.id});u.dodgeAt=b.time;return;}
 const absorbed=Math.min(u.shield,amount);u.shield-=absorbed;amount-=absorbed;
 u.hp=Math.max(0,u.hp-amount);u.hitAt=b.time;u.lastAmount=-amount;
 if(stun){u.stunUntil=Math.max(u.stunUntil,b.time+stun);u.attack=null;u.skill=null;}
 log(b,{type:'hit',from:from.id,target:u.id,amount,absorbed,stun});
}
function launch(b,u,target,kind){
 const special=kind==='ultimate',synergy=kind==='synergy';
 b.effects.push({id:b.effects.length,kind,team:u.team,from:u.id,target:target.id,source:{x:u.x,y:u.y-65},dest:{x:target.x,y:target.y-55},start:b.time,duration:synergy?1.5:special?.8:.3,impact:false,color:special?u.hero.color:b.group.accent,effect:synergy?b.group.synergyEffect:special?u.hero.effect:'bolt'});
 log(b,{type:'launch',kind,from:u.id,target:target.id,range:distance(u,target)});
}
function step(b,dt){
 b.time+=dt;const now=b.time,moves=[];
 for(const u of b.units){
  if(!alive(u)){u.state='dead';u.frame=0;continue;}
  if(u.boost&&now>=u.boost.until){u.boost=null;u.shield=0;}
  if(boostActive(u,now)&&u.boost.type==='regen'){
   u.hp=Math.min(u.maxHp,u.hp+3*dt);
   if(now>=u.regenTick){u.regenTick=now+1;log(b,{type:'regen',target:u.id});}
  }
  if(now<.6){u.state='appear';u.frame=0;continue;}
  if(!active(u,now)){u.state='stun';u.frame=0;u.attack=null;u.skill=null;continue;}
  const enemy=targetFor(b,u);if(!enemy){u.state='idle';u.frame=0;continue;}
  u.facing=enemy.y<u.y?'rear':'front';
  const friendly=b.group.id==='guerisseurs';
  const skillTarget=friendly?targetFor(b,u,true):enemy;
  const readyAt=5+u.slot*4+u.team*2;
  if(u.slot<2&&!u.skillUsed&&now>=readyAt&&skillTarget&&distance(u,skillTarget)<=310){
   u.skill={start:now,target:skillTarget.id,launched:false};u.skillUsed=true;u.attack=null;log(b,{type:'ultimate-start',from:u.id,target:skillTarget.id});
  }
  if(u.skill){
   const age=now-u.skill.start;u.state='ultimate';u.frame=age<.65?6:7;
   if(age>=.65&&!u.skill.launched){const target=b.units.find(v=>v.id===u.skill.target);if(target&&alive(target)&&distance(u,target)<=310){launch(b,u,target,'ultimate');}u.skill.launched=true;}
   if(age<1.7)continue;u.skill=null;u.nextAttack=now+.25;
  }
  const d=distance(u,enemy),range=u.hero.range;
  if(d>range+.01){
   if(u.attack)log(b,{type:'attack-cancel',from:u.id});u.attack=null;u.state='walk';u.frame=1+Math.floor(now*7)%2;
   const travel=Math.min(88*dt,(d-range)/2);moves.push({u,x:u.x+(enemy.x-u.x)/d*travel,y:u.y+(enemy.y-u.y)/d*travel});continue;
  }
  if(!u.attack&&now>=u.nextAttack){
   const rate=boostActive(u,now)&&u.boost.type==='speed'?1.4:1;
   u.attack={start:now,rate,launched:false};u.nextAttack=now+1.45/rate;
   log(b,{type:'attack-start',from:u.id,target:enemy.id,distance:d,range,rate});
  }
  if(u.attack){
   const age=(now-u.attack.start)*u.attack.rate;
   u.state='attack';u.frame=age<.26?3:age<.52?4:5;
   if(age>=.3&&!u.attack.launched){launch(b,u,enemy,'normal');u.attack.launched=true;}
   if(age>=.8){u.attack=null;u.state='idle';u.frame=0;}
  }else{u.state='idle';u.frame=0;}
 }
 for(const m of moves){m.u.x=m.x;m.u.y=m.y;}
 for(const team of [0,1]){
  if(!b.synergyUsed[team]&&now>=16+team*3.5){
   const allies=b.units.filter(u=>alive(u)&&u.team===team);
   if(allies.length>=3){
    const caster=allies.find(u=>active(u,now));
    const target=caster&&targetFor(b,caster,b.group.id==='guerisseurs');
    if(caster&&target){launch(b,caster,target,'synergy');b.synergyUsed[team]=true;log(b,{type:'synergy',team});}
   }
  }
 }
 for(const fx of b.effects){
  if(fx.impact||now<fx.start+fx.duration)continue;
  fx.impact=true;fx.impactAt=now;
  const from=b.units.find(u=>u.id===fx.from),target=b.units.find(u=>u.id===fx.target);
  if(!target||!alive(target))continue;
  fx.dest={x:target.x,y:target.y-55};
  if(fx.kind==='normal'){damage(b,from,target,3);continue;}
  if(b.group.id==='guerisseurs'){
   const receivers=fx.kind==='synergy'?b.units.filter(u=>alive(u)&&u.team===from.team):[target];
   for(const u of receivers)heal(b,from,u,fx.kind==='synergy'?28:24);
  }else{
   const victims=fx.kind==='synergy'?b.units.filter(u=>alive(u)&&u.team!==from.team):b.units.filter(u=>alive(u)&&u.team!==from.team&&distance(u,target)<155);
   for(const u of victims)damage(b,from,u,fx.kind==='synergy'?16:14,fx.kind==='synergy'?(b.group.id==='nature'?2:1):0);
  }
  applyBoost(b,from);
  log(b,{type:'impact',kind:fx.kind,from:fx.from,target:fx.target,x:fx.dest.x,y:fx.dest.y});
 }
}
function simulate(group,time=24,count=3,enemyCount=3){const b=create(group,count,enemyCount);while(b.time<time-1e-8)step(b,Math.min(1/30,time-b.time));return b;}
const api={create,step,simulate,distance,alive,active,targetFor,boostActive};
if(typeof module!=='undefined')module.exports=api;else root.PawCombat=api;
})(typeof globalThis!=='undefined'?globalThis:this);
