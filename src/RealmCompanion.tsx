import {useEffect, useRef, useState} from 'react';
import {GameAsset} from './GameAsset';
import {LobbyIcon} from './LobbyIcon';
import {DECK_SIZE} from './data/deck';
import {FACTIONS} from './data/factions';
import type {Species} from './data/loreSynergies';
import {loadBattleHistory} from './data/battleSession';

export type MotionMode = 'system' | 'reduced';
const MOTION_KEY = 'paw-claw.motion.v1';
export function loadMotion(): MotionMode {
 try {return localStorage.getItem(MOTION_KEY) === 'reduced' ? 'reduced' : 'system';} catch {return 'system';}
}
export function saveMotion(value: MotionMode) {try {localStorage.setItem(MOTION_KEY, value);} catch {}}
type Page = 'guide' | 'factions' | 'history' | 'settings';
const titles: Record<Page, string> = {guide: 'À toi de jouer', factions: 'Deux clans, mille aventures', history: 'Tes petites légendes', settings: 'À ta façon'};

export function RealmCompanion({motion, onMotion, onClose}: {motion: MotionMode; onMotion: (v: MotionMode) => void; onClose: () => void}) {
 const [page, setPage] = useState<Page>('guide');
 const [step, setStep] = useState(0);
 const [banner, setBanner] = useState<Species>(() => {try {return localStorage.getItem('paw-claw.banner.v1') === 'Chien' ? 'Chien' : 'Chat';} catch {return 'Chat';}});
 const dialog = useRef<HTMLDialogElement>(null);
 const [history] = useState(loadBattleHistory);
 useEffect(() => {dialog.current?.showModal();}, []);
 const lessons = [
  {title: 'Une équipe à ton image', text: `Choisis ${DECK_SIZE} cartes des Moustaches ou des Truffes. Associe plusieurs héros de la même famille pour déclencher leurs synergies.`, icon: 'cards' as const},
  {title: 'Une patte d’avance', text: 'Avant le duel, remplace jusqu’à 2 cartes. Ta main peut contenir 5 cartes : garde de quoi préparer ton prochain tour.', icon: 'gift' as const},
  {title: 'Trouve la bonne place', text: 'Touche une carte, puis une des 7 lignes. Son coût est retiré de ton énergie. Les héros face à face se défient au combat.', icon: 'shield' as const},
  {title: 'Fais briller ton équipe', text: 'Termine ton tour pour laisser agir le rival. Amène ses PV à zéro. Pioche vide : attention à la fatigue ! À 40 tours, le duel se termine à égalité.', icon: 'crown' as const},
 ];
 function choose(species: Species) {setBanner(species);try {localStorage.setItem('paw-claw.banner.v1', species);} catch {}}
 return <dialog className="realm-notebook" ref={dialog} aria-labelledby="notebook-title" onCancel={onClose} onClose={onClose}>
  <header><span className="realm-kicker">LE CARNET DES PATTES</span><button className="realm-close" onClick={onClose} aria-label="Fermer le carnet">×</button></header>
  <nav aria-label="Pages du carnet">{(['guide','factions','history','settings'] as Page[]).map(p => <button key={p} aria-pressed={page === p} onClick={() => setPage(p)}>{({guide:'Guide',factions:'Clans',history:'Duels',settings:'Réglages'})[p]}</button>)}</nav>
  <section className="notebook-page" key={page}>
   <h2 id="notebook-title">{titles[page]}</h2>
   {page === 'guide' && <>
    <div className="guide-mascot"><GameAsset assetId="lobby.hero-cat" decorative/><span className="guide-bubble">On joue ?</span></div>
    <div className="realm-lesson" key={step}><LobbyIcon name={lessons[step].icon}/><span className="realm-kicker">{step + 1} / {lessons.length}</span><h3>{lessons[step].title}</h3><p>{lessons[step].text}</p></div>
    <div className="guide-controls"><button onClick={() => setStep(s => s - 1)} disabled={step === 0}>Précédent</button><button className="realm-pill" onClick={() => step < lessons.length - 1 ? setStep(s => s + 1) : onClose()}>{step < lessons.length - 1 ? 'Suivant' : 'À moi de jouer !'}<PawMark/></button></div>
   </>}
   {page === 'factions' && <><p>Choisis ta bannière préférée.</p><div className="realm-factions">{(['Chat','Chien'] as Species[]).map(species => <button className="realm-faction" key={species} aria-pressed={banner === species} onClick={() => choose(species)}><GameAsset assetId={FACTIONS[species].hero} decorative/><strong>{FACTIONS[species].title}</strong><small>{FACTIONS[species].motto}</small><span>{banner === species ? 'Ma bannière' : 'Choisir'}</span></button>)}</div><p className="realm-note">Ta bannière personnalise ce carnet. Ton camp en combat dépend du deck choisi.</p></>}
   {page === 'history' && (history.length ? <div className="realm-history">{history.map(match => <details key={match.id}><summary><span className={`result-dot ${match.result}`}><PawMark/></span><span><strong>{match.result === 'win' ? 'Belle victoire !' : match.result === 'lose' ? 'La revanche approche' : 'Patte à patte'}</strong><small>{new Date(match.endedAt).toLocaleDateString('fr-FR')} · {match.turns} tours</small></span><span>›</span></summary><p>{match.stats.cardsPlayed} cartes jouées · {match.stats.damageDealt} dégâts · {match.stats.synergyActivations} synergies</p></details>)}</div> : <div className="realm-empty"><GameAsset assetId={FACTIONS[banner].hero} decorative/><h3>Ta première légende t’attend.</h3><p>Les duels terminés apparaîtront ici.</p><button className="realm-pill" onClick={onClose}>Retour au jeu <PawMark/></button></div>)}
   {page === 'settings' && <><div className="realm-motion-demo"><PawMark/><span>Un peu de magie, à ton rythme.</span></div><label className="realm-setting"><span><strong>Animations réduites</strong><small>Affiche une image fixe à la place des séquences animées.</small></span><input type="checkbox" checked={motion === 'reduced'} onChange={e => onMotion(e.target.checked ? 'reduced' : 'system')}/></label><p className="realm-note">Le réglage de mouvement réduit de ton appareil est également respecté.</p></>}
  </section>
 </dialog>;
}

export function PawMark() {
 return <svg className="realm-paw" viewBox="0 0 32 32" aria-hidden="true"><ellipse cx="7" cy="11" rx="3.1" ry="4.2" transform="rotate(-25 7 11)"/><ellipse cx="13" cy="6" rx="3" ry="4"/><ellipse cx="21" cy="7" rx="3" ry="4" transform="rotate(15 21 7)"/><ellipse cx="27" cy="13" rx="3" ry="4" transform="rotate(30 27 13)"/><path d="M7 24c0-5 5-11 10-11s10 7 10 11-5 4-10 2c-5 2-10 2-10-2Z"/></svg>;
}
