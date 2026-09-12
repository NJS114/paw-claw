import {useEffect,useState,type ReactNode} from 'react';
import {GameAsset} from './GameAsset';

const FIRST_LOAD_MS=1250;

export function GameStartup({children}:{children:ReactNode}){
 const[ready,setReady]=useState(()=>sessionStorage.getItem('pawclaw:booted')==='1');
 useEffect(()=>{if(ready)return;const id=window.setTimeout(()=>{sessionStorage.setItem('pawclaw:booted','1');setReady(true)},FIRST_LOAD_MS);return()=>window.clearTimeout(id)},[ready]);
 if(ready)return <>{children}</>;
 return <section className="game-startup" aria-label="Chargement de Paw & Claw" aria-live="polite">
   <GameAsset assetId="loading.portal" className="game-startup-bg" decorative loading="eager"/>
   <div className="game-startup-vignette"/>
   <div className="game-startup-content">
    <div className="game-startup-mark" aria-hidden="true"><span className="paw-dot paw-a"/><span className="paw-dot paw-b"/><span className="paw-dot paw-c"/><span className="paw-dot paw-d"/><span className="paw-pad"/></div>
    <h1>PAW &amp; CLAW</h1><p>Un même royaume. Mille destins.</p>
    <div className="game-loading-track" aria-hidden="true"><span/></div><small>Chargement du royaume…</small>
   </div>
 </section>
}
