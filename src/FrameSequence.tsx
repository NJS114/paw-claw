import {useEffect, useRef, useState} from 'react';

export type FrameAtlas = {src:string; backgroundSrc?:string; columns:number; rows:number; durations:number[]};
/** Discrete image cells; no interpolated transforms, zooms, or floating sprites. */
export function FrameSequence({atlas, label, fallback}:{atlas:FrameAtlas; label:string; fallback:React.ReactNode}) {
 const root = useRef<HTMLSpanElement>(null);
 const [frame,setFrame] = useState(0);
 const [ready,setReady] = useState(false);
 const [failed,setFailed] = useState(false);
 useEffect(() => {
  let live = true;
  setReady(false);setFailed(false);setFrame(0);
  const sources = [atlas.src, ...(atlas.backgroundSrc ? [atlas.backgroundSrc] : [])];
  let loaded = 0;
  const images = sources.map(src => {
   const image = new Image();
   image.onload = () => {loaded++;if(live && loaded === sources.length)setReady(true);};
   image.onerror = () => {if(live)setFailed(true);};
   image.src = src;
   return image;
  });
  return () => {live = false;images.forEach(image => {image.onload = null;image.onerror = null;});};
 }, [atlas.src,atlas.backgroundSrc]);
 useEffect(() => {
  if(!ready || failed)return;
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const realm = root.current?.closest('[data-motion]');
  let timer:ReturnType<typeof setTimeout> | undefined;
  let current = 0;
  let visible = true;
  const stopped = () => document.hidden || !visible || media.matches || realm?.getAttribute('data-motion') === 'reduced';
  function tick() {
   if(stopped())return;
   timer = setTimeout(() => {current = (current + 1) % atlas.durations.length;setFrame(current);tick();}, atlas.durations[current]);
  }
  function restart() {clearTimeout(timer);current = 0;setFrame(0);if(!stopped())tick();}
  const observer = new MutationObserver(restart);
  if(realm)observer.observe(realm,{attributes:true,attributeFilter:['data-motion']});
  const intersection = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(entries => {visible = entries[0].isIntersecting;restart();}) : null;
  if(root.current)intersection?.observe(root.current);
  media.addEventListener('change',restart);
  document.addEventListener('visibilitychange',restart);
  restart();
  return () => {clearTimeout(timer);observer.disconnect();intersection?.disconnect();media.removeEventListener('change',restart);document.removeEventListener('visibilitychange',restart);};
 }, [atlas,ready,failed]);
 const x = atlas.columns === 1 ? 0 : (frame % atlas.columns) * 100 / (atlas.columns - 1);
 const y = atlas.rows === 1 ? 0 : Math.floor(frame / atlas.columns) * 100 / (atlas.rows - 1);
 return <span ref={root} className="frame-sequence" data-frame={frame}>
  {ready && !failed ? <span className="frame-sequence-cell" role="img" aria-label={label} style={{backgroundImage:`url("${atlas.src}")${atlas.backgroundSrc ? `, url("${atlas.backgroundSrc}")` : ''}`,backgroundSize:`${atlas.columns * 100}% ${atlas.rows * 100}%${atlas.backgroundSrc ? ', 100% 100%' : ''}`,backgroundPosition:`${x}% ${y}%${atlas.backgroundSrc ? ', center' : ''}`}}/> : fallback}
 </span>;
}
