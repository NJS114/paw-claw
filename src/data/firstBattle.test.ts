import {describe,expect,it} from 'vitest';
import {cards} from './gameCards';
import {starterCollection,loadCollection} from './collection';
import {DECK_SIZE,starterDeck,validateDeck} from './deck';
import {speciesOf} from './loreSynergies';
import {rarityCopyLimit} from './rarityBalance';

describe('first battle onboarding',()=>{
  it('grants enough owned cards for a legal starting deck',()=>{
    const owned=starterCollection();
    const starter=starterDeck(cards,owned);
    const validation=validateDeck(starter,cards,owned);

    expect(Object.values(owned).reduce((sum,copies)=>sum+copies,0)).toBe(DECK_SIZE);
    expect(starter.cardIds).toHaveLength(DECK_SIZE);
    expect(validation.valid,validation.issues.join(' | ')).toBe(true);
    expect(validation.species).toBe('Chat');
    for(const [id,copies] of Object.entries(owned)){
      const card=cards.find(c=>c.id===id);
      expect(card).toBeDefined();
      expect(card!.type).toBe('Héros');
      expect(card!.rarity).toBe('Commune');
      expect(speciesOf(card!)).toBe('Chat');
      expect(copies).toBeLessThanOrEqual(rarityCopyLimit(card!));
    }
  });

  it('does not overwrite an existing saved collection',()=>{
    const existing={'mag-001':2,'hea-007':1};
    localStorage.setItem('paw-claw.collection.v1',JSON.stringify(existing));
    expect(loadCollection()).toEqual(existing);
  });

  it('recognizes chiots as dogs rather than adding them to a Cat deck',()=>{
    const puppies=cards.filter(card=>card.id==='cre-002'||card.id==='cre-004');
    expect(puppies).toHaveLength(2);
    expect(puppies.map(speciesOf)).toEqual(['Chien','Chien']);
    const owned=starterCollection();
    for(const puppy of puppies)expect(owned[puppy.id]).toBeUndefined();
  });
});
