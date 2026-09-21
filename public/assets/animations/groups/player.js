const groups=PawGroups,combat=PawCombat,renderer=PawRenderer;
const canvas=document.getElementById('arena'),ctx=canvas.getContext('2d'),assets={},loading=document.getElementById('loading');
const embedded=globalThis.PAW_EMBEDDED||{};
let selected=groups[0],battle=combat.create(selected),paused=matchMedia('(prefers-reduced-motion: reduce)').matches,loaded=false,previous=0,loadVersion=0;
const boostNames={speed:'Accélération des alliés',shield:'Bouclier pour les alliés',regen:'Régénération des alliés',evasion:'Esquive pour les alliés'};
function syncPause(){document.getElementById('pause').textContent=paused?'Lecture':'Pause';}
function loadImage(key,url){if(assets[key])return Promise.resolve(assets[key]);return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>{i.frameBounds=PawFrameBounds[key];assets[key]=i;resolve(i)};i.onerror=()=>reject(new Error('Image indisponible : '+key));i.src=embedded[key]||url;});}
function reset(){battle=combat.create(selected,Number(document.getElementById('allies').value),Number(document.getElementById('enemies').value));previous=0;if(loaded)renderer.draw(ctx,battle,assets);}
async function selectGroup(group){
 const version=++loadVersion;selected=group;loaded=false;loading.textContent='Chargement des personnages…';reset();
 document.querySelectorAll('#families button').forEach(b=>{const active=b.dataset.id===group.id;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
 document.getElementById('description').textContent=group.description;
 const details=document.getElementById('details');details.replaceChildren();
 for(const [i,h] of group.heroes.entries()){const card=document.createElement('article');card.className='card';const rarity=document.createElement('small');rarity.textContent=h.rarity.toUpperCase();const name=document.createElement('h3');name.textContent=h.name;const note=document.createElement('p');note.textContent=i<2?boostNames[group.boost]+' · effet de 4 secondes':'Attaque à portée · participe à la synergie';card.append(rarity,name,note);details.append(card);}
 try{await Promise.all([loadImage(group.id,group.id+'.webp'),loadImage('board','board.webp')]);if(version!==loadVersion)return;loaded=true;loading.textContent='';renderer.draw(ctx,battle,assets);}catch(e){if(version===loadVersion)loading.textContent=e.message+' — recharge l’aperçu.';}
}
for(const g of groups){const b=document.createElement('button');b.textContent=g.name;b.dataset.id=g.id;b.onclick=()=>selectGroup(g);document.getElementById('families').append(b);}
document.getElementById('pause').onclick=()=>{paused=!paused;syncPause();};document.getElementById('replay').onclick=reset;
document.getElementById('allies').onchange=reset;document.getElementById('enemies').onchange=reset;
function loop(ms){const delta=previous?Math.min((ms-previous)/1000,.1):0;previous=ms;
 if(loaded&&!paused&&!document.hidden){let remaining=delta*Number(document.getElementById('speed').value);while(remaining>0){const dt=Math.min(1/60,remaining);combat.step(battle,dt);remaining-=dt;}if(battle.time>24)reset();}
 if(loaded)renderer.draw(ctx,battle,assets);document.getElementById('clock').textContent=battle.time.toFixed(1).replace('.',',')+' s';requestAnimationFrame(loop);
}
document.addEventListener('visibilitychange',()=>{previous=0;});syncPause();selectGroup(selected);requestAnimationFrame(loop);
globalThis.PawPreview={groups,assets,get battle(){return battle},selectGroup,reset,render(){renderer.draw(ctx,battle,assets)},seek(t){battle=combat.simulate(selected,t,Number(document.getElementById('allies').value),Number(document.getElementById('enemies').value));renderer.draw(ctx,battle,assets);}};
