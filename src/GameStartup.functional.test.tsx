import {act,render,screen} from '@testing-library/react';
import {beforeEach,describe,expect,it,vi} from 'vitest';
import {GameStartup} from './GameStartup';

beforeEach(()=>{sessionStorage.clear();vi.useFakeTimers()});

describe('GameStartup',()=>{
 it('shows a branded loading state then enters the game',()=>{
  render(<GameStartup><div>Lobby prêt</div></GameStartup>);
  expect(screen.getByRole('heading',{name:'PAW & CLAW'})).toBeInTheDocument();
  expect(screen.queryByText('Lobby prêt')).not.toBeInTheDocument();
  act(()=>{vi.advanceTimersByTime(1300)});
  expect(screen.getByText('Lobby prêt')).toBeInTheDocument();
  expect(sessionStorage.getItem('pawclaw:booted')).toBe('1');
 });
 it('skips loading after the first boot in the session',()=>{
  sessionStorage.setItem('pawclaw:booted','1');
  render(<GameStartup><div>Lobby immédiat</div></GameStartup>);
  expect(screen.getByText('Lobby immédiat')).toBeInTheDocument();
  expect(screen.queryByText('Chargement du royaume…')).not.toBeInTheDocument();
 });
});
