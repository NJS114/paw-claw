import {act,fireEvent,render,screen} from '@testing-library/react';
import {describe,expect,it,vi} from 'vitest';
import {BoosterOpening} from './BoosterOpening';

vi.mock('./data/booster',()=>({generateStandardBooster:()=>({legendary:false,cards:Array.from({length:12},(_,i)=>({id:`card-${i}`,name:`Carte ${i+1}`,family:'Nature',rarity:i===11?'Épique':'Commune',type:'Héros',cost:1,atk:1,hp:2,assetPath:'/assets/generated/carte-bleue.webp'}))})}));

describe('BoosterOpening',()=>{
 it('switches between the committed booster visuals',()=>{
  render(<BoosterOpening owned={{}} available={1} onOpen={vi.fn(()=>true)} onShop={vi.fn()}/>);
  expect(screen.getByText('Royaumes & Légendes')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Booster suivant'}));
  expect(screen.getByText('Guérisseurs Émeraude')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Booster suivant'}));
  expect(screen.getByText('Guérisseurs Lumière')).toBeInTheDocument();
 });

 it('opens a pack through charge, tear and reveal phases',()=>{
  vi.useFakeTimers();
  const onOpen=vi.fn(()=>true);
  render(<BoosterOpening owned={{}} available={1} onOpen={onOpen} onShop={vi.fn()}/>);
  fireEvent.click(screen.getByRole('button',{name:'Ouvrir'}));
  expect(onOpen).toHaveBeenCalledTimes(1);
  expect(screen.getByText('Énergie du royaume…')).toBeInTheDocument();
  act(()=>vi.advanceTimersByTime(650));
  expect(screen.getByText('Ouverture…')).toBeInTheDocument();
  act(()=>vi.advanceTimersByTime(760));
  expect(screen.getByRole('button',{name:/Révéler la carte 1\/12/})).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:/Révéler la carte 1\/12/}));
  expect(screen.getByText('Carte 1')).toBeInTheDocument();
  vi.useRealTimers();
 });

 it('consumes exactly one pack for a full swipe, and none for a cancelled swipe',()=>{
  const original=window.PointerEvent;
  window.PointerEvent=MouseEvent as typeof PointerEvent;
  const onOpen=vi.fn(()=>true);
  const {container}=render(<BoosterOpening owned={{}} available={2} onOpen={onOpen} onShop={vi.fn()}/>);
  const strip=container.querySelector('.booster-swipe') as HTMLElement;
  strip.setPointerCapture=vi.fn();
  vi.spyOn(strip,'getBoundingClientRect').mockReturnValue({width:200,left:0,right:200,top:0,bottom:50,height:50,x:0,y:0,toJSON:()=>({})});
  fireEvent.pointerDown(strip,{clientX:0,button:0});fireEvent.pointerMove(strip,{clientX:50});fireEvent.pointerCancel(strip);
  expect(onOpen).not.toHaveBeenCalled();
  fireEvent.pointerDown(strip,{clientX:0,button:0});fireEvent.pointerMove(strip,{clientX:150});
  fireEvent.pointerMove(strip,{clientX:190});expect(onOpen).toHaveBeenCalledTimes(1);
  window.PointerEvent=original;
 });

 it('routes to shop when no booster remains',()=>{
  const onShop=vi.fn();
  render(<BoosterOpening owned={{}} available={0} onOpen={vi.fn(()=>false)} onShop={onShop}/>);
  fireEvent.click(screen.getByRole('button',{name:'Aller à la boutique'}));
  expect(onShop).toHaveBeenCalledTimes(1);
 });
});
