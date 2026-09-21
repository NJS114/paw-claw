const assert=require('node:assert/strict'),m=require('./synergy-model.cjs');
for(const [a,e,teams] of [[3,3,[0,1]],[2,3,[1]],[3,2,[0]],[2,2,[]]]){
 const b=m.simulate(22,a,e);assert.deepEqual(b.waves.map(w=>w.team),teams);
 for(const event of b.events.filter(e=>e.type==='wave-hit')){const victim=b.units.find(u=>u.id===event.targetId);assert.notEqual(victim.team,event.team);}
 for(const w of b.waves){const hits=b.events.filter(e=>e.type==='wave-hit'&&e.team===w.team);assert.equal(new Set(hits.map(e=>e.targetId)).size,hits.length);assert.equal(hits.length,w.team===0?e:a);}
 if(teams.length===2){assert.deepEqual(b.waves[0].source,b.waves[1].target);assert.deepEqual(b.waves[0].target,b.waves[1].source);}
}
const b=m.simulate(18.1);for(const u of b.units.filter(u=>u.team===0&&u.hp>0)){assert(u.stunnedUntil>b.time);assert(!m.canAct(u,b.time));}
console.log('PASS: independent 3-Pirate thresholds on both teams, reverse trajectories, enemy-only damage, one hit per target, reverse wave stun.');
