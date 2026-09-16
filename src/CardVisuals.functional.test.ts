import {describe,expect,it} from 'vitest';
import {cards} from './data/gameCards';
import {speciesOf} from './data/loreSynergies';

describe('curated card identities',()=>{
 it('uses distinct breed metadata and permanent full-body assets',()=>{
  const ids=['mag-002','mag-007','omb-005','nob-008','rob-009','nat-007'];
  const curated=ids.map(id=>cards.find(card=>card.id===id));
  expect(curated.every(Boolean)).toBe(true);
  expect(new Set(curated.map(card=>card?.breed)).size).toBe(ids.length);
  expect(curated.every(card=>card?.assetPath?.startsWith('/assets/card-art/v1/'))).toBe(true);
  expect(speciesOf(curated[0]!)).toBe('Chien');
  expect(speciesOf(curated[1]!)).toBe('Chat');
 });
});
