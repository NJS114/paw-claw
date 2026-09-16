import {render,screen,within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe,it,expect,vi} from 'vitest';
import {App} from './App';

describe('Portrait app integration',()=>{
 it('keeps the four portrait destinations reachable and saves a real booster purchase',async()=>{
  const hours=vi.spyOn(Date.prototype,'getHours').mockReturnValue(12);
  localStorage.clear();const user=userEvent.setup();const{container}=render(<App/>);
  const nav=within(screen.getByRole('navigation',{name:'Navigation principale'}));
  expect(container.querySelector('.mobile-lobby-bg')).toHaveAttribute('src','/assets/backgrounds/bg-lobby-day-royal-activity-v7.webp');
  await user.click(nav.getByRole('button',{name:'Collection'}));
  expect(screen.getByRole('heading',{name:'Galerie royale'})).toBeInTheDocument();
  expect(container.querySelector('.screen-background-art')).toHaveAttribute('src','/assets/backgrounds/bg-collection-portrait-v4.webp');
  await user.click(nav.getByRole('button',{name:'Decks'}));
  expect(screen.getByRole('heading',{name:'Atelier des decks'})).toBeInTheDocument();
  expect(container.querySelector('.screen-background-art')).toHaveAttribute('src','/assets/backgrounds/bg-deck-portrait-v4.webp');
  await user.click(nav.getByRole('button',{name:'Boutique'}));
  expect(container.querySelector('.screen-background-art')).toHaveAttribute('src','/assets/backgrounds/bg-shop-portrait-v4.webp');
  await user.click(screen.getByRole('button',{name:'Acheter · 100 pièces'}));
  expect(screen.getByRole('region',{name:'Ouverture de booster'})).toBeInTheDocument();
  const saved=JSON.parse(localStorage.getItem('paw-claw.progression.v1')!);
  expect(saved.coins).toBe(1140);expect(saved.sealedBoosters).toBe(2);
  await user.click(nav.getByRole('button',{name:'Accueil'}));
  expect(screen.getByRole('region',{name:'Accueil Paw & Claw'})).toBeInTheDocument();
  hours.mockRestore();
 });
});
