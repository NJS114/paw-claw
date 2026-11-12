export type CozyIconName='home'|'decks'|'combat'|'shop'|'boosters'|'paw'|'chevron-left'|'chevron-right'|'chevron-down'|'plus'|'minus'|'check'|'more'|'close'|'pause'|'play'|'settings';
const paths:Record<CozyIconName,string>={
 home:'M3 15 16 3l13 12M7 13v16h7v-9h5v9h6V13',
 decks:'M10 3h18v24H10zM6 7l-4 2 5 21 17-3M18 9l4 6-4 6-4-6 4-6Z',
 combat:'M5 3l8 5 15 17-3 3L8 13 3 5l2-2ZM27 3l-8 5-5 6m-4 5-6 6 3 3 6-6M22 21l7-5M21 22l-5 7M10 21l-7-5M11 22l5 7',
 shop:'M5 3h22l3 9a5 5 0 0 1-7 4 5 5 0 0 1-7 0 5 5 0 0 1-7 0 5 5 0 0 1-7-4L5 3ZM6 19v10h20V19M12 29v-9h8v9',
 boosters:'M8 3h18v27H8zM8 7h18M8 26h18M17 11l5 6-5 6-5-6 5-6Z',
 paw:'M10 13a3 4 0 1 0 0-8 3 4 0 1 0 0 8M22 13a3 4 0 1 0 0-8 3 4 0 1 0 0 8M5 20a2.5 3 0 1 0 0-6 2.5 3 0 1 0 0 6M27 20a2.5 3 0 1 0 0-6 2.5 3 0 1 0 0 6M16 17c-4 0-10 7-8 11s6 0 8 0 7 4 9 0-5-11-9-11Z',
 'chevron-left':'m21 7-10 10 10 10','chevron-right':'m11 7 10 10-10 10','chevron-down':'m7 12 10 10 10-10',
 plus:'M17 6v22M6 17h22',minus:'M6 17h22',check:'m6 17 7 7L28 8',more:'M7 17h1M16 17h1M25 17h1',close:'M8 8l18 18M26 8 8 26',pause:'M12 7v20M22 7v20',play:'m11 6 16 11-16 11Z',
 settings:'M13 3h6l1 4 4 2 4-1 3 5-3 3v4l3 3-3 5-4-1-4 2-1 3h-6l-1-3-4-2-4 1-3-5 3-3v-4l-3-3 3-5 4 1 4-2 1-4ZM21 17a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z',
};
/** Shared restrained game emblems; no raster plates or decorative button backgrounds. */
export function CozyIcon({name,className=''}:{name:CozyIconName;className?:string}){
 return <svg className={`paw-ui-icon ${className}`.trim()} viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={paths[name]}/></svg>;
}
export function CozyNavContent({name,label}:{name:CozyIconName;label:string}){return <><CozyIcon name={name}/><span className="paw-nav-label">{label}</span></>}
