const assert=require('node:assert/strict'),m=require('./synergy-model.cjs');
const b=m.simulate(18,3),starts=b.events.filter(e=>e.type==='ultimate-start'),boosts=b.events.filter(e=>e.type==='boost');
assert.equal(starts.length,2);assert.deepEqual(starts.map(e=>e.id),['fantome-sphynx','amiral-bouvier']);
assert(starts.every(e=>e.distance<=m.ultimateConfig.range));assert.equal(boosts.length,4);
for(const event of boosts){const caster=b.units.find(u=>u.id===event.id),ally=b.units.find(u=>u.id===event.targetId);assert.equal(caster.team,ally.team);assert.notEqual(caster.id,ally.id);assert(ally.pirate);assert.equal(ally.boostUntil,event.time+4);}
const accelerated=b.events.filter(e=>e.type==='attack-start'&&e.rate>1);assert(accelerated.length>10);
for(const e of accelerated){const applied=boosts.find(v=>v.targetId===e.id);assert(e.time>=applied.time&&e.time<applied.time+4);assert.equal(e.rate,1.4);}
assert(b.events.filter(e=>e.type==='attack-start'&&e.time>14).every(e=>e.rate===1));
assert.equal(b.events.filter(e=>e.type==='wave-hit'&&e.team===0).length,3);
assert(b.events.filter(e=>e.type==='ultimate-hit').length>=2);
const disabled=m.createBattle();disabled.units[0].stunnedUntil=7;while(disabled.time<6)m.stepBattle(disabled,1/30);assert(!disabled.events.some(e=>e.type==='ultimate-start'&&e.id==='fantome-sphynx'));
const blocked=m.createBattle();blocked.units[1].pirate=false;while(blocked.time<6)m.stepBattle(blocked,1/30);assert(!blocked.events.some(e=>e.type==='boost'&&e.targetId==='matelot-tabby'));
console.log('PASS: both ultimates, own living Pirate teammates only, actual attack acceleration, boost expiry, stun prevents ultimate, normal range and ship preserved.');
