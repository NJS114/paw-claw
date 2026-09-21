const assert=require('node:assert/strict'),m=require('./synergy-model.cjs');
for(const [time,id]of [[4.75,'fantome-sphynx'],[9.25,'amiral-bouvier']]){
 const b=m.simulate(time),caster=b.units.find(u=>u.id===id),fx=m.ultimateVisual(caster,time),enemy=b.units.find(u=>u.id===fx.targetId);
 assert.notEqual(enemy.team,caster.team);assert.equal(fx.x,enemy.x);assert.equal(fx.y,enemy.y);assert(Math.hypot(fx.x-caster.x,fx.y-caster.y)>100);
 const hits=b.events.filter(e=>e.type==='ultimate-hit'&&e.id===id);assert(hits.length);assert(hits.every(e=>e.time>=caster.ultimate.start+m.ultimateConfig.impactAt));
}
const b=m.simulate(4.3),u=b.units[0],fx=m.ultimateVisual(u,4.3);assert(fx.x>u.x&&fx.x<fx.target.x);assert(!b.events.some(e=>e.type==='ultimate-hit'));
console.log('PASS: whale travels from caster to enemy; both impacts are on enemy coordinates; damage occurs at impact, not during launch.');
