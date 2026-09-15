import {render,screen,fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe,expect,it,vi} from 'vitest';
import {MobileLobby} from './MobileLobby';
import type {Progression} from './data/progression';

const progress:Progression={coins:1240,gems:120,xp:40,level:12,wins:8,losses:4,draws:1,boostersOpened:6,sealedBoosters:2};

describe('MobileLobby',()=>{
 it('loads the dedicated landscape background and two independent hero sprites',()=>{
  const {container}=render(<MobileLobby progress={progress} ownedCount={148} onNavigate={()=>{}}/>);
  expect(container.querySelector('.mobile-lobby-bg')).toHaveAttribute('src','/assets/backgrounds/bg-lobby-day-v2.webp');
  expect(container.querySelector('.lobby-hero-cat')).toHaveAttribute('src','/assets/generated/chaton-mage.webp');
  expect(container.querySelector('.lobby-hero-dog')).toHaveAttribute('src','/assets/generated/chien-chevalier.webp');
  expect(container.querySelector('.button-copy')).not.toBeInTheDocument();
  expect(screen.queryByText('Festival lunaire')).not.toBeInTheDocument();
 });
 it('retains the previous background if the new asset fails to load',()=>{
  const {container}=render(<MobileLobby progress={progress} ownedCount={148} onNavigate={()=>{}}/>);
  const background=container.querySelector('.mobile-lobby-bg')!;
  fireEvent.error(background);
  expect(background).toHaveAttribute('src','/assets/backgrounds/bg-lobby-day.svg');
 });
 it('keeps deck and reward actions interactive',async()=>{
  const user=userEvent.setup();const go=vi.fn();
  render(<MobileLobby progress={progress} ownedCount={148} onNavigate={go}/>);
  await user.click(screen.getByRole('button',{name:/Decks/i}));
  await user.click(screen.getByRole('button',{name:'Voir'}));
  expect(go.mock.calls.map(call=>call[0])).toEqual(['deck','progression']);
 });
 it('shows mobile-game player resources and collection count',()=>{
  render(<MobileLobby progress={progress} ownedCount={148} onNavigate={()=>{}}/>);
  expect(screen.getByText('Niveau 12')).toBeInTheDocument();
  expect(screen.getByText('1240')).toBeInTheDocument();
  expect(screen.getByText('120')).toBeInTheDocument();
  expect(screen.getByText(/148 cartes/)).toBeInTheDocument();
  expect(screen.getByText(/2 disponibles/)).toBeInTheDocument();
 });

 it('routes primary play and collection actions',async()=>{
  const user=userEvent.setup();const go=vi.fn();
  render(<MobileLobby progress={progress} ownedCount={148} onNavigate={go}/>);
  await user.click(screen.getByRole('button',{name:/JOUER/i}));
  expect(go).toHaveBeenCalledWith('battle');
  await user.click(screen.getByRole('button',{name:/Collection/i}));
  expect(go).toHaveBeenCalledWith('collection');
 });

 it('exposes profile, progression, booster and shop shortcuts',async()=>{
  const user=userEvent.setup();const go=vi.fn();
  render(<MobileLobby progress={progress} ownedCount={148} onNavigate={go}/>);
  await user.click(screen.getByRole('button',{name:'Ouvrir le profil'}));
  await user.click(screen.getByRole('button',{name:/Missions/i}));
  await user.click(screen.getByRole('button',{name:/Booster/i}));
  await user.click(screen.getByRole('button',{name:/Boutique/i}));
  expect(go.mock.calls.map(call=>call[0])).toEqual(expect.arrayContaining(['profile','progression','boosters','shop']));
 });
});
