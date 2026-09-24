export type CozyIconName='home'|'decks'|'combat'|'shop'|'boosters'|'paw'|'chevron-left'|'chevron-right'|'chevron-down'|'plus'|'minus'|'check'|'more'|'close'|'pause'|'play'|'settings';

/** Independent vector assets, with labels and interactions supplied by HTML. */
export function CozyIcon({name,className=''}:{name:CozyIconName;className?:string}){
 return <img className={`paw-ui-icon ${className}`.trim()} src={`/assets/ui-buttons/${name}.svg`} alt="" aria-hidden="true" draggable={false}/>;
}

export function CozyNavContent({name,label}:{name:CozyIconName;label:string}){
 return <><CozyIcon name={name}/><span className="paw-nav-label">{label}</span></>;
}
