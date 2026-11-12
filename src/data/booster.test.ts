import {afterEach,describe,expect,it,vi} from 'vitest';
import {generateStandardBooster} from './booster';
import {BOOSTER_PACKS,loadSelectedBoosterPackIndex,saveSelectedBoosterPackIndex} from './boosterPacks';

afterEach(()=>vi.restoreAllMocks());

describe('booster edition pulls',()=>{
 it('draws twelve cards with eight commons, three rares and one epic',()=>{
  vi.spyOn(Math,'random').mockReturnValue(0.5);
  const pull=generateStandardBooster();
  expect(pull.cards).toHaveLength(12);
  expect(pull.cards.every(card=>card.type==='Héros')).toBe(true);
  expect(pull.cards.filter(card=>card.rarity==='Commune')).toHaveLength(8);
  expect(pull.cards.filter(card=>card.rarity==='Rare')).toHaveLength(3);
  expect(pull.cards.filter(card=>card.rarity==='Épique')).toHaveLength(1);
  expect(pull.legendary).toBe(false);
 });

 it.each(BOOSTER_PACKS.slice(1))('draws only Guérisseurs from $label',pack=>{
  vi.spyOn(Math,'random').mockReturnValue(0.5);
  const pull=generateStandardBooster(pack.id);
  expect(pull.cards).toHaveLength(12);
  expect(pull.cards.every(card=>card.family==='Guérisseurs')).toBe(true);
  expect(pull.cards.filter(card=>card.rarity==='Rare')).toHaveLength(3);
 });

 it('keeps the guaranteed final legendary in healer editions',()=>{
  vi.spyOn(Math,'random').mockReturnValue(0);
  const pull=generateStandardBooster('booster.healers-light');
  expect(pull.legendary).toBe(true);
  expect(pull.cards).toHaveLength(12);
  expect(pull.cards[pull.cards.length-1]?.rarity).toBe('Légendaire');
  expect(pull.cards[pull.cards.length-1]?.family).toBe('Guérisseurs');
 });

 it('persists the selected pack, ignores invalid indices and restores a safe default',()=>{
  expect(loadSelectedBoosterPackIndex()).toBe(0);
  saveSelectedBoosterPackIndex(2);
  expect(loadSelectedBoosterPackIndex()).toBe(2);
  saveSelectedBoosterPackIndex(-1);
  expect(loadSelectedBoosterPackIndex()).toBe(2);
  saveSelectedBoosterPackIndex(200);
  expect(loadSelectedBoosterPackIndex()).toBe(2);
  localStorage.setItem('paw-claw.booster.selected.v1','unknown-pack');
  expect(loadSelectedBoosterPackIndex()).toBe(0);
 });
});
