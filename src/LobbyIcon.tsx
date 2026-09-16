type IconName='home'|'shop'|'scroll'|'crown'|'cards'|'swords'|'shield'|'gift'|'settings';
const paths:Record<IconName,string>={
 home:'M3 15 16 3l13 12M7 13v16h7v-9h5v9h6V13',
 shop:'M5 3h22l3 9a5 5 0 0 1-7 4 5 5 0 0 1-7 0 5 5 0 0 1-7 0 5 5 0 0 1-7-4L5 3ZM6 19v10h20V19M12 29v-9h8v9',
 scroll:'M9 3h17a4 4 0 0 1 0 8h-3M8 3a4 4 0 0 0 0 8h1v13a4 4 0 0 1-4 4h16a4 4 0 0 0 4-4V7M12 14h8M12 19h8',
 crown:'M3 10l6 5 7-11 7 11 6-5-4 17H7L3 10ZM8 23h16M16 12v5',
 cards:'M10 3h18v24H10zM6 7l-4 2 5 21 17-3M18 9l4 6-4 6-4-6 4-6Z',
 swords:'M5 3l8 5 15 17-3 3L8 13 3 5l2-2ZM27 3l-8 5-5 6m-4 5-6 6 3 3 6-6M22 21l7-5M21 22l-5 7M10 21l-7-5M11 22l5 7',
 shield:'M16 2l12 5v10c0 7-12 13-12 13S4 24 4 17V7l12-5ZM16 8v15M10 13h12',
 gift:'M3 12h26v7H3zM6 19v11h20V19M16 12v18M16 12C3 12 4 2 9 3c5 0 7 9 7 9Zm0 0C29 12 28 2 23 3c-5 0-7 9-7 9Z',
 settings:'M13 3h6l1 4 4 2 4-1 3 5-3 3v4l3 3-3 5-4-1-4 2-1 3h-6l-1-3-4-2-4 1-3-5 3-3v-4l-3-3 3-5 4 1 4-2 1-4ZM21 17a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z',
};
/** UI symbols stay crisp; labels and hit targets remain HTML. */
export function LobbyIcon({name}:{name:IconName}){return <svg className="lobby-icon" viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true" focusable="false"><path d={paths[name]}/></svg>}
