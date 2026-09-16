import {useEffect,useState} from 'react';
import {LobbyIcon} from './LobbyIcon';
import type {CardData} from './data/gameCards';

/** Never label an entire family sheet as an individual card illustration. */
export function CardArtwork({card}:{card:CardData}){
 const[failed,setFailed]=useState(false);
 useEffect(()=>setFailed(false),[card.id,card.assetPath]);
 if(!card.assetPath||failed)return <div className="missing-card-art" role="img" aria-label={`Illustration à venir : ${card.name}`}><LobbyIcon name="cards"/><small>Illustration à venir</small></div>;
 return <img src={card.assetPath} alt={card.name} loading="lazy" onError={()=>setFailed(true)}/>;
}
