import { useEffect,useRef,useState } from 'react';

export function BattleDeckHud({playerDeck,enemyDeck,playerHand,enemyHand}:{playerDeck:number;enemyDeck:number;playerHand:number;enemyHand:number}){
 const prevPlayer=useRef(playerDeck),prevEnemy=useRef(enemyDeck);
 const[pulse,setPulse]=useState<'player'|'enemy'|null>(null);
 useEffect(()=>{let side:'player'|'enemy'|null=null;if(playerDeck<prevPlayer.current)side='player';else if(enemyDeck<prevEnemy.current)side='enemy';prevPlayer.current=playerDeck;prevEnemy.current=enemyDeck;if(side){setPulse(side);const id=window.setTimeout(()=>setPulse(null),650);return()=>window.clearTimeout(id)}},[playerDeck,enemyDeck]);
 return <div className="battle-deck-hud" aria-label="État des pioches">
  <div className={`deck-zone enemy ${pulse==='enemy'?'drawing':''}`}><div className="hidden-hand" aria-label={`${enemyHand} cartes dans la main adverse`}>{Array.from({length:Math.min(enemyHand,5)}).map((_,i)=><span key={i} className="card-back" style={{'--i':i} as React.CSSProperties}/>)}</div><DeckStack count={enemyDeck} label="Pioche adverse"/></div>
  <div className={`deck-zone player ${pulse==='player'?'drawing':''}`}><DeckStack count={playerDeck} label="Ta pioche"/><div className="hand-counter"><small>Main</small><strong>{playerHand}/5</strong></div></div>
 </div>
}
function DeckStack({count,label}:{count:number;label:string}){return <div className={`deck-stack ${count===0?'empty':''}`} aria-label={`${label} : ${count} cartes`}><span/><span/><span/><div className="deck-back"><b>P&C</b><small>{count}</small></div><em>{label}</em></div>}
