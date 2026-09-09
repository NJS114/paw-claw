import { useEffect, useMemo, useState } from 'react';
import { cards, families, rarities, type CardData } from './data/cards';

type Screen = 'home' | 'battle' | 'boosters' | 'collection' | 'deck' | 'assets' | 'shop' | 'profile';
type AssetManifest = { sourceZip: string; count: number; entries: string[] };

const battleCards = cards.filter((c) => c.type === 'Héros').slice(0, 7);
const generatedBase = '/assets/generated/';

const familySheet: Record<string, string> = {
  Magiciens: 'chatgpt-image-7-sept.-2026-15_03_35.webp',
  Ombres: 'chatgpt-image-7-sept.-2026-15_03_31.webp',
  Nobles: 'chatgpt-image-7-sept.-2026-15_07_01.webp',
  Robots: 'chatgpt-image-7-sept.-2026-15_01_47.webp',
  Nature: 'chatgpt-image-7-sept.-2026-22_07_59.webp',
  Guérisseurs: 'chatgpt-image-7-sept.-2026-15_03_15.webp',
  Créatures: 'chatgpt-image-7-sept.-2026-15_04_45.webp',
  Pirates: 'chatgpt-image-5-sept.-2026-23_17_33.webp',
  Éléments: 'chatgpt-image-7-sept.-2026-15_04_34.webp',
  Armée: 'plateau-salle-du-trone.webp'
};

export function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [energy, setEnergy] = useState(5);
  const [playerHp, setPlayerHp] = useState(20);
  const [enemyHp, setEnemyHp] = useState(20);
  const [board, setBoard] = useState<(CardData | null)[]>(Array(7).fill(null));

  function playCard(card: CardData, index: number) {
    if (card.type !== 'Héros' || energy < card.cost || board[index]) return;
    const next = [...board];
    next[index] = card;
    setBoard(next);
    setEnergy((e) => e - card.cost);
  }

  function endTurn() {
    const damage = board.reduce((sum, card) => sum + (card?.atk ?? 0), 0);
    setEnemyHp((hp) => Math.max(0, hp - damage));
    setEnergy(5);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setScreen('home')}>PAW & CLAW</button>
        <div className="tagline">Différentes âmes. Même arène.</div>
        <div className="currency">🪙 1 240</div>
      </header>

      <nav className="nav-row">
        {(['home','battle','boosters','collection','deck','assets','shop','profile'] as Screen[]).map((item) => (
          <button key={item} className={screen === item ? 'active' : ''} onClick={() => setScreen(item)}>{item}</button>
        ))}
      </nav>

      <main>
        {screen === 'home' && <Home onPlay={() => setScreen('battle')} onBoosters={() => setScreen('boosters')} onCollection={() => setScreen('collection')} />}
        {screen === 'battle' && <Battle board={board} cards={battleCards} energy={energy} playerHp={playerHp} enemyHp={enemyHp} onPlay={playCard} onEndTurn={endTurn} onHitPlayer={() => setPlayerHp((hp) => Math.max(0, hp - 2))} />}
        {screen === 'collection' && <Collection />}
        {screen === 'boosters' && <BoosterRoom />}
        {screen === 'deck' && <DeckBuilder />}
        {screen === 'assets' && <AssetsLibrary />}
        {(screen === 'shop' || screen === 'profile') && <Placeholder title={screen.toUpperCase()} />}
      </main>
    </div>
  );
}

function Home({ onPlay, onBoosters, onCollection }: { onPlay: () => void; onBoosters: () => void; onCollection: () => void }) {
  return (
    <section className="home-hero">
      <div className="hero-copy">
        <p className="eyebrow">COLLECT · BATTLE · BELONG</p>
        <h1>Bienvenue dans l’arène</h1>
        <p>Construis ton deck, ouvre des boosters et retrouve toutes les illustrations générées dans une bibliothèque unique.</p>
        <div className="hero-actions">
          <button className="primary" onClick={onPlay}>Jouer maintenant</button>
          <button onClick={onBoosters}>Ouvrir un booster</button>
          <button onClick={onCollection}>Voir les cartes</button>
        </div>
      </div>
      <div className="home-visual"><img src={`${generatedBase}heros-duo.webp`} alt="Héros Paw & Claw" /></div>
    </section>
  );
}

function Collection() {
  const [family, setFamily] = useState<(typeof families)[number]>('Tous');
  const [rarity, setRarity] = useState<(typeof rarities)[number]>('Toutes');
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => cards.filter((card) =>
    (family === 'Tous' || card.family === family) &&
    (rarity === 'Toutes' || card.rarity === rarity) &&
    card.name.toLowerCase().includes(query.toLowerCase())
  ), [family, rarity, query]);

  return (
    <section className="collection-screen">
      <div className="collection-head">
        <div><p className="eyebrow">BIBLIOTHÈQUE</p><h2>Collection Paw & Claw</h2><p>{cards.length} cartes déjà classifiées.</p></div>
        <input className="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher une carte…" />
      </div>
      <div className="family-strip">
        {families.slice(1).map((name) => <button key={name} onClick={() => setFamily(name)} className={family === name ? 'active' : ''}>{name}<span>{cards.filter(c => c.family === name).length}</span></button>)}
      </div>
      <div className="filter-row">
        <button className={family === 'Tous' ? 'active' : ''} onClick={() => setFamily('Tous')}>Toutes les familles</button>
        {rarities.map((r) => <button key={r} className={rarity === r ? 'active' : ''} onClick={() => setRarity(r)}>{r}</button>)}
        <strong>{filtered.length} résultat{filtered.length > 1 ? 's' : ''}</strong>
      </div>
      <div className="collection-grid">{filtered.map((card) => <CatalogCard key={card.id} card={card} />)}</div>
    </section>
  );
}

function CatalogCard({ card }: { card: CardData }) {
  const fallback = familySheet[card.family] ? `${generatedBase}${familySheet[card.family]}` : `${generatedBase}carte-bleue.webp`;
  const [src, setSrc] = useState(card.assetPath ?? fallback);
  return (
    <article className={`catalog-card ${rarityClass(card.rarity)}`}>
      <div className="catalog-art">
        <img src={src} alt={card.name} onError={() => src !== fallback && setSrc(fallback)} />
        <span className="catalog-cost">{card.cost}</span><span className="catalog-family">{familyIcon(card.family)}</span>
      </div>
      <div className="catalog-body"><div className="rarity-line"><span>{card.rarity}</span><span>{card.type}</span></div><h3>{card.name}</h3><p>{card.flavor ?? card.family}</p>{card.type === 'Héros' && <div className="stats"><span>⚔️ {card.atk}</span><span>❤️ {card.hp}</span></div>}<small className="source-sheet">{card.family}</small></div>
    </article>
  );
}

function AssetsLibrary() {
  const [manifest, setManifest] = useState<AssetManifest | null>(null);
  const [query, setQuery] = useState('');
  useEffect(() => { fetch(`${generatedBase}manifest.json`).then(r => r.json()).then(setManifest).catch(() => setManifest(null)); }, []);
  const entries = (manifest?.entries ?? []).filter((name) => name.toLowerCase().includes(query.toLowerCase()));
  return <section className="collection-screen"><div className="collection-head"><div><p className="eyebrow">ASSETS GÉNÉRÉS</p><h2>Bibliothèque visuelle</h2><p>{manifest ? `${manifest.count} images extraites automatiquement du ZIP.` : 'Les assets seront extraits automatiquement au lancement/build.'}</p></div><input className="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Filtrer les images…" /></div><div className="asset-grid">{entries.map(name => <article className="asset-tile" key={name}><img src={`${generatedBase}${name}`} alt={name} loading="lazy"/><small>{name}</small></article>)}</div></section>;
}

function BoosterRoom() {
  const [opened, setOpened] = useState<CardData[]>([]);
  function openPack() {
    const commons = shuffle(cards.filter(c => c.rarity === 'Commune')).slice(0, 8);
    const rares = shuffle(cards.filter(c => c.rarity === 'Rare')).slice(0, 3);
    const premiumPool = cards.filter(c => c.rarity === 'Épique' || c.rarity === 'Légendaire');
    setOpened([...commons, ...rares, ...shuffle(premiumPool).slice(0, 1)]);
  }
  return <section className="booster-screen"><div className="booster-pack visual-pack"><img src={`${generatedBase}booster-violet.webp`} alt="Booster Paw & Claw"/><button className="primary" onClick={openPack}>{opened.length ? 'Ouvrir un autre booster' : 'Ouvrir le booster'}</button></div>{opened.length > 0 && <div className="booster-results">{opened.map((card, i) => <CatalogCard key={`${card.id}-${i}`} card={card} />)}</div>}</section>;
}

function DeckBuilder() {
  const [deck, setDeck] = useState<string[]>(cards.filter(c => c.type === 'Héros').slice(0, 12).map(c => c.id));
  const deckCards = deck.map(id => cards.find(c => c.id === id)).filter(Boolean) as CardData[];
  const available = cards.filter(c => c.type === 'Héros' && !deck.includes(c.id));
  return <section className="deck-screen"><div className="collection-head"><div><p className="eyebrow">DECK BUILDER</p><h2>Mon deck</h2><p>{deck.length}/20 cartes</p></div></div><div className="deck-columns"><div><h3>Deck actuel</h3><div className="deck-list">{deckCards.map(c => <button key={c.id} onClick={() => setDeck(d => d.filter(id => id !== c.id))}><span>{familyIcon(c.family)} {c.name}</span><span>{c.cost} ✨ · {c.rarity}</span></button>)}</div></div><div><h3>Cartes disponibles</h3><div className="deck-list">{available.slice(0, 40).map(c => <button key={c.id} disabled={deck.length >= 20} onClick={() => setDeck(d => [...d, c.id])}><span>{familyIcon(c.family)} {c.name}</span><span>Ajouter +</span></button>)}</div></div></div></section>;
}

function Battle({ board, cards: handCards, energy, playerHp, enemyHp, onPlay, onEndTurn, onHitPlayer }: { board: (CardData | null)[]; cards: CardData[]; energy: number; playerHp: number; enemyHp: number; onPlay: (card: CardData, index: number) => void; onEndTurn: () => void; onHitPlayer: () => void; }) {
  return <section className="battle-screen" style={{backgroundImage:`linear-gradient(rgba(4,10,24,.2),rgba(4,10,24,.28)),url('${generatedBase}chatgpt-image-6-sept.-2026-01_35_40.webp')`}}><div className="battle-hud enemy-hud"><span>Rival IA</span><strong>❤️ {enemyHp}</strong></div><div className="enemy-zone">{Array.from({ length: 7 }).map((_, i) => <div key={i} className="slot enemy-slot">🐾</div>)}</div><div className="arena-center"><div className="paw-emblem">🐾</div></div><div className="player-zone">{board.map((card, i) => <button key={i} className="slot player-slot" onClick={() => onPlay(handCards[i % handCards.length], i)}>{card ? <MiniCard card={card} /> : <span>🐾</span>}</button>)}</div><div className="battle-footer"><div className="battle-hud"><span>Joueur</span><strong>❤️ {playerHp}</strong><strong>✨ {energy}/5</strong></div><div className="hand">{handCards.slice(0,5).map((card) => <MiniCard key={card.id} card={card} />)}</div><div className="turn-actions"><button onClick={onHitPlayer}>Test attaque IA</button><button className="primary" onClick={onEndTurn}>Fin du tour</button></div></div></section>;
}

function MiniCard({ card }: { card: CardData }) { const art = familySheet[card.family]; return <article className={`mini-card ${rarityClass(card.rarity)}`}><div className="cost">{card.cost}</div><div className="card-art">{art ? <img src={`${generatedBase}${art}`} alt=""/> : familyIcon(card.family)}</div><strong>{card.name}</strong><small>{card.family}</small><div className="stats"><span>⚔️ {card.atk ?? '-'}</span><span>❤️ {card.hp ?? '-'}</span></div></article>; }
function Placeholder({ title }: { title: string }) { return <section className="placeholder"><h2>{title}</h2><p>Écran prêt pour la prochaine passe Paw & Claw.</p><div className="placeholder-grid">{Array.from({ length: 6 }).map((_, i) => <div className="panel" key={i}>🐾</div>)}</div></section>; }
function rarityClass(rarity: string) { return rarity.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
function shuffle<T>(input: T[]) { return [...input].sort(() => Math.random() - .5); }
function familyIcon(family: string) { return ({Armée:'🛡️',Magiciens:'🌀',Nobles:'👑',Ombres:'🌘',Robots:'⚙️',Nature:'🍃',Éléments:'🔥',Guérisseurs:'✚',Pirates:'☠️',Créatures:'✦'} as Record<string,string>)[family] ?? '🐾'; }
