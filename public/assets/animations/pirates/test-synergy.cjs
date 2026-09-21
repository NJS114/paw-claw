const assert=require('node:assert/strict'),c=require('./synergy-model.cjs');
const allies=Array.from({length:3},(_,i)=>({id:'a'+i,team:0,pirate:true,hp:100,onBoard:true,x:0,y:0}));
assert.equal(c.eligible(allies.slice(0,2),0),false);assert.equal(c.eligible(allies,0),true);
assert.equal(c.eligible(allies.map((u,i)=>({...u,onBoard:i!==2})),0),false);
assert.equal(c.eligible(allies.map((u,i)=>({...u,hp:i===2?0:100})),0),false);
for(const direction of [1,-1]){
 const units=[...allies.map(u=>({...u})),{id:'enemy',team:1,hp:100,onBoard:true,x:50*direction,y:0},{id:'outside',team:1,hp:100,onBoard:true,x:50*direction,y:200}];
 const wave=c.cast(units,0,{x:0,y:0},{x:100*direction,y:0},1);
 assert.equal(c.update(wave,units,2).length,0);
 assert.equal(c.update(wave,units,2.5).length,1);
 assert.equal(units[3].hp,70);assert.equal(units[4].hp,100);assert.equal(units[0].hp,100);
 assert.equal(c.update(wave,units,3).length,0);assert.equal(units[3].hp,70);
 assert.equal(c.canAct(units[3],4.49),false);assert.equal(c.canAct(units[3],4.5),true);
}
console.log('PASS: 2/3 threshold, alive/on-board filtering, both travel directions, contact timing, single hit, allies and outside targets spared, stun expiry.');
