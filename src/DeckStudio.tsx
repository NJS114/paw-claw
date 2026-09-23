import { useEffect,useMemo,useState } from 'react';
import { cards,type CardData } from './data/gameCards';
import type { OwnedCards } from './data/collection';
import { DECK_SIZE,validateDeck,type SavedDeck } from './data/deck';
import { speciesOf,type Species } from './data/loreSynergies';
import { analyzeDeck } from './data/deckAnalysis';
import { createDeckProfile,deleteDeck,loadActiveDeckId,loadDeckLibrary,saveActiveDeckId,saveDeckLibrary,toggleFavorite,upsertDeck,type DeckLibrary,type DeckProfile } from './data/deckLibrary';
import {GameCard} from './GameCard';
import {rarityCopyLimit} from './data/rarityBalance';

function costCurve(deck:DeckProfile){const curve=[0,0,0,0,0,0,0];for(const id of deck.cardIds){const c=cards.find(x=>x.id===id);if(c)curve[Math.min(6,c.cost)]++}return curve}
function families(deck:DeckProfile){return deck.cardIds.map(id=>cards.find(c=>c.id===id)?.family).filter(Boolean).reduce<Record<string,number>>((a,f)=>{a[f as string]=(a[f as string]||0)+1;return a},{})}

export function DeckStudio({owned,activeDeck,onActiveDeckChange,onPlay}:{owned:OwnedCards;activeDeck:SavedDeck;onActiveDeckChange:(d:SavedDeck)=>void;onPlay:()=>void}){
 const[lib,setLib]=useState<DeckLibrary>(()=>{const loaded=loadDeckLibrary();if(loaded.decks.length)return loaded;const species=(activeDeck.cardIds[0]&&cards.find(c=>c.id===activeDeck.cardIds[0]))?speciesOf(cards.find(c=>c.id===activeDeck.cardIds[0])!):'Chat';return {version:1,decks:[{...createDeckProfile(species,activeDeck.name),cardIds:activeDeck.cardIds}]}});
 const[activeId,setActiveId]=useState(()=>loadActiveDeckId()||lib.decks[0]?.id||'');
 const[panel,setPanel]=useState<'deck'|'collection'>('deck');
 const[family,setFamily]=useState('Toutes');
 const[confirmed,setConfirmed]=useState(false);
 const active=lib.decks.find(d=>d.id===activeId)??lib.decks[0];
 useEffect(()=>{saveDeckLibrary(lib)},[lib]);
 useEffect(()=>{if(active){saveActiveDeckId(active.id);onActiveDeckChange({version:1,name:active.name,cardIds:active.cardIds,updatedAt:active.updatedAt})}},[active?.id,active?.updatedAt]);
 if(!active)return <section className="deck-studio"><button className="primary" onClick={()=>{const d=createDeckProfile('Chat');setLib({version:1,decks:[d]});setActiveId(d.id)}}>Créer un deck</button></section>;
 const validation=validateDeck(active,cards,owned),curve=costCurve(active),familyCounts=families(active),analysis=analyzeDeck(active);
 function save(deck:DeckProfile){setConfirmed(false);setLib(l=>upsertDeck(l,deck))}
 function add(c:CardData){if(active.cardIds.length>=DECK_SIZE||active.cardIds.filter(id=>id===c.id).length>=Math.min(owned[c.id]??0,rarityCopyLimit(c)))return;save({...active,cardIds:[...active.cardIds,c.id]})}
 function remove(id:string){const i=active.cardIds.lastIndexOf(id);if(i<0)return;const next=[...active.cardIds];next.splice(i,1);save({...active,cardIds:next})}
 function make(species:Species){const d=createDeckProfile(species);setLib(l=>upsertDeck(l,d));setActiveId(d.id)}
 function removeDeck(){if(lib.decks.length<=1)return;const next=deleteDeck(lib,active.id);setLib(next);setActiveId(next.decks[0].id)}
 const pool=cards.filter(c=>c.type==='Héros'&&speciesOf(c)===active.species&&Math.min(owned[c.id]??0,rarityCopyLimit(c))>active.cardIds.filter(id=>id===c.id).length&&(family==='Toutes'||c.family===family));
 const preview=[...new Set(active.cardIds)].slice(0,3).map(id=>cards.find(c=>c.id===id)!).filter(Boolean);
 const familyOptions=[...new Set(cards.filter(c=>(owned[c.id]??0)>0&&speciesOf(c)===active.species).map(c=>c.family))];
 return <section className="deck-studio cozy-decks"><div className="deck-studio-head"><h2>Mes decks</h2></div>
 <div className="cozy-deck-preview" aria-label="Aperçu du deck sélectionné">{preview.map(c=><div key={c.id}><GameCard card={c} variant="compact"/></div>)}{!preview.length&&<p>Ton prochain équipage<br/>commence ici.</p>}</div>
 <div className="cozy-deck-caption"><strong>{active.name}</strong><span>{active.species}s · {active.cardIds.length}/{DECK_SIZE} cartes</span></div>
 <div className="deck-library-strip">{[...lib.decks].sort((a,b)=>Number(b.favorite)-Number(a.favorite)||b.updatedAt-a.updatedAt).map(d=><button key={d.id} className={d.id===active.id?'active':''} onClick={()=>setActiveId(d.id)}><strong>{d.name}</strong><span>{d.species}s · {d.cardIds.length}/{DECK_SIZE}</span>{d.favorite&&<small>Favori</small>}</button>)}</div>
 <details className="cozy-deck-options"><summary>Gérer mes decks</summary><div className="deck-create-actions"><button onClick={()=>make('Chat')}>Nouveau deck Chats</button><button onClick={()=>make('Chien')}>Nouveau deck Chiens</button></div><div className="deck-editor-toolbar"><input value={active.name} onChange={e=>save({...active,name:e.target.value.slice(0,28)})} aria-label="Nom du deck"/><span className={`deck-validity ${validation.valid?'valid':'invalid'}`}>{validation.valid?'PRÊT':'INCOMPLET'}</span><button onClick={()=>setLib(l=>toggleFavorite(l,active.id))}>{active.favorite?'Retirer favori':'Définir favori'}</button><button onClick={removeDeck} disabled={lib.decks.length<=1}>Supprimer</button></div></details>
 <div className="deck-analysis-grid"><article><small>Camp</small><strong>{active.species.toUpperCase()}S</strong></article><article><small>Cartes</small><strong>{active.cardIds.length}/{DECK_SIZE}</strong></article><article><small>Coût moyen</small><strong>{active.cardIds.length?(active.cardIds.reduce((s,id)=>s+(cards.find(c=>c.id===id)?.cost??0),0)/active.cardIds.length).toFixed(1):'0.0'}</strong></article><article><small>Archétype</small><strong>{analysis.name}</strong></article></div>
 <details className="deck-strategy"><summary>Analyse et synergies du deck</summary><div className="deck-coherence"><div><small>Cohérence</small><strong>{analysis.score}/100</strong><span className="coherence-track"><i style={{width:`${analysis.score}%`}}/></span></div><div><small>Forces</small>{analysis.strengths.length?analysis.strengths.map(x=><span key={x}>{x}</span>):<span>À construire</span>}</div><div><small>À surveiller</small>{analysis.warnings.length?analysis.warnings.map(x=><span key={x}>{x}</span>):<span>Courbe saine</span>}</div></div>
 <div className="cost-curve" aria-label="Courbe de coût">{curve.map((n,c)=><div key={c}><span style={{height:`${Math.max(8,n*18)}px`}}/><small>{c===6?'6+':c}</small><b>{n}</b></div>)}</div>
 <div className="deck-synergy-preview">{analysis.thresholds.map(x=><span key={x.family}>{x.family} {x.count} · {x.tier}</span>)}{analysis.lore.map(x=><span className="lore-chip" key={x}>Histoire · {x}</span>)}</div></details>
 {validation.issues.length>0&&<div className="deck-issues">{validation.issues.slice(0,4).map(x=><p key={x}>{x}</p>)}</div>}
 <div className="cozy-vault-heading"><h3>Mes cartes</h3><select aria-label="Filtrer par famille" value={family} onChange={e=>{setFamily(e.target.value);setPanel('collection')}}><option value="Toutes">Toutes</option>{familyOptions.map(f=><option key={f}>{f}</option>)}</select></div>
 <div className="deck-mobile-tabs" role="tablist" aria-label="Cartes du deck"><button role="tab" aria-selected={panel==='deck'} onClick={()=>setPanel('deck')}>Deck <b>{active.cardIds.length}/{DECK_SIZE}</b></button><button role="tab" aria-selected={panel==='collection'} onClick={()=>setPanel('collection')}>Collection <b>{pool.length}</b></button></div>
 <section className="deck-card-vault" aria-label={panel==='deck'?active.name:`Cartes ${active.species}s disponibles`}>
  <div className="deck-card-grid">{panel==='deck'?active.cardIds.map((id,i)=>{const c=cards.find(x=>x.id===id);return c?<button className="deck-card-token" key={`${id}-${i}`} onClick={()=>remove(id)} aria-label={`Retirer ${c.name}`}><GameCard card={c} variant="compact"/><span className="deck-token-action">−</span></button>:null}):pool.map(c=><button className="deck-card-token" key={c.id} disabled={active.cardIds.length>=DECK_SIZE} onClick={()=>add(c)} aria-label={`Ajouter ${c.name}`}><GameCard card={c} variant="compact"/><span className="deck-token-action">+</span></button>)}</div>
  {panel==='deck'&&active.cardIds.length===0&&<p className="deck-empty">Choisis Collection puis touche une carte pour l’ajouter.</p>}
  {panel==='collection'&&pool.length===0&&<p className="deck-empty">Aucune carte disponible pour ce filtre.</p>}
 </section>
 <div className="deck-launch"><button className="primary" disabled={!validation.valid} onClick={()=>{saveDeckLibrary(lib);saveActiveDeckId(active.id);onActiveDeckChange(active);setConfirmed(true)}}>Valider le deck</button>{confirmed&&<><p role="status">Deck validé et prêt à jouer.</p><button onClick={onPlay}>Combattre avec ce deck</button></>}</div></section>
}
