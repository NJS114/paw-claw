import {render,screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe,expect,it,vi} from 'vitest';
import {MobileLobby} from './MobileLobby';
import type {Progression} from './data/progression';

const progress:Progression={coins:1240,gems:120,xp:40,level:12,wins:8,losses:4,draws:1,boostersOpened:6,sealedBoosters:2};

describe('MobileLobby',()=>{
 it('uses real mission progress and sends rewards to the existing claim screen',async()=>{
  const go=vi.fn();
  const missions={version:2 as const,dailyKey:'2026-09-15',weeklyKey:'2026-09-14',counts:{'daily-play-3':2},claimed:[] as string[]};
  const {rerender}=render(<MobileLobby progress={progress} ownedCount={16} missions={missions} onNavigate={go}/>);
  expect(screen.getByRole('progressbar',{name:'Progression de la quête du jour'})).toHaveAttribute('value','2');
  expect(screen.queryByRole('button',{name:/Récupérer la récompense/})).not.toBeInTheDocument();
  rerender(<MobileLobby progress={progress} ownedCount={16} missions={{...missions,counts:{'daily-play-3':3}}} onNavigate={go}/>);
  await userEvent.click(screen.getByRole('button',{name:/Récupérer la récompense/}));
  expect(go).toHaveBeenCalledWith('progression');
  rerender(<MobileLobby progress={progress} ownedCount={16} missions={{...missions,counts:{'daily-play-3':3},claimed:['daily-play-3']}} onNavigate={go}/>);
  expect(screen.getByRole('button',{name:/Récompense récupérée/})).toBeInTheDocument();
 });
 it('opens the pirate preview, closes it, and routes preparation to the deck',async()=>{
  const user=userEvent.setup(),go=vi.fn();
  render(<MobileLobby progress={progress} ownedCount={148} onNavigate={go}/>);
  await user.click(screen.getByRole('button',{name:/Duel des pirates/}));
  expect(screen.getByRole('dialog',{name:'Duel des pirates'})).toBeInTheDocument();
  await user.click(screen.getByRole('button',{name:'Fermer l’événement'}));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  await user.click(screen.getByRole('button',{name:/Duel des pirates/}));
  await user.click(screen.getByRole('button',{name:/Préparer mon équipe/}));
  expect(go).toHaveBeenCalledWith('deck');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
 });
 it('pauses animation without blocking navigation',async()=>{
  const user=userEvent.setup(),go=vi.fn();
  const {container}=render(<MobileLobby progress={progress} ownedCount={148} onNavigate={go}/>);
  await user.click(screen.getByRole('button',{name:'Mettre les animations en pause'}));
  expect(container.querySelector('.depth-lobby')).toHaveAttribute('data-motion','paused');
  await user.click(screen.getByRole('button',{name:/Boutique/}));
  expect(go).toHaveBeenCalledWith('shop');
 });
 it('keeps deck and reward actions interactive',async()=>{
  const user=userEvent.setup();const go=vi.fn();
  render(<MobileLobby progress={progress} ownedCount={148} onNavigate={go}/>);
  await user.click(screen.getByRole('button',{name:/Decks/i}));
  await user.click(screen.getByRole('button',{name:'Voir les récompenses'}));
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
  await user.click(screen.getByRole('button',{name:/^Boosters/i}));
  await user.click(screen.getByRole('button',{name:/Boutique/i}));
  expect(go.mock.calls.map(call=>call[0])).toEqual(expect.arrayContaining(['profile','progression','boosters','shop']));
 });
});
