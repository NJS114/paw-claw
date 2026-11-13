// Render the unchanged game in an isolated CI browser. No player save is used.
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { chromium } from 'playwright';

const output = path.resolve('output/screens');
const dist = path.resolve('dist');
await fs.mkdir(output, { recursive: true });
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.png':'image/png', '.webp':'image/webp', '.svg':'image/svg+xml', '.json':'application/json', '.woff2':'font/woff2' };
const server = http.createServer(async (req, res) => {
  try {
    const url = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const root = url.startsWith('/__captures__/') ? output : dist;
    const relative = root === output ? url.slice('/__captures__/'.length) : url === '/' ? 'index.html' : url.slice(1);
    const filename = path.resolve(root, relative);
    if (!filename.startsWith(root + path.sep)) throw new Error('Invalid path');
    res.setHeader('Content-Type', types[path.extname(filename)] ?? 'application/octet-stream');
    res.end(await fs.readFile(filename));
  } catch { res.writeHead(404); res.end('Not found'); }
});
await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve));
const origin = 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:1.5, isMobile:true, hasTouch:true, locale:'fr-FR', reducedMotion:'reduce' });
const page = await context.newPage();
page.setDefaultTimeout(10000);
const screens = [], errors = [], consoleErrors = [];
page.on('pageerror', error => consoleErrors.push(error.message));
async function ready() {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.race([Promise.all(Array.from(document.images).filter(img=>img.getBoundingClientRect().top<innerHeight).map(img=>img.complete?Promise.resolve():new Promise(resolve=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',resolve,{once:true});}))),new Promise(resolve=>setTimeout(resolve,1600))]);
  });
}
async function shot(id, title, fixture = false) {
  await page.evaluate(()=>window.scrollTo(0,0));
  await ready();
  await page.screenshot({ path:path.join(output,id+'.png'), fullPage:false, animations:'disabled' });
  screens.push({id,title,fixture,file:id+'.png'});
  console.log('CAPTURED',id,title);
}
async function home() {
  await page.goto(origin, {waitUntil:'networkidle'});
  await page.getByRole('region',{name:'Accueil Paw & Claw'}).waitFor();
}
async function step(name, callback) {
  try { await callback(); }
  catch(error) {
    errors.push({step:name,error:error.message});
    console.error('CAPTURE FAILED',name,error.message);
    await page.screenshot({path:path.join(output,'error-'+name+'.png')}).catch(()=>{});
    await page.evaluate(()=>{localStorage.setItem('paw-claw.guide.v1','seen')}).catch(()=>{});
  }
}
try {
  await step('guide',async()=>{
    await page.goto(origin,{waitUntil:'domcontentloaded'});
    await page.getByRole('dialog',{name:'Bienvenue au royaume'}).waitFor();
    await shot('20-guide-bienvenue','Guide · bienvenue');
    await page.getByRole('button',{name:'Continuer',exact:true}).click();
    await shot('21-guide-duel','Guide · règles du duel');
    await page.getByRole('button',{name:'Continuer',exact:true}).click();
    await shot('22-guide-progression','Guide · progression');
    await page.getByRole('button',{name:'Entrer dans le royaume',exact:true}).click();
  });
  await step('accueil',async()=>{await home();await shot('01-accueil','Accueil');});
  await step('collection',async()=>{
    await home();await page.getByRole('button',{name:/Collection/}).click();
    await shot('02-collection','Collection');
    await page.getByRole('button',{name:/^Voir /}).first().click();await shot('03-fiche-carte','Fiche de carte');
    await page.getByRole('button',{name:'Fermer',exact:true}).click();
    await page.getByRole('button',{name:'Rechercher et filtrer les cartes'}).click();
    await page.getByRole('textbox',{name:'Rechercher une carte'}).fill('aucun-resultat-012');
    await shot('24-collection-vide','Collection · recherche vide');
  });
  await step('decks',async()=>{await home();await page.getByRole('button',{name:'Decks',exact:true}).click();await shot('04-decks','Atelier de decks');});
  await step('boutique',async()=>{
    await home();await page.getByRole('button',{name:'Boutique',exact:true}).click();await shot('05-boutique','Boutique');
    await page.getByRole('button',{name:'Le comptoir',exact:true}).click();await shot('06-comptoir','Le comptoir');
  });
  await step('boosters',async()=>{
    await home();await page.getByRole('button',{name:/^Boosters,/}).click();await shot('07-boosters','Booster · avant ouverture');
    await page.getByRole('button',{name:'Ouvrir',exact:true}).click();
    await page.getByRole('button',{name:/Révéler la carte 1/}).waitFor();
    await page.getByRole('button',{name:/Révéler la carte 1/}).click();await shot('08-revelation','Booster · révélation');
    for(let i=0;i<11;i++)await page.getByRole('button',{name:/Révéler la carte /}).click();
    await shot('09-booster-ouvert','Booster · récompenses');
  });
  await step('missions',async()=>{
    await home();await page.getByRole('button',{name:'Missions',exact:true}).click();await shot('10-missions','Missions');
    await page.getByRole('tab',{name:'Passe de combat',exact:true}).click();await shot('11-passe','Passe de combat');
  });
  await step('profil',async()=>{await home();await page.getByRole('button',{name:'Ouvrir le profil',exact:true}).click();await shot('12-profil','Profil du joueur');});
  await step('reglages',async()=>{
    await home();await page.getByRole('button',{name:'Réglages du jeu',exact:true}).click();await shot('13-reglages','Réglages');
    await page.getByRole('button',{name:'Histoires des héros',exact:true}).click();await shot('14-histoires','Histoires des héros');
  });
  await step('equipages',async()=>{
    await home();await page.getByRole('button',{name:/Duel des pirates/}).click();await shot('15-equipages','Aperçu des équipages');
  });
  let duel;
  await step('combat',async()=>{
    await home();await page.getByRole('button',{name:'Jouer en arène',exact:true}).click();
    await page.getByRole('button',{name:'Prêt',exact:true}).waitFor();await shot('16-preparation','Préparation du duel');
    await page.getByRole('button',{name:'Prêt',exact:true}).click();
    await page.getByRole('button',{name:'Entrer dans l’arène',exact:true}).waitFor();await shot('17-main-depart','Choix de la main de départ');
    await page.getByRole('button',{name:'Entrer dans l’arène',exact:true}).click();
    const card=page.locator('.hand .hand-card:not([disabled])').first();
    await card.click();await page.locator('.player-zone .arena-slot').first().click();
    await page.getByRole('button',{name:'Terminer le tour',exact:true}).click();
    await page.getByRole('button',{name:'Terminer le tour',exact:true}).waitFor();
    await page.waitForFunction(()=>!document.querySelector('.end-turn-button')?.disabled);
    await shot('18-combat','Combat · plateau et main');
    duel=await page.evaluate(()=>JSON.parse(localStorage.getItem('paw-claw.battle.active.v3')));
    await page.getByRole('button',{name:'Abandonner',exact:true}).click();await shot('25-abandon','Confirmation d’abandon');
    await page.getByRole('button',{name:'Continuer le duel',exact:true}).click();
    await page.getByRole('button',{name:'Retour à l’accueil',exact:true}).click();await shot('26-retour','Quitter le duel et sauvegarder');
    await page.getByRole('button',{name:'Sauvegarder et quitter',exact:true}).click();
    await page.getByRole('button',{name:'Jouer en arène',exact:true}).click();await shot('23-reprise','Reprise du duel sauvegardé');
  });
  // Use valid, isolated saved-game fixtures to render the existing result screens.
  // These are explicitly labelled as test states in the gallery, not player history.
  if(duel)for(const [id,title,playerHp,enemyHp] of [
    ['19-victoire','Victoire · état de test',12,0],
    ['27-defaite','Défaite · état de test',0,12],
    ['28-egalite','Égalité · état de test',0,0],
  ])await step(id,async()=>{
    const saved=structuredClone(duel);saved.state.player.heroHp=playerHp;saved.state.enemy.heroHp=enemyHp;saved.phase='player';saved.checkpoint='stable-player';saved.checkpointState=structuredClone(saved.state);
    await page.evaluate(value=>localStorage.setItem('paw-claw.battle.active.v3',JSON.stringify(value)),saved);
    await home();await page.getByRole('button',{name:'Jouer en arène',exact:true}).click();await page.getByRole('button',{name:'Reprendre le duel',exact:true}).click();
    await page.locator('.result-overlay').waitFor();await shot(id,title,true);
  });
  screens.sort((a,b)=>a.id.localeCompare(b.id));
  const note='Captures du code actuel dans Chromium, fenêtre mobile 390 × 844. Aucun habillage de l’application modifié. Les résultats de combat utilisent des sauvegardes de test, signalées ci-dessous. Ce ne sont pas des captures prises sur un téléphone physique.';
  const esc=value=>value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function html(items,title,columns=4){return `<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><style>body{margin:0;padding:28px;background:#f1e5cf;color:#513d2c;font:16px Arial,sans-serif}h1{font:700 34px Georgia,serif;margin:0 0 12px}header{max-width:1080px;margin:auto auto 24px}header p{line-height:1.5;font-size:14px}main{display:grid;grid-template-columns:repeat(${columns},minmax(0,1fr));gap:24px;max-width:1800px;margin:auto}figure{margin:0;min-width:0}img{display:block;width:100%;height:auto;border:1px solid #a48762;border-radius:12px;box-sizing:border-box}figcaption{padding:10px 0;font-size:16px;font-weight:bold}figcaption small{display:block;font-size:11px;font-weight:normal;margin-top:4px}@media(max-width:700px){main{grid-template-columns:repeat(2,minmax(0,1fr))}}</style><header><h1>${esc(title)}</h1><p>${esc(note)}</p><p>Source : ${esc(process.env.GITHUB_SHA??'copie locale')} · ${screens.length} vues</p></header><main>${items.map(s=>`<figure><a href="${s.file}"><img src="${s.file}" alt="${esc(s.title)}"></a><figcaption>${esc(s.title)}${s.fixture?'<small>État de démonstration — rendu réel de l’écran</small>':''}</figcaption></figure>`).join('')}</main></html>`;}
  await fs.writeFile(path.join(output,'index.html'),html(screens,'Paw & Claw — tous les écrans actuels'));
  const primary=['01-accueil','02-collection','04-decks','05-boutique','07-boosters','18-combat'];
  const first=primary.map(id=>screens.find(s=>s.id===id)).filter(Boolean);
  const rest=screens.filter(s=>!primary.includes(s.id));
  const groups=[first,...Array.from({length:Math.ceil(rest.length/6)},(_,i)=>rest.slice(i*6,i*6+6))];
  const boardPage=await browser.newPage({viewport:{width:1140,height:1900},deviceScaleFactor:1});
  for(let i=0;i<groups.length;i++){
    const filename=`planche-${String(i+1).padStart(2,'0')}`;
    await fs.writeFile(path.join(output,filename+'.html'),html(groups[i],`Paw & Claw — aperçu ${i+1}`,3));
    await boardPage.goto(origin+'/__captures__/'+filename+'.html',{waitUntil:'networkidle'});
    await boardPage.screenshot({path:path.join(output,filename+'.png'),fullPage:true});
  }
  await fs.writeFile(path.join(output,'manifest.json'),JSON.stringify({source:process.env.GITHUB_SHA,viewport:{width:390,height:844},note,screens,errors,consoleErrors},null,2));
  await fs.writeFile(path.join(output,'LIRE-MOI.txt'),note+'\n\nOuvrir index.html avec tous les PNG dans le même dossier. Les planches regroupent les captures sans changer leur contenu.\n\nErreurs de parcours : '+JSON.stringify(errors,null,2));
  console.log('FINISHED',screens.length,'screens;',errors.length,'incomplete journeys');
  if(screens.length<12)process.exitCode=1;
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
