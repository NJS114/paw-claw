import {render,screen} from '@testing-library/react';
import {describe,expect,it} from 'vitest';
import {GameCard} from './GameCard';
import type {CardData} from './data/gameCards';

const card:CardData={id:'test-legend',name:'Gardienne des Aurores',family:'Nobles',rarity:'Légendaire',type:'Héros',cost:5,atk:6,hp:8,flavor:'Protège les alliés à son arrivée.',assetPath:'/assets/cards/test.webp'};

describe('GameCard',()=>{
 it('renders all live, translatable card information',()=>{
  const{container}=render(<GameCard card={card} variant="feature" copies={2} statusBadge="NOUVELLE"/>);
  expect(screen.getByText('Gardienne des Aurores')).toBeTruthy();
  expect(screen.getByText('Protège les alliés à son arrivée.')).toBeTruthy();
  expect(screen.getByText('Légendaire · Héros')).toBeTruthy();
  expect(screen.getByText('Nobles')).toBeTruthy();
  expect(screen.getByText('NOUVELLE')).toBeTruthy();
  expect(screen.getByText('×2')).toBeTruthy();
  expect(container.querySelector('.rarity-legendaire')).toBeTruthy();
 });

 it('uses current combat health and exposes buffs',()=>{
  render(<GameCard card={card} variant="battle" currentHp={3} atkBonus={2} hpBonus={1}/>);
  expect(screen.getByText('+2 ATQ')).toBeTruthy();
  expect(screen.getByText('+1 PV')).toBeTruthy();
  expect(screen.getByLabelText(/3 points de vie/)).toBeTruthy();
 });
});
