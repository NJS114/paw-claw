import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {RealmCompanion,loadMotion,saveMotion} from './RealmCompanion';
import {DECK_SIZE} from './data/deck';

beforeEach(()=>{localStorage.clear();Object.defineProperty(HTMLDialogElement.prototype,'showModal',{configurable:true,value:vi.fn(function(this:HTMLDialogElement){this.open=true})})});
afterEach(()=>{cleanup();vi.restoreAllMocks()});
describe('Carnet des pattes',()=>{
 it('teaches the actual deck size and traverses all lessons',()=>{
  const close=vi.fn();render(<RealmCompanion motion="system" onMotion={vi.fn()} onClose={close}/>);
  expect(screen.getByText(new RegExp(`Choisis ${DECK_SIZE} cartes`))).toBeInTheDocument();
  for(let i=0;i<3;i++)fireEvent.click(screen.getByRole('button',{name:'Suivant'}));
  fireEvent.click(screen.getByRole('button',{name:'À moi de jouer !'}));expect(close).toHaveBeenCalledTimes(1);
 });
 it('persists a banner without changing the active deck',()=>{
  localStorage.setItem('paw-claw.deck.active.v1','{"name":"Mon équipe"}');
  render(<RealmCompanion motion="system" onMotion={vi.fn()} onClose={vi.fn()}/>);
  fireEvent.click(screen.getByRole('button',{name:'Clans'}));
  fireEvent.click(screen.getByRole('button',{name:/Les Truffes/}));
  expect(localStorage.getItem('paw-claw.banner.v1')).toBe('Chien');
  expect(localStorage.getItem('paw-claw.deck.active.v1')).toBe('{"name":"Mon équipe"}');
 });
 it('shows an honest empty history and persists reduced motion',()=>{
  const onMotion=vi.fn();render(<RealmCompanion motion="system" onMotion={onMotion} onClose={vi.fn()}/>);
  fireEvent.click(screen.getByRole('button',{name:'Duels'}));expect(screen.getByText('Les duels terminés apparaîtront ici.')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Réglages'}));fireEvent.click(screen.getByRole('checkbox'));
  expect(onMotion).toHaveBeenCalledWith('reduced');saveMotion('reduced');expect(loadMotion()).toBe('reduced');
 });
});
