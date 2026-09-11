import { useEffect,useMemo,useState } from 'react';
import { cards,type CardData } from './data/gameCards';
import type { OwnedCards } from './data/collection';
import { DECK_SIZE,validateDeck,type SavedDeck } from './data/deck';
import { speciesOf,type Species } from './data/loreSynergies';
import { createDeckProfile,deleteDeck,loadActiveDeckId,loadDeckLibrary,saveActiveDeckId,saveDeckLibrary,toggleFavorite,upsertDeck,type DeckLibrary,type DeckProfile } from './data/deckLibrary';

function costCurve(deck:DeckProfile){const curve=[0,0,0,0,0,0,0];for(const id of deck.cardIds){const c=cards.find(x=>x.id===id);if(c)curve[Math.min(6,c.cost)]++}return curve}
function families(deck:DeckProfile){return deck.cardIds.map(id=>cards.find(c=>c.id===id)?.family).filter(Boolean).reduce<Record<string,number>>((a,f)=>{a[f as string]=(a[f as string]||0)+1;return a},{})}

export function DeckStudio({owned,activeDeck,onActiveDeckChange,onPlay}:{owned:OwnedCards;activeDeck:SavedDeck;onActiveDeckChange:(d:SavedDeck)=>void;onPlay:()=>void}){
 const[lib,setLib]=useState<DeckLibrary>(()=>{const loaded=loadDeckLibrary();if(loaded.decks.length)return loaded;const species=(activeDeck.cardIds[0]&&cards.find(c=>c.id===activeDeck.cardIds[0]))?speciesOf(cards.find(c=>c.id===activeDeck.cardIds[0])!):'Chat';return {version:1,decks:[{...createDeckProfile(species,activeDeck.name),cardIds:activeDeck.cardIds}]}});
 const[activeId,setActiveId]=useState(()=>loadActiveDeckId()||lib.decks[0]?.id||'');
 const active=lib.decks.find(d=>d.id===activeId)??lib.decks[0];
 useEffect(()=>{saveDeckLibrary(lib)},[lib]);
 useEffect(()=>{if(active){saveActiveDeckId(active.id);onActiveDeckChange({version:1,name:active.name,cardIds:active.cardIds,updatedAt:active.updatedAt})}},[active?.id,active?.updatedAt]);
 if(!active)return <section className="deck-studio"><button className="primary" onClick={()=>{const d=createDeckProfile('Chat');setLib({version:1,decks:[d]});setActiveId(d.id)}}>Créer un deck</button></section>;
 const validation=validateDeck(active,cards,owned),curve=costCurve(active),familyCounts=families(active);
 function save(deck:DeckProfile){setLib(l=>upsertDeck(l,deck))}
 function add(c:CardData){if(active.cardIds.length>=DECK_SIZE)return;save({...active,cardIds:[...active.cardIds,c.id]})}
 function remove(id:string){const i=active.cardIds.lastIndexOf(id);if(i<0)return;const next=[...active.cardIds];next.splice(i,1);save({...active,cardIds:next})}
 function make(species:Species){const d=createDeckProfile(species);setLib(l=>upsertDeck(l,d));setActiveId(d.id)}
 function removeDeck(){if(lib.decks.length<=1)return;const next=deleteDeck(lib,active.id);setLib(next);setActiveId(next.decks[0].id)}
 const pool=cards.filter(c=>c.type==='Héros'&&speciesOf(c)===active.species&&(owned[c.id]??0)>active.cardIds.filter(id=>id===c.id).length);
 return <section className="deck-studio"><div className="deck-studio-head"><div><p className="eyebrow">DECKS · ORCHESTRATION</p><h2>Bibliothèque de decks</h2><p>Prépare plusieurs stratégies puis choisis ton deck actif avant la recherche de combat.</p></div><div className="deck-create-actions"><button onClick={()=>make('Chat')}>Nouveau deck Chats</button><button onClick={()=>make('Chien')}>Nouveau deck Chiens</button></div></div>
 <div className="deck-library-strip">{[...lib.decks].sort((a,b)=>Number(b.favorite)-Number(a.favorite)||b.updatedAt-a.updatedAt).map(d=><button key={d.id} className={d.id===active.id?'active':''} onClick={()=>setActiveId(d.id)}><strong>{d.name}</strong><span>{d.species}s · {d.cardIds.length}/{DECK_SIZE}</span>{d.favorite&&<small>Favori</small>}</button>)}</div>
 <div className="deck-editor-toolbar"><input value={active.name} onChange={e=>save({...active,name:e.target.value.slice(0,28)})} aria-label="Nom du deck"/><span className={`deck-validity ${validation.valid?'valid':'invalid'}`}>{validation.valid?'PRÊT':'INCOMPLET'}</span><button onClick={()=>setLib(l=>toggleFavorite(l,active.id))}>{active.favorite?'Retirer favori':'Définir favori'}</button><button onClick={removeDeck} disabled={lib.decks.length<=1}>Supprimer</button></div>
 <div className="deck-analysis-grid"><article><small>Camp</small><strong>{active.species.toUpperCase()}S</strong></article><article><small>Cartes</small><strong>{active.cardIds.length}/{DECK_SIZE}</strong></article><article><small>Coût moyen</small><strong>{active.cardIds.length?(active.cardIds.reduce((s,id)=>s+(cards.find(c=>c.id===id)?.cost??0),0)/active.cardIds.length).toFixed(1):'0.0'}</strong></article><article><small>Famille dominante</small><strong>{Object.entries(familyCounts).sort((a,b)=>b[1]-a[1])[0]?.[0]??'Aucune'}</strong></article></div>
 <div className="cost-curve" aria-label="Courbe de coût">{curve.map((n,c)=><div key={c}><span style={{height:`${Math.max(8,n*18)}px`}}/><small>{c===6?'6+':c}</small><b>{n}</b></div>)}</div>
 <div className="deck-synergy-preview">{Object.entries(familyCounts).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([family,count])=><span key={family}>{family} {count}/{count>=5?5:count>=3?5:3}</span>)}</div>
 {validation.issues.length>0&&<div className="deck-issues">{validation.issues.slice(0,4).map(x=><p key={x}>{x}</p>)}</div>}
 <div className="deck-columns"><div><h3>{active.name}</h3><div className="deck-list">{active.cardIds.map((id,i)=>{const c=cards.find(x=>x.id===id);return c?<button key={`${id}-${i}`} onClick={()=>remove(id)}><span>{c.family} · {c.name}<small className="deck-card-species">{c.rarity} · coût {c.cost}</small></span><span>Retirer</span></button>:null})}</div></div><div><h3>Disponibles · {active.species}s</h3><div className="deck-list">{pool.map(c=><button key={c.id} disabled={active.cardIds.length>=DECK_SIZE} onClick={()=>add(c)}><span>{c.family} · {c.name}<small className="deck-card-species">{c.rarity} · coût {c.cost}</small></span><span>Ajouter</span></button>)}</div></div></div>
 <div className="deck-launch"><button className="primary" disabled={!validation.valid} onClick={onPlay}>Utiliser ce deck et rechercher un combat</button></div></section>
}
