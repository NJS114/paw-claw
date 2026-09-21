import {render,screen,fireEvent,cleanup,within} from '@testing-library/react';
import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {CardNotebook} from './CardNotebook';
import {cards} from './data/gameCards';
import {FAMILY_RULES} from './data/synergies';

beforeEach(()=>{Object.defineProperty(HTMLDialogElement.prototype,'showModal',{configurable:true,value:vi.fn(function(this:HTMLDialogElement){this.open=true;})});});
afterEach(()=>{cleanup();vi.restoreAllMocks();});
describe('Real card notebook',()=>{
 it('shows catalogue stats and actual family rules, with keyboard tabs',()=>{
  const card=cards.find(c=>c.id==='mag-007')!;
  render(<CardNotebook card={card} copies={2} onClose={vi.fn()}/>);
  const panel=within(screen.getByRole('tabpanel'));
  expect(panel.getByText('Attaque').nextElementSibling).toHaveTextContent(String(card.atk));
  expect(panel.getByText('Vie').nextElementSibling).toHaveTextContent(String(card.hp));
  expect(screen.getByText('2 exemplaires dans ta collection')).toBeInTheDocument();
  const tab=screen.getByRole('tab',{name:'Aptitudes'});tab.focus();fireEvent.keyDown(tab,{key:'ArrowRight'});
  expect(screen.getByRole('tab',{name:'Talents'})).toHaveFocus();
  expect(within(screen.getByRole('tabpanel')).getByText(FAMILY_RULES[card.family][1])).toBeInTheDocument();
  fireEvent.click(screen.getByRole('tab',{name:'Histoire'}));
  expect(within(screen.getByRole('tabpanel')).getByText(card.flavor!)).toBeInTheDocument();
 });
 it('shows real lore and never creates an unlock requirement',()=>{
  render(<CardNotebook card={cards.find(c=>c.id==='omb-005')!} copies={0} onClose={vi.fn()}/>);
  expect(screen.getByText('Cette carte reste à découvrir.')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('tab',{name:'Talents'}));
  expect(screen.getByText('Amour interdit')).toBeInTheDocument();
  expect(screen.queryByText(/Ascension/)).not.toBeInTheDocument();
 });
 it('restores scroll and focus on dismissal and supports utility cards',()=>{
  const opener=document.createElement('button');document.body.append(opener);opener.focus();
  const close=vi.fn();const card=cards.find(c=>c.type!=='Héros')!;
  const {unmount}=render(<CardNotebook card={card} copies={1} onClose={close}/>);
  expect(document.body.style.overflow).toBe('hidden');
  fireEvent.click(screen.getByRole('button',{name:'Fermer'}));expect(close).toHaveBeenCalledOnce();
  unmount();expect(document.body.style.overflow).toBe('');expect(opener).toHaveFocus();opener.remove();
 });
});
