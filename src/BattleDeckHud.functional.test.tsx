import {render,screen} from '@testing-library/react';
import {describe,expect,it} from 'vitest';
import {BattleDeckHud} from './BattleDeckHud';

describe('BattleDeckHud',()=>{
 it('renders the committed Paw & Claw card back for enemy hand and deck stacks',()=>{
  const {container}=render(<BattleDeckHud playerDeck={17} enemyDeck={18} playerHand={4} enemyHand={5}/>);
  expect(screen.getByLabelText('État des pioches')).toBeInTheDocument();
  expect(screen.getByLabelText('5 cartes dans la main adverse')).toBeInTheDocument();
  expect(screen.getByLabelText('Pioche adverse : 18 cartes')).toBeInTheDocument();
  expect(screen.getByLabelText('Ta pioche : 17 cartes')).toBeInTheDocument();
  const backs=container.querySelectorAll('img');
  expect(backs.length).toBeGreaterThanOrEqual(7);
  for(const image of backs)expect(image.getAttribute('src')).toBe('/assets/card-backs/paw-claw-royal-v2.webp');
 });
});
