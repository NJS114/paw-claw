import { describe,expect,it } from 'vitest';
import { battleDefeat,battleDraw,battleVictory,buyBooster,openBooster,type Progression } from './progression';

const base:Progression={coins:1000,gems:100,xp:0,level:1,wins:0,losses:0,draws:0,boostersOpened:0,sealedBoosters:0};

describe('progression economy',()=>{
  it('rewards a victory',()=>{
    const next=battleVictory(base);
    expect(next.coins).toBe(1080);
    expect(next.gems).toBe(102);
    expect(next.wins).toBe(1);
  });
  it('rewards a defeat without gems',()=>{
    const next=battleDefeat(base);
    expect(next.coins).toBe(1025);
    expect(next.gems).toBe(100);
    expect(next.losses).toBe(1);
  });
  it('rewards a draw and records it',()=>{
    const next=battleDraw(base);
    expect(next.coins).toBe(1040);
    expect(next.draws).toBe(1);
  });
  it('keeps booster stock consistent from purchase to opening',()=>{
    const bought=buyBooster(base,100);
    expect(bought?.coins).toBe(900);
    expect(bought?.sealedBoosters).toBe(1);
    const opened=openBooster(bought!);
    expect(opened?.sealedBoosters).toBe(0);
    expect(opened?.boostersOpened).toBe(1);
  });
});
