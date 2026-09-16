import {useEffect,useState} from 'react';

export type LobbyPeriod='day'|'night';

/** Uses the device's local clock, which already reflects the player's time zone. */
export function lobbyPeriodAt(date:Date=new Date()):LobbyPeriod{
 const hour=date.getHours();
 return hour>=7&&hour<19?'day':'night';
}

export function lobbyAssetId(period:LobbyPeriod){
 return period==='day'?'world.lobby-day-approved':'world.lobby-night-approved';
}

export function useLocalLobbyPeriod():LobbyPeriod{
 const[period,setPeriod]=useState<LobbyPeriod>(()=>lobbyPeriodAt());
 useEffect(()=>{
  const refresh=()=>setPeriod(lobbyPeriodAt());
  refresh();
  const timer=window.setInterval(refresh,60_000);
  return()=>window.clearInterval(timer);
 },[]);
 return period;
}
