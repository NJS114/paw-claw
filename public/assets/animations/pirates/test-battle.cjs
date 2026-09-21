const assert=require('node:assert/strict'),m=require('./synergy-model.cjs');
const b=m.createBattle(3);let moved=0,attacks=0;
for(let i=0;i<540;i++){
 const old=new Map(b.units.map(u=>[u.id,{x:u.x,y:u.y,stun:u.stunnedUntil}]));m.stepBattle(b,1/30);
 for(const u of b.units){
  const p=old.get(u.id);
  if(u.state==='walk'){moved++;assert(Math.hypot(u.x-p.x,u.y-p.y)>0);}
  if(u.state==='attack'){attacks++;const target=b.units.find(t=>t.id===u.targetId);assert(m.distance(u,target)<=u.range+.002);assert(u.stunnedUntil<=b.time);}
  if(p.stun>b.time){assert.equal(u.x,p.x);assert.equal(u.y,p.y);assert.notEqual(u.state,'attack');}
 }
}
assert(moved>100);assert(attacks>20);
assert(b.events.filter(e=>e.type==='hit'||e.type==='attack-start').every(e=>e.distance<=e.range+.002));
assert.equal(b.events.filter(e=>e.type==='wave-hit'&&e.team===0).length,3);
assert.equal(m.simulate(10,2).wave,null);
// Force a target out of reach during an attack windup: cancel, walk, no hit.
const c=m.simulate(3.5,3),u=c.units[0],target=c.units[3];
u.attack={start:c.time-.1,targetId:target.id,struck:false};target.x+=300;u.hitAt=-100;
const prior=c.events.filter(e=>e.type==='hit'&&e.id===u.id).length;
m.stepBattle(c,1/30);assert.equal(u.state,'walk');assert.equal(u.attack,null);assert.equal(c.events.filter(e=>e.type==='hit'&&e.id===u.id).length,prior);
// Stun expiry must recheck distance, not resume an old attack.
u.stunnedUntil=c.time+.3;const x=u.x;for(let i=0;i<8;i++)m.stepBattle(c,1/30);assert.equal(u.x,x);m.stepBattle(c,.1);assert.equal(u.state,'walk');
console.log('PASS: movement, range-gated animation/hits, attack cancellation, stun immobility, range recheck after stun, three one-time ship hits, 2-Pirate synergy disabled.');
