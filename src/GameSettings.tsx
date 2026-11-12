import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { GameDialog } from './GameDialog';
import { gameStorage, flushNativeSave, saveError } from './data/storage';

export function GameSettings({ onClose, onGuide, onStories }: { onClose: () => void; onGuide: () => void; onStories: () => void }) {
  const [haptics, setHaptics] = useState(() => gameStorage.getItem('paw-claw.haptics') !== 'off');
  const [reduced, setReduced] = useState(() => gameStorage.getItem('paw-claw.motion') === 'reduced');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  return <GameDialog title="Réglages du royaume" onClose={onClose}>
    <p className="settings-edition">PAW & CLAW · AVENTURE SOLO</p>
    <label className="game-setting-row"><span>Vibrations tactiles<small>Retour léger sur les actions du jeu</small></span><input type="checkbox" checked={haptics} onChange={event => { setHaptics(event.target.checked); gameStorage.setItem('paw-claw.haptics', event.target.checked ? 'on' : 'off'); }} /></label>
    <label className="game-setting-row"><span>Animations réduites<small>Limite les mouvements et les transitions</small></span><input type="checkbox" checked={reduced} onChange={event => { const value = event.target.checked; setReduced(value); gameStorage.setItem('paw-claw.motion', value ? 'reduced' : 'full'); document.documentElement.dataset.motion = value ? 'reduced' : 'full'; window.dispatchEvent(new Event('paw-motion')); }} /></label>
    <button className="primary" onClick={onGuide}>Revoir le guide du royaume</button><button onClick={onStories}>Histoires des héros</button>
    <button disabled={saving} onClick={async () => { setSaving(true); try { await flushNativeSave(); setMessage(Capacitor.isNativePlatform() ? 'Progression enregistrée sur cet appareil.' : 'Progression conservée dans ce navigateur.'); } catch { setMessage(saveError() ?? 'Échec de sauvegarde.'); } finally { setSaving(false); } }}>Vérifier la sauvegarde</button>
    <p role="status">{message}</p><p className="settings-footnote">{Capacitor.isNativePlatform() ? 'Sauvegarde locale sur cet appareil.' : 'Aperçu navigateur : les données restent dans ce navigateur.'} La synchronisation entre appareils n’est pas disponible. Désinstaller l’application peut effacer ta progression.</p>
  </GameDialog>;
}

export function KingdomGuide({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const pages = [
    { title: 'Bienvenue au royaume', art: '/assets/layered-home/cat.webp', text: 'Ton premier deck de 20 cartes est prêt. Choisis tes héros, puis mène ton équipe de chats contre les chiens du royaume.' },
    { title: 'Sept lignes, un duel', art: '/assets/layered-home/dog.webp', text: 'Touche une carte de ta main, puis une ligne libre. Dépense ton énergie et termine le tour : les unités face à face combattent ensemble. Une ligne sans rival frappe directement son héros.' },
    { title: 'Fais grandir ton équipe', art: '/assets/boosters/booster-royal-legends-v2.webp', text: 'Les combats terminés donnent des pièces et de l’XP. Ouvre tes boosters, améliore tes decks et récupère les récompenses de missions. Ton aventure solo fonctionne hors ligne.' },
  ];
  const page = pages[step];
  return <GameDialog title={page.title} onClose={onClose}>
    <div className="kingdom-guide-art"><img src={page.art} alt="" /></div><p className="kingdom-guide-copy">{page.text}</p>
    <div className="guide-steps" aria-label={`Étape ${step + 1} sur 3`}>{pages.map((_, index) => <span key={index} className={index === step ? 'active' : ''} />)}</div>
    {step > 0 && <button onClick={() => setStep(step - 1)}>Précédent</button>}
    <button className="primary" onClick={() => step < 2 ? setStep(step + 1) : onClose()}>{step < 2 ? 'Continuer' : 'Entrer dans le royaume'}</button>
  </GameDialog>;
}

export function SaveWarning() {
  const [message, setMessage] = useState(saveError);
  useEffect(() => { const update = () => setMessage(saveError()); window.addEventListener('paw-save-error', update); return () => window.removeEventListener('paw-save-error', update); }, []);
  return message ? <div className="save-warning" role="alert">{message}</div> : null;
}
