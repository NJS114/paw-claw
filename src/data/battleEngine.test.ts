import { describe,expect,it } from 'vitest';
import { drawCard, resolveCombat, resolveLoreSides, type BattleSideState } from './battleEngine';
import type { CardData } from './gameCards';

const card=(id:string,name:string,family='Nature',atk=2,hp=2):CardData=>({id,name,family,rarity:'Commune',type:'Héros',cost:1,atk,hp});
const side=(overrides:Partial<BattleSideState>={}):BattleSideState=>({
  board:Array(7).fill(null),heroHp:20,energy:5,hand:[],deck:[],shield:0,momentum:0,
  survivalUsed:false,pirateDrawUsed:false,healerSaveUsed:false,firstPlayDone:false,fatigue:0,
  ...overrides,
});

describe('drawCard',()=>{
  it('draws the top card when hand has room',()=>{
    const c=card('x','Test');
    const result=drawCard(side({deck:[c]}),'player');
    expect(result.drew).toBe(true);
    expect(result.side.hand).toHaveLength(1);
    expect(result.side.deck).toHaveLength(0);
  });

  it('does not fatigue with a full hand',()=>{
    const hand=Array.from({length:5},(_,i)=>card(`h${i}`,`H${i}`));
    const result=drawCard(side({hand,deck:[]}),'player');
    expect(result.side.heroHp).toBe(20);
    expect(result.side.fatigue).toBe(0);
    expect(result.event.value).toBe(0);
  });

  it('applies progressive fatigue on an empty deck',()=>{
    const first=drawCard(side({deck:[],heroHp:20}),'player');
    const second=drawCard(first.side,'player');
    expect(first.side.heroHp).toBe(19);
    expect(first.side.fatigue).toBe(1);
    expect(second.side.heroHp).toBe(17);
    expect(second.side.fatigue).toBe(2);
  });
});

describe('combat resolution',()=>{
  it('resolves opposing units simultaneously',()=>{
    const a=card('a','A','Nature',3,3),b=card('b','B','Nature',3,3);
    const result=resolveCombat(side({board:[{...a,currentHp:3},...Array(6).fill(null)]}),side({board:[{...b,currentHp:3},...Array(6).fill(null)]}));
    expect(result.attacker.board[0]).toBeNull();
    expect(result.defender.board[0]).toBeNull();
    expect(result.attackerKills).toBe(1);
    expect(result.defenderKills).toBe(1);
  });

  it('resolves forbidden-love lore immediately across boards',()=>{
    const dog=card('omb-005','Lame Silencieuse','Ombres',3,4);
    const cat=card('hea-004','Frère Protecteur','Guérisseurs',3,4);
    const result=resolveLoreSides(side({board:[{...dog,currentHp:4},...Array(6).fill(null)]}),side({board:[{...cat,currentHp:4},...Array(6).fill(null)]}));
    expect(result.player.board[0]).toBeNull();
    expect(result.enemy.board[0]).toBeNull();
    expect(result.events.some(e=>e.type==='lore')).toBe(true);
  });
});
