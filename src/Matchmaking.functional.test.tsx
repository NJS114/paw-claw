import { act,fireEvent,render,screen } from '@testing-library/react';
import { afterEach,beforeEach,describe,expect,it,vi } from 'vitest';
import { Matchmaking } from './Matchmaking';
import type { CardData } from './data/gameCards';

const pool:CardData[]=Array.from({length:20},(_,i)=>({
  id:`nat-${100+i}`,name:`Chat ${i}`,family:'Nature',rarity:'Commune',type:'Héros',cost:1,atk:1,hp:2
}));

describe('matchmaking flow',()=>{
  beforeEach(()=>vi.useFakeTimers());
  afterEach(()=>vi.useRealTimers());

  it('moves from search to the 10-second preparation screen',()=>{
    render(<Matchmaking playerPool={pool} onWin={()=>{}} onLose={()=>{}} onDraw={()=>{}} onEditDeck={()=>{}}/>);
    expect(screen.getByText(/Recherche d’un adversaire/i)).toBeInTheDocument();
    act(()=>{vi.advanceTimersByTime(1300)});
    expect(screen.getByText(/Adversaire trouvé/i)).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText(/CHATS/i)).toBeInTheDocument();
    expect(screen.getByText(/CHIENS/i)).toBeInTheDocument();
  });

  it('allows returning to deck editing before combat',()=>{
    const edit=vi.fn();
    render(<Matchmaking playerPool={pool} onWin={()=>{}} onLose={()=>{}} onDraw={()=>{}} onEditDeck={edit}/>);
    fireEvent.click(screen.getByRole('button',{name:/Modifier le deck/i}));
    expect(edit).toHaveBeenCalledOnce();
  });
});
