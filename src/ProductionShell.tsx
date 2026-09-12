import { useEffect,useState } from 'react';
import { App } from './App';
import { Stories } from './Stories';
import { GameStartup } from './GameStartup';
import { loadLocale,saveLocale,type Locale } from './i18n';

export function ProductionShell(){
 const[locale,setLocale]=useState<Locale>(()=>loadLocale());
 const[stories,setStories]=useState(false);
 useEffect(()=>{saveLocale(locale);document.documentElement.lang=locale},[locale]);
 return <div className="production-shell"><div className="production-tools" aria-label={locale==='fr'?'Navigation secondaire':'Secondary navigation'}><button className={stories?'active':''} onClick={()=>setStories(v=>!v)}>{locale==='fr'?'Histoires':'Stories'}</button><div className="locale-switch" aria-label={locale==='fr'?'Langue':'Language'}><button className={locale==='fr'?'active':''} onClick={()=>setLocale('fr')}>FR</button><button className={locale==='en'?'active':''} onClick={()=>setLocale('en')}>EN</button></div></div>{stories?<Stories locale={locale}/>:<GameStartup><App/></GameStartup>}</div>
}
