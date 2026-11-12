import { act,fireEvent,render,screen } from '@testing-library/react';
import { afterEach,beforeEach,describe,expect,it,vi } from 'vitest';
import { Matchmaking } from './Matchmaking';
import type { CardData } from './data/gameCards';
import { emptyBattleStats, saveBattle } from './data/battleSession';
import type { BattleSideState } from './data/battleEngine';

const pool:CardData[]=Array.from({length:20},(_,i)=>({
  id:`nat-${100+i}`,name:`Chat ${i}`,family:'Nature',rarity:'Commune',type:'Héros',cost:1,atk:1,hp:2
}));

describe('matchmaking flow',()=>{
  it('resumes an existing duel without clearing the checkpoint or granting rewards',()=>{
    const side:BattleSideState={board:Array(7).fill(null),heroHp:14,energy:3,hand:pool.slice(0,5),deck:pool.slice(5),shield:0,momentum:0,survivalUsed:false,pirateDrawUsed:false,healerSaveUsed:false,firstPlayDone:false};
    const state={player:side,enemy:{...side,heroHp:18},turn:4,log:['Duel sauvegardé']};
    saveBattle({version:3,startedAt:1000,updatedAt:2000,maxMomentum:0,stats:emptyBattleStats(),phase:'player',checkpoint:'stable-player',checkpointState:state,state});
    const win=vi.fn(),lose=vi.fn();
    render(<Matchmaking playerPool={pool} onWin={win} onLose={lose} onDraw={()=>{}} onEditDeck={()=>{}}/>);
    expect(screen.getByRole('heading',{name:'Un duel t’attend'})).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:'Reprendre le duel'}));
    expect(screen.getAllByText('Partie reprise').length).toBeGreaterThan(0);
    expect(JSON.parse(localStorage.getItem('paw-claw.battle.active.v3')!).state.turn).toBe(4);
    expect(win).not.toHaveBeenCalled();expect(lose).not.toHaveBeenCalled();
  });
  beforeEach(()=>vi.useFakeTimers());
  afterEach(()=>vi.useRealTimers());

  it('moves from search to the 10-second preparation screen',()=>{
    render(<Matchmaking playerPool={pool} onWin={()=>{}} onLose={()=>{}} onDraw={()=>{}} onEditDeck={()=>{}}/>);
    expect(screen.getByText(/Préparation du duel/i)).toBeInTheDocument();
    act(()=>{vi.advanceTimersByTime(1300)});
    expect(screen.getByText(/Rival IA prêt/i)).toBeInTheDocument();
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
