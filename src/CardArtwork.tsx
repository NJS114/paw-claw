import {FrameSequence} from './FrameSequence';
import {CARD_ANIMATIONS} from './data/cardAnimations';
import {useEffect,useState} from 'react';
import {LobbyIcon} from './LobbyIcon';
import type {CardData} from './data/gameCards';

/** Never label an entire family sheet as an individual card illustration. */
export function CardArtwork({card,animated=false}:{card:CardData;animated?:boolean}){
 const[failed,setFailed]=useState(false);
 useEffect(()=>setFailed(false),[card.id,card.assetPath]);
 if(!card.assetPath||failed)return <div className="missing-card-art" role="img" aria-label={`Illustration à venir : ${card.name}`}><LobbyIcon name="cards"/><small>Illustration à venir</small></div>;
 const still = <img src={card.assetPath} alt={card.name} loading="lazy" onError={()=>setFailed(true)}/>;
 const atlas = animated ? CARD_ANIMATIONS[card.id] : undefined;
 return atlas ? <FrameSequence key={card.id} atlas={atlas} label={card.name} fallback={still}/> : still;
}
