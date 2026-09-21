const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'../public/assets/animations/groups');
const groups=require(root+'/groups.cjs'),m=require(root+'/combat.cjs');
assert.equal(groups.length,9);
for(const name of ['groups.cjs','combat.cjs','renderer.cjs','player.js'])new vm.Script(fs.readFileSync(path.join(root,name),'utf8'),{filename:name});
for(const group of groups){
 assert(fs.existsSync(path.join(root,group.id+'.webp')));
 for(const [a,e] of [[3,3],[2,3],[3,2],[2,2]]){
  const b=m.simulate(group,24,a,e);
  const teams=b.events.filter(e=>e.type==='synergy').map(e=>e.team);
  assert.deepEqual(teams,[...(a===3?[0]:[]),...(e===3?[1]:[])],group.id+' independent synergy thresholds');
  for(const event of b.events){
   const source=b.units.find(u=>u.id===event.from),target=b.units.find(u=>u.id===event.target);
   if(event.type==='attack-start')assert(event.distance<=event.range+.01,'No attack outside range');
   if(event.type==='hit')assert.notEqual(source.team,target.team,'No friendly fire');
   if(['heal','boost'].includes(event.type))assert.equal(source.team,target.team,'Own team support');
   if(event.type==='boost')assert.notEqual(source.id,target.id,'Boosts other teammates');
  }
  assert(b.events.some(e=>e.type==='ultimate-start'),'Specials trigger '+group.id);
  assert(b.effects.filter(e=>e.start+e.duration<=b.time).every(e=>e.impact===true),'All arrived effects resolve');
 }
 const b=m.create(group);m.step(b,1);
 const u=b.units[0],target=m.targetFor(b,u);u.x=target.x-u.hero.range+10;u.y=target.y;u.nextAttack=0;
 m.step(b,.02);assert.equal(u.state,'attack');
 target.x+=450;m.step(b,.02);assert.equal(u.state,'walk');assert.equal(u.attack,null);
 u.stunUntil=b.time+2;const x=u.x,y=u.y;m.step(b,.1);assert.equal(u.state,'stun');assert.equal(u.x,x);assert.equal(u.y,y);
 u.boost={type:'shield',until:b.time+.05,from:'0-1'};u.shield=18;m.step(b,.1);assert.equal(u.boost,null);assert.equal(u.shield,0);
 if(group.id==='guerisseurs')assert(m.simulate(group,10).events.some(e=>e.type==='heal'&&e.amount>0),'Actual healing');
 console.log('PASS',group.name,': portée, déplacements, annulation, stun, ultimes, soutien, expiration, seuils 3/3 2/3 3/2 2/2');
}
