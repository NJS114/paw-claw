import {useEffect,useState,type CSSProperties, type ImgHTMLAttributes} from 'react';
import {asset} from './data/uiAssets';

type Props={assetId:string;className?:string;decorative?:boolean;style?:CSSProperties;loading?:ImgHTMLAttributes<HTMLImageElement>['loading']};

/** Image primitive with catalog lookup + automatic fallback. */
export function GameAsset({assetId,className='',decorative=false,style,loading}:Props){
 const spec=asset(assetId);const[src,setSrc]=useState(spec.src);
 useEffect(()=>setSrc(spec.src),[spec.src]);
 const resolvedLoading=loading??(spec.priority==='critical'?'eager':'lazy');
 return <img className={`game-asset ${className}`} src={src} alt={decorative?'':spec.alt} aria-hidden={decorative||undefined} style={style} loading={resolvedLoading} decoding="async" onError={()=>{if(spec.fallback&&src!==spec.fallback)setSrc(spec.fallback)}}/>;
}
