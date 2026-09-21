import { useEffect,useState } from 'react';
import { App } from './App';
import { Stories } from './Stories';
import { GameStartup } from './GameStartup';
import { loadLocale,saveLocale,type Locale } from './i18n';
import {RealmCompanion, loadMotion, saveMotion, type MotionMode} from './RealmCompanion';
import {LobbyIcon} from './LobbyIcon';

export function ProductionShell(){
 const[locale,setLocale]=useState<Locale>(()=>loadLocale());
 const[stories,setStories]=useState(false);
 const[notebook,setNotebook]=useState(false);
 const[motion,setMotion]=useState<MotionMode>(loadMotion);
 useEffect(()=>saveMotion(motion),[motion]);
 useEffect(()=>{saveLocale(locale);document.documentElement.lang=locale},[locale]);
 return <div className="production-shell playful-realm" data-motion={motion}><button className="realm-notebook-launch" onClick={()=>setNotebook(true)} aria-label="Ouvrir le carnet des pattes"><LobbyIcon name="scroll"/><span>Carnet</span></button>{notebook&&<RealmCompanion motion={motion} onMotion={setMotion} onClose={()=>setNotebook(false)}/>}<details className="production-tools"><summary aria-label={locale==='fr'?'Options du jeu':'Game options'}><LobbyIcon name="settings"/></summary><div className="production-tools-panel"><button className={stories?'active':''} onClick={()=>setStories(v=>!v)}>{stories?(locale==='fr'?'Retour au jeu':'Back to game'):(locale==='fr'?'Histoires':'Stories')}</button><div className="locale-switch" aria-label={locale==='fr'?'Langue':'Language'}><button className={locale==='fr'?'active':''} onClick={()=>setLocale('fr')}>FR</button><button className={locale==='en'?'active':''} onClick={()=>setLocale('en')}>EN</button></div></div></details>{stories?<Stories locale={locale}/>:<GameStartup><App/></GameStartup>}</div>
}
