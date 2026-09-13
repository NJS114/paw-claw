import {act,fireEvent,render,screen} from '@testing-library/react';
import {describe,expect,it,vi} from 'vitest';
import {BoosterOpening} from './BoosterOpening';

vi.mock('./data/booster',()=>({generateStandardBooster:()=>({legendary:false,cards:Array.from({length:12},(_,i)=>({id:`card-${i}`,name:`Carte ${i+1}`,family:'Nature',rarity:i===11?'Épique':'Commune',type:'Héros',cost:1,atk:1,hp:2,assetPath:'/assets/generated/carte-bleue.webp'}))})}));

describe('BoosterOpening',()=>{
 it('switches between the committed booster visuals',()=>{
  render(<BoosterOpening owned={{}} available={1} onOpen={vi.fn(()=>true)} onShop={vi.fn()}/>);
  expect(screen.getByText('Royaumes & Légendes')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Booster suivant'}));
  expect(screen.getByText('Magiciens')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Booster suivant'}));
  expect(screen.getByText('Pirates')).toBeInTheDocument();
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

 it('routes to shop when no booster remains',()=>{
  const onShop=vi.fn();
  render(<BoosterOpening owned={{}} available={0} onOpen={vi.fn(()=>false)} onShop={onShop}/>);
  fireEvent.click(screen.getByRole('button',{name:'Aller à la boutique'}));
  expect(onShop).toHaveBeenCalledTimes(1);
 });
});
