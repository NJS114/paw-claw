import { useMemo, useState } from 'react';
import { cards } from './data/gameCards';
import { LORE_BONDS } from './data/loreSynergies';
import { t,type Locale } from './i18n';

export function Stories({locale}:{locale:Locale}){
 const[selected,setSelected]=useState(LORE_BONDS[0]?.id??'');
 const bond=useMemo(()=>LORE_BONDS.find(x=>x.id===selected)??LORE_BONDS[0],[selected]);
 if(!bond)return <section className="stories-screen"><h2>{t(locale,'storiesTitle')}</h2></section>;
 const a=cards.find(c=>c.id===bond.cardA),b=cards.find(c=>c.id===bond.cardB);
 const effect=bond.effect==='mutual-destruction'?(locale==='fr'?'Si ces deux personnages sont présents en même temps sur le terrain, ils sont immédiatement éliminés.':'If both characters are on the battlefield at the same time, they are immediately eliminated.'):(bond.effect==='buff'?(locale==='fr'?`Les deux personnages gagnent +${bond.value??1} ATQ et +${bond.value??1} PV.`:`Both characters gain +${bond.value??1} ATK and +${bond.value??1} HP.`):(locale==='fr'?`Les deux personnages perdent ${bond.value??1} ATQ.`:`Both characters lose ${bond.value??1} ATK.`));
 return <section className="stories-screen"><aside className="stories-sidebar"><h2>{t(locale,'storiesTitle')}</h2><p>{t(locale,'storiesIntro')}</p><div className="story-list">{LORE_BONDS.map(x=><button key={x.id} className={x.id===bond.id?'active':''} onClick={()=>setSelected(x.id)}><strong>{x.title}</strong><small>{x.effect==='mutual-destruction'?'Destin':x.effect==='buff'?'Alliance':'Rivalité'}</small></button>)}</div><div className="war-note"><strong>CHATS / CHIENS</strong><span>{locale==='fr'?'Deux peuples. Un seul destin.':'Two peoples. One destiny.'}</span></div></aside><article className="story-detail"><div className="story-hero"><div><p className="eyebrow">LORE · PAW & CLAW</p><h1>{bond.title}</h1><div className="story-tags"><span>{a?.family}</span><span>{b?.family}</span></div><p>{bond.story}</p></div></div><div className="story-effect"><strong>{t(locale,'effect')}</strong><p>{effect}</p></div><div className="story-pair">{[a,b].map(c=>c&&<article key={c.id} className={`story-card ${c.rarity.toLowerCase()}`}><div className="story-card-art"><img src={c.assetPath??'/assets/generated/carte-bleue.webp'} alt={c.name}/><span>{c.cost}</span></div><h3>{c.name}</h3><p>{c.family} · {c.rarity}</p><div><b>ATQ {c.atk}</b><b>PV {c.hp}</b></div></article>)}</div></article></section>
}
