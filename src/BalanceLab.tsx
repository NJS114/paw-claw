import { useMemo, useState } from 'react';
import { cards, families, rarities, type CardData, type Rarity } from './data/gameCards';
import { cardStatBudget, rarityBalanceDelta, rarityPowerLabel, rarityRule, targetStatBudget } from './data/rarityBalance';

type Status='Tous'|'Au-dessus de la courbe'|'Équilibrée'|'Sous la courbe';
type SortKey='delta'|'cost'|'rarity'|'name';

function suggestion(card:CardData){
  if(card.type!=='Héros') return 'Hors analyse de stats';
  const delta=rarityBalanceDelta(card);
  if(delta>=3)return `Réduire d’environ ${Math.ceil(delta/2)} ATQ/PV ou augmenter le coût.`;
  if(delta===2)return 'Réduire 1 ATQ ou 1 PV, ou augmenter légèrement le coût.';
  if(delta<=-3)return `Ajouter environ ${Math.ceil(Math.abs(delta)/2)} ATQ/PV ou réduire le coût.`;
  if(delta===-2)return 'Ajouter 1 ATQ ou 1 PV, ou réduire légèrement le coût.';
  return 'Dans la fenêtre cible.';
}

function rarityRank(r:Rarity){return rarityRule(r).rank}

export function BalanceLab(){
  const[rarity,setRarity]=useState<'Toutes'|Rarity>('Toutes');
  const[family,setFamily]=useState('Tous');
  const[status,setStatus]=useState<Status>('Tous');
  const[sort,setSort]=useState<SortKey>('delta');
  const[query,setQuery]=useState('');
  const heroes=useMemo(()=>cards.filter(c=>c.type==='Héros'),[]);
  const analyzed=useMemo(()=>heroes.map(card=>({card,actual:cardStatBudget(card),target:targetStatBudget(card),delta:rarityBalanceDelta(card),label:rarityPowerLabel(card)})),[heroes]);
  const filtered=useMemo(()=>analyzed.filter(x=>(rarity==='Toutes'||x.card.rarity===rarity)&&(family==='Tous'||x.card.family===family)&&(status==='Tous'||x.label===status)&&x.card.name.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>{
    if(sort==='delta')return Math.abs(b.delta)-Math.abs(a.delta)||b.delta-a.delta;
    if(sort==='cost')return a.card.cost-b.card.cost||b.delta-a.delta;
    if(sort==='rarity')return rarityRank(b.card.rarity)-rarityRank(a.card.rarity)||b.delta-a.delta;
    return a.card.name.localeCompare(b.card.name);
  }),[analyzed,rarity,family,status,sort,query]);
  const above=analyzed.filter(x=>x.delta>=2).length,below=analyzed.filter(x=>x.delta<=-2).length,balanced=analyzed.length-above-below;
  return <section className="balance-screen">
    <div className="balance-head"><div><p className="eyebrow">BALANCE LAB</p><h2>Équilibrage coût · rareté · stats</h2><p>Chaque héros est comparé à une courbe cible. La rareté donne un petit budget supplémentaire, mais ne remplace pas le coût ni les synergies.</p></div><div className="balance-summary"><span><strong>{balanced}</strong> équilibrées</span><span><strong>{above}</strong> trop fortes</span><span><strong>{below}</strong> trop faibles</span></div></div>
    <div className="rarity-rules">{(['Commune','Rare','Épique','Légendaire'] as Rarity[]).map(r=>{const rule=rarityRule(r);return <article key={r} className={`rarity-rule ${r.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}`}><small>{r}</small><strong>{rule.label}</strong><span>Bonus budget +{rule.targetBonus}</span><span>{rule.maxCopies} exemplaire{rule.maxCopies>1?'s':''} max / deck</span></article>})}</div>
    <div className="balance-toolbar"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher une carte…"/><select value={family} onChange={e=>setFamily(e.target.value)}><option>Tous</option>{families.slice(1).map(f=><option key={f}>{f}</option>)}</select><select value={rarity} onChange={e=>setRarity(e.target.value as 'Toutes'|Rarity)}><option>Toutes</option>{rarities.filter(r=>r!=='Toutes').map(r=><option key={r}>{r}</option>)}</select><select value={status} onChange={e=>setStatus(e.target.value as Status)}><option>Tous</option><option>Au-dessus de la courbe</option><option>Équilibrée</option><option>Sous la courbe</option></select><select value={sort} onChange={e=>setSort(e.target.value as SortKey)}><option value="delta">Écart le plus fort</option><option value="cost">Coût</option><option value="rarity">Rareté</option><option value="name">Nom</option></select></div>
    <div className="balance-table-wrap"><table className="balance-table"><thead><tr><th>Carte</th><th>Famille</th><th>Rareté</th><th>Coût</th><th>ATQ</th><th>PV</th><th>Budget</th><th>Cible</th><th>Écart</th><th>Diagnostic</th><th>Ajustement conseillé</th></tr></thead><tbody>{filtered.map(({card,actual,target,delta,label})=><tr key={card.id} className={delta>=2?'over':delta<=-2?'under':'ok'}><td><strong>{card.name}</strong><small>{card.id}</small></td><td>{card.family}</td><td><span className={`rarity-pill ${card.rarity.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}`}>{card.rarity}</span></td><td>{card.cost}</td><td>{card.atk??0}</td><td>{card.hp??0}</td><td>{actual}</td><td>{target}</td><td><strong>{delta>0?`+${delta}`:delta}</strong></td><td>{label}</td><td>{suggestion(card)}</td></tr>)}</tbody></table></div>
    <p className="balance-footnote">Tolérance actuelle : un écart de -1 à +1 reste considéré équilibré. Les capacités spéciales et performances réelles en match devront ensuite compléter cette analyse de stats brutes.</p>
  </section>
}
