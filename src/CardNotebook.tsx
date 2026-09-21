import {useEffect, useId, useRef, useState} from 'react';
import {GameCard} from './GameCard';
import {LobbyIcon} from './LobbyIcon';
import {cards, type CardData} from './data/gameCards';
import {FACTIONS} from './data/factions';
import {LORE_BONDS, speciesOf} from './data/loreSynergies';
import {FAMILY_RULES} from './data/synergies';

type Page = 'aptitudes' | 'talents' | 'histoire';
const pages: {id:Page; label:string}[] = [{id:'aptitudes',label:'Aptitudes'},{id:'talents',label:'Talents'},{id:'histoire',label:'Histoire'}];

/** All content comes from the live catalogue and combat rules, never mockup values. */
export function CardNotebook({card, copies, onClose}:{card:CardData; copies:number; onClose:()=>void}) {
 const [page,setPage] = useState<Page>('aptitudes');
 const dialog = useRef<HTMLDialogElement>(null);
 const uid = useId();
 const clan = FACTIONS[speciesOf(card)];
 const rule = FAMILY_RULES[card.family];
 const bonds = LORE_BONDS.filter(b => b.cardA === card.id || b.cardB === card.id);
 useEffect(() => {
  const previous = document.activeElement as HTMLElement | null;
  const overflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  dialog.current?.showModal();
  return () => {document.body.style.overflow = overflow; previous?.focus();};
 }, []);
 return <dialog ref={dialog} className="card-notebook" aria-label={`Détails de ${card.name}`} onCancel={onClose}>
  <div className="card-notebook-hero"><GameCard card={card} variant="feature" animateArtwork={copies > 0} copies={copies} locked={copies === 0}/></div>
  <div className="card-notebook-paper">
   <header><span>{clan.title} · {card.rarity}</span><h2>{card.name}</h2><small>{copies > 0 ? `${copies} exemplaire${copies > 1 ? 's' : ''} dans ta collection` : 'Cette carte reste à découvrir.'}</small></header>
   <section role="tabpanel" id={`${uid}-panel-${page}`} aria-labelledby={`${uid}-tab-${page}`} tabIndex={0}>
    {page === 'aptitudes' && <>
     <dl className="notebook-stat-row"><div><dt>Coût</dt><dd>{card.cost}</dd></div>{card.atk !== undefined && <div><dt>Attaque</dt><dd>{card.atk}</dd></div>}{card.hp !== undefined && <div><dt>Vie</dt><dd>{card.hp}</dd></div>}</dl>
     <h3>Sa famille</h3><div className="notebook-description"><LobbyIcon name="shield"/><div><strong>{card.family}</strong><p>{card.type}{card.breed ? ` · ${card.breed}` : ''}</p></div></div>
     <h3>À retenir</h3><p className="notebook-paragraph">{card.type === 'Héros' ? 'Les héros de la même famille peuvent activer des synergies à 3 et 5 cartes sur le plateau.' : card.flavor || 'Retrouve cette carte dans ta collection.'}</p>
    </>}
    {page === 'talents' && <>
     <h3>{card.type === 'Héros' ? 'Synergie de famille' : 'Description de la carte'}</h3>
     {card.type === 'Héros' && rule ? <div className="notebook-description"><LobbyIcon name="crown"/><div><strong>{rule[0]}</strong><p>{rule[1]}</p></div></div> : <p className="notebook-paragraph">{card.flavor || 'Aucun talent individuel renseigné.'}</p>}
     {bonds.length > 0 && <><h3>Liens du royaume</h3>{bonds.map(b => <div className="notebook-description" key={b.id}><LobbyIcon name="cards"/><div><strong>{b.title}</strong><p>{b.story}</p><small>Avec {cards.find(c => c.id === (b.cardA === card.id ? b.cardB : b.cardA))?.name}</small></div></div>)}</>}
    </>}
    {page === 'histoire' && <>
     <h3>Son histoire</h3><p className="notebook-paragraph">{card.flavor || 'Son histoire reste à écrire.'}</p>
     <h3>Son clan</h3><div className="notebook-description"><LobbyIcon name="shield"/><div><strong>{clan.title}</strong><p>{clan.motto}</p></div></div>
    </>}
   </section>
  </div>
  <footer className="card-notebook-footer"><div role="tablist" aria-label="Pages de la carte">{pages.map((p,i) => <button key={p.id} type="button" role="tab" id={`${uid}-tab-${p.id}`} aria-controls={`${uid}-panel-${p.id}`} aria-selected={page === p.id} tabIndex={page === p.id ? 0 : -1} onClick={() => setPage(p.id)} onKeyDown={e => {let next = i;if(e.key === 'ArrowRight') next = (i+1)%3;else if(e.key === 'ArrowLeft') next = (i+2)%3;else if(e.key === 'Home') next = 0;else if(e.key === 'End') next = 2;else return;e.preventDefault();setPage(pages[next].id);document.getElementById(`${uid}-tab-${pages[next].id}`)?.focus();}}>{p.label}</button>)}</div><button type="button" className="notebook-dismiss" onClick={onClose} aria-label="Fermer">×</button></footer>
 </dialog>;
}
