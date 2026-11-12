import { useEffect, useState } from 'react';
import { App } from './App';
import { Stories } from './Stories';
import { GameStartup } from './GameStartup';
import { CozyIcon } from './CozyUi';
import { GameSettings, KingdomGuide, SaveWarning } from './GameSettings';
import { gameStorage } from './data/storage';
import { tactileFeedback } from './native';

export function ProductionShell() {
  const [settings, setSettings] = useState(false);
  const [stories, setStories] = useState(false);
  const [guide, setGuide] = useState(() => gameStorage.getItem('paw-claw.guide.v1') !== 'seen');
  useEffect(() => {
    document.documentElement.lang = 'fr';
    document.documentElement.dataset.motion = gameStorage.getItem('paw-claw.motion') === 'reduced' ? 'reduced' : 'full';
    const click = (event: MouseEvent) => { if ((event.target as HTMLElement).closest('button:not(:disabled)')) tactileFeedback(); };
    const openStories=()=>setStories(true);window.addEventListener('paw-stories',openStories);
    document.addEventListener('click', click);
    return () => {document.removeEventListener('click', click);window.removeEventListener('paw-stories',openStories)};
  }, []);
  function closeGuide() { gameStorage.setItem('paw-claw.guide.v1', 'seen'); setGuide(false); }
  return <div className="production-shell">
    <GameStartup>{stories ? <><button className="stories-return" onClick={() => setStories(false)}>Retour au royaume</button><Stories locale="fr" /></> : <App />}
      <button className="kingdom-settings" aria-label="Réglages du jeu" onClick={() => setSettings(true)}><CozyIcon name="settings" /></button>
      {settings && <GameSettings onClose={() => setSettings(false)} onGuide={() => { setSettings(false); setGuide(true); }} onStories={() => { setSettings(false); setStories(true); }} />}
      {guide && <KingdomGuide onClose={closeGuide} />}
    </GameStartup><SaveWarning />
  </div>;
}
