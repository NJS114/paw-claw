import { useEffect, useMemo, useRef, useState } from 'react';
import { cards, families, rarities, type CardData } from './data/gameCards';
import { ownedCount, type OwnedCards } from './data/collection';
import { GameCard } from './GameCard';

type Sort = 'catalogue' | 'name' | 'cost' | 'rarity';
const rarityRank = ['Commune', 'Rare', 'Épique', 'Légendaire'];
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr').trim();

export function Collection({ owned }: { owned: OwnedCards }) {
  const [family, setFamily] = useState('Tous');
  const [rarity, setRarity] = useState('Toutes');
  const [query, setQuery] = useState('');
  const [ownership, setOwnership] = useState<'all' | 'owned' | 'missing'>('all');
  const [sort, setSort] = useState<Sort>('catalogue');
  const [selected, setSelected] = useState<CardData | null>(null);
  const filtered = useMemo(() => {
    const result = cards.filter(card =>
      (family === 'Tous' || card.family === family) &&
      (rarity === 'Toutes' || card.rarity === rarity) &&
      normalize(card.name).includes(normalize(query)) &&
      (ownership === 'all' || (ownership === 'owned' ? (owned[card.id] ?? 0) > 0 : (owned[card.id] ?? 0) === 0)));
    const byName = (a: CardData, b: CardData) => a.name.localeCompare(b.name, 'fr');
    if (sort === 'name') result.sort(byName);
    if (sort === 'cost') result.sort((a, b) => a.cost - b.cost || byName(a, b));
    if (sort === 'rarity') result.sort((a, b) => rarityRank.indexOf(b.rarity) - rarityRank.indexOf(a.rarity) || byName(a, b));
    return result;
  }, [family, rarity, query, ownership, owned, sort]);
  const discovered = cards.filter(card => (owned[card.id] ?? 0) > 0).length;
  const legendary = cards.filter(card => card.rarity === 'Légendaire' && (owned[card.id] ?? 0) > 0).length;
  const hasFilters = family !== 'Tous' || rarity !== 'Toutes' || query !== '' || ownership !== 'all';
  function reset() { setFamily('Tous'); setRarity('Toutes'); setQuery(''); setOwnership('all'); }

  return <section className="collection-screen">
    <div className="collection-head">
      <div><p className="eyebrow">GRIMOIRE ROYAL</p><h2>Galerie royale</h2></div>
      <div className="collection-progress"><span><b>{discovered}</b>/{cards.length} découvertes</span><i><b style={{ width: `${discovered / cards.length * 100}%` }} /></i><small>{legendary} légendaires · {ownedCount(owned)} cartes</small></div>
      <input className="search" value={query} onChange={event => setQuery(event.target.value)} aria-label="Rechercher une carte" placeholder="Rechercher…" />
    </div>
    <div className="family-strip" aria-label="Familles de cartes">
      <button onClick={() => setFamily('Tous')} aria-pressed={family === 'Tous'} className={family === 'Tous' ? 'active' : ''}>Toutes</button>
      {families.slice(1).map(name => <button key={name} onClick={() => setFamily(name)} aria-pressed={family === name} className={family === name ? 'active' : ''}>{name}<span>{cards.filter(card => card.family === name).length}</span></button>)}
    </div>
    <div className="filter-row" aria-label="Filtres de collection">
      {rarities.map(value => <button key={value} aria-pressed={rarity === value} className={rarity === value ? 'active' : ''} onClick={() => setRarity(value)}>{value}</button>)}
      <button aria-pressed={ownership === 'owned'} className={ownership === 'owned' ? 'active' : ''} onClick={() => setOwnership(ownership === 'owned' ? 'all' : 'owned')}>Possédées</button>
      <button aria-pressed={ownership === 'missing'} className={ownership === 'missing' ? 'active' : ''} onClick={() => setOwnership(ownership === 'missing' ? 'all' : 'missing')}>Manquantes</button>
    </div>
    <div className="collection-toolbar">
      <p role="status">{filtered.length} carte{filtered.length > 1 ? 's' : ''} affichée{filtered.length > 1 ? 's' : ''}</p>
      <label>Trier par <select value={sort} onChange={event => setSort(event.target.value as Sort)}>
        <option value="catalogue">Catalogue</option><option value="name">Nom</option><option value="cost">Coût croissant</option><option value="rarity">Rareté décroissante</option>
      </select></label>
      {hasFilters && <button onClick={reset}>Réinitialiser les filtres</button>}
    </div>
    {filtered.length === 0 ? <div className="collection-empty"><h3>Aucune carte trouvée</h3><p>Essaie une autre recherche ou élargis tes filtres.</p><button onClick={reset}>Afficher toutes les cartes</button></div> :
      <div className="collection-grid">{filtered.map(card => <article className="catalog-card game-card-host" key={card.id}><button className="catalog-card-button" onClick={() => setSelected(card)} aria-label={`Voir ${card.name}`}><GameCard card={card} variant="standard" copies={owned[card.id] ?? 0} locked={(owned[card.id] ?? 0) === 0} /></button></article>)}</div>}
    {selected && <CardDetails card={selected} copies={owned[selected.id] ?? 0} onClose={() => setSelected(null)} />}
  </section>;
}

function CardDetails({ card, copies, onClose }: { card: CardData; copies: number; onClose: () => void }) {
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    const back = (event: Event) => { event.preventDefault(); onClose(); };
    window.addEventListener('paw-back', back);
    return () => { window.removeEventListener('paw-back', back); document.body.style.overflow = previousOverflow; trigger?.focus(); };
  }, []);
  return <div className="collection-modal-backdrop" onClick={event => { if (event.target === event.currentTarget) onClose(); }} onKeyDown={event => {
    if (event.key === 'Escape') { event.stopPropagation(); onClose(); }
    // The close button is the sheet's only interactive element.
    if (event.key === 'Tab') { event.preventDefault(); closeButton.current?.focus(); }
  }}>
    <div className="collection-card-sheet" role="dialog" aria-modal="true" aria-label={`Détails de ${card.name}`}>
      <button ref={closeButton} className="card-sheet-close" onClick={onClose} aria-label="Fermer">×</button>
      <div className="card-sheet-feature"><GameCard card={card} variant="feature" copies={copies} locked={copies === 0} /></div>
      <div className="card-sheet-copy"><span>{card.family} · {card.rarity} · {card.type}</span><h3>{card.name}</h3><p>{copies > 0 ? (card.flavor ?? 'Carte de la collection royale.') : 'Cette carte reste à découvrir.'}</p><small>Possédée ×{copies}</small></div>
    </div>
  </div>;
}
