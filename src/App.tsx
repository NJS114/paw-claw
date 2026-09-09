import { useMemo, useState } from 'react';

type Screen = 'home' | 'battle' | 'collection' | 'boosters' | 'deck' | 'shop' | 'profile';

type CardData = {
  name: string;
  family: string;
  rarity: 'Commune' | 'Rare' | 'Épique' | 'Légendaire';
  cost: number;
  atk: number;
  hp: number;
  emoji: string;
};

const cards: CardData[] = [
  { name: 'Apprenti Sorcier', family: 'Magiciens', rarity: 'Commune', cost: 2, atk: 2, hp: 3, emoji: '🐱' },
  { name: 'Lame Nocturne', family: 'Ombres', rarity: 'Rare', cost: 3, atk: 4, hp: 2, emoji: '🐈‍⬛' },
  { name: 'Gardien Sylvestre', family: 'Nature', rarity: 'Épique', cost: 4, atk: 5, hp: 5, emoji: '🐕' },
  { name: 'Roi Karhl', family: 'Nobles', rarity: 'Légendaire', cost: 6, atk: 7, hp: 8, emoji: '👑' },
  { name: 'Unité C-9', family: 'Robots', rarity: 'Rare', cost: 3, atk: 3, hp: 4, emoji: '🤖' },
];

export function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [energy, setEnergy] = useState(5);
  const [playerHp, setPlayerHp] = useState(20);
  const [enemyHp, setEnemyHp] = useState(20);
  const [board, setBoard] = useState<(CardData | null)[]>(Array(7).fill(null));

  const title = useMemo(() => screen.toUpperCase(), [screen]);

  function playCard(card: CardData, index: number) {
    if (energy < card.cost || board[index]) return;
    const next = [...board];
    next[index] = card;
    setBoard(next);
    setEnergy((e) => e - card.cost);
  }

  function endTurn() {
    const damage = board.filter(Boolean).reduce((sum, card) => sum + (card?.atk ?? 0), 0);
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
        {(['home','battle','boosters','collection','deck','shop','profile'] as Screen[]).map((item) => (
          <button key={item} className={screen === item ? 'active' : ''} onClick={() => setScreen(item)}>{item}</button>
        ))}
      </nav>

      <main>
        {screen === 'home' && <Home onPlay={() => setScreen('battle')} onBoosters={() => setScreen('boosters')} />}
        {screen === 'battle' && (
          <Battle
            board={board}
            cards={cards}
            energy={energy}
            playerHp={playerHp}
            enemyHp={enemyHp}
            onPlay={playCard}
            onEndTurn={endTurn}
            onHitPlayer={() => setPlayerHp((hp) => Math.max(0, hp - 2))}
          />
        )}
        {screen !== 'home' && screen !== 'battle' && <Placeholder title={title} />}
      </main>
    </div>
  );
}

function Home({ onPlay, onBoosters }: { onPlay: () => void; onBoosters: () => void }) {
  return (
    <section className="home-hero">
      <div className="hero-copy">
        <p className="eyebrow">COLLECT · BATTLE · BELONG</p>
        <h1>Bienvenue dans l’arène</h1>
        <p>Construis ton deck de chats et chiens, ouvre des boosters et affronte l’IA sur un plateau fantasy en paysage.</p>
        <div className="hero-actions">
          <button className="primary" onClick={onPlay}>Jouer maintenant</button>
          <button onClick={onBoosters}>Ouvrir un booster</button>
        </div>
      </div>
      <div className="hero-characters">
        <div className="mascot cat">🐱</div>
        <div className="vs">VS</div>
        <div className="mascot dog">🐶</div>
      </div>
    </section>
  );
}

function Battle({ board, cards, energy, playerHp, enemyHp, onPlay, onEndTurn, onHitPlayer }: {
  board: (CardData | null)[];
  cards: CardData[];
  energy: number;
  playerHp: number;
  enemyHp: number;
  onPlay: (card: CardData, index: number) => void;
  onEndTurn: () => void;
  onHitPlayer: () => void;
}) {
  return (
    <section className="battle-screen">
      <div className="battle-hud enemy-hud"><span>Rival IA</span><strong>❤️ {enemyHp}</strong></div>
      <div className="enemy-zone">
        {Array.from({ length: 7 }).map((_, i) => <div key={i} className="slot enemy-slot">🐾</div>)}
      </div>
      <div className="arena-center">
        <div className="paw-emblem">🐾</div>
      </div>
      <div className="player-zone">
        {board.map((card, i) => (
          <button key={i} className="slot player-slot" onClick={() => onPlay(cards[i % cards.length], i)}>
            {card ? <MiniCard card={card} /> : <span>🐾</span>}
          </button>
        ))}
      </div>
      <div className="battle-footer">
        <div className="battle-hud"><span>Joueur</span><strong>❤️ {playerHp}</strong><strong>✨ {energy}/5</strong></div>
        <div className="hand">
          {cards.map((card) => <MiniCard key={card.name} card={card} />)}
        </div>
        <div className="turn-actions">
          <button onClick={onHitPlayer}>Test attaque IA</button>
          <button className="primary" onClick={onEndTurn}>Fin du tour</button>
        </div>
      </div>
    </section>
  );
}

function MiniCard({ card }: { card: CardData }) {
  return (
    <article className={`mini-card ${card.rarity.toLowerCase().replace('é','e')}`}>
      <div className="cost">{card.cost}</div>
      <div className="card-art">{card.emoji}</div>
      <strong>{card.name}</strong>
      <small>{card.family}</small>
      <div className="stats"><span>⚔️ {card.atk}</span><span>❤️ {card.hp}</span></div>
    </article>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <section className="placeholder">
      <h2>{title}</h2>
      <p>Écran prêt à recevoir les assets et fonctionnalités Paw & Claw.</p>
      <div className="placeholder-grid">
        {Array.from({ length: 6 }).map((_, i) => <div className="panel" key={i}>🐾</div>)}
      </div>
    </section>
  );
}
