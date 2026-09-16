import {describe,expect,it} from 'vitest';
import {GAME_ASSETS,REQUIRED_GAME_ASSETS,asset,assetIds,assetsFor} from './uiAssets';

describe('Paw & Claw asset catalog',()=>{
 it('has unique ids',()=>{const ids=assetIds();expect(new Set(ids).size).toBe(ids.length)});
 it('keeps required assets documented and usable',()=>{expect(REQUIRED_GAME_ASSETS.length).toBeGreaterThan(20);for(const entry of REQUIRED_GAME_ASSETS){expect(entry.src.length).toBeGreaterThan(0);expect(entry.usage.length).toBeGreaterThan(0);expect(entry.alt.length).toBeGreaterThan(0)}});
 it('resolves every registered asset by id',()=>{for(const entry of GAME_ASSETS)expect(asset(entry.id)).toEqual(entry)});
 it('uses the supplied hero and the approved royal booster set',()=>{
  expect(asset('brand.hero-duo').src).toContain('heros-duo-removebg-preview.png');
  expect(asset('booster.royal-legends').src).toBe('/assets/boosters/booster-royal-legends-v2.webp');
  expect(asset('booster.healers-emerald').src).toBe('/assets/boosters/booster-healers-emerald-v2.webp');
  expect(asset('booster.healers-light').src).toBe('/assets/boosters/booster-healers-light-v2.webp');
  expect(asset('booster.card-back').src).toBe('/assets/card-backs/paw-claw-royal-v2.webp');
  expect(asset('lobby.booster').src).toBe(asset('booster.royal-legends').src);
 });
 it('uses the uploaded production UI pack',()=>{
  expect(asset('icon.coins').src).toContain('icone-piece.png');
  expect(asset('icon.gems').src).toContain('icone-gemme.png');
  expect(asset('icon.missions').src).toContain('icone-parchemin.png');
  expect(asset('icon.pass').src).toContain('icone-couronne.png');
  expect(asset('icon.shop').src).toContain('coffre-bleu.png');
  expect(asset('button.play').src).toContain('btn-jouer.png');
  expect(asset('button.collection').src).toContain('btn-collection.png');
  expect(asset('button.events').src).toContain('btn-evenements.png');
  expect(asset('rarity.legendary-badge').src).toContain('rarete-legendaire.png');
 });
 it('uses a dedicated background for each major game screen',()=>{
  expect(asset('world.lobby-day').src).toBe('/assets/backgrounds/bg-lobby-royal-v3.webp');
  expect(asset('world.lobby-day-approved').src).toBe('/assets/backgrounds/bg-lobby-day-royal-activity-v7.webp');
  expect(asset('world.lobby-night-approved').src).toBe('/assets/backgrounds/bg-lobby-night-back-v7.webp');
  expect(asset('world.collection-hall').src).toBe('/assets/backgrounds/bg-collection-gallery-2d-v9.webp');
  expect(asset('world.deck-forge').src).toBe('/assets/backgrounds/bg-deck-forge-2d-v9.webp');
  expect(asset('world.shop').src).toBe('/assets/backgrounds/bg-shop-market-2d-v9.webp');
  expect(asset('world.events').src).toBe('/assets/backgrounds/bg-events-festival-2d-v9.webp');
  expect(asset('world.matchmaking').src).toBe('/assets/backgrounds/bg-matchmaking-plaza-2d-v9.webp');
  expect(asset('battle.arena-main').src).toBe('/assets/backgrounds/bg-battle-courtyard-2d-v9.webp');
 });
 it('uses two distinct restored hero sprites in the lobby',()=>{
  expect(asset('lobby.hero-cat').src).toBe('/assets/characters/lobby-cat-v3.webp');
  expect(asset('lobby.hero-dog').src).toBe('/assets/characters/lobby-dog-v3.webp');
  expect(asset('lobby.hero-cat').src).not.toBe(asset('lobby.hero-dog').src);
 });
 it('covers the full core mobile game journey',()=>{for(const usage of ['home','collection','deck','shop','matchmaking','battle','booster-opening','victory','defeat','draw','nav','reward'])expect(assetsFor(usage).length,`missing ${usage}`).toBeGreaterThan(0)});
 it('keeps safe fallbacks for planned visual media',()=>{for(const entry of GAME_ASSETS.filter(a=>!a.required)){const mayBeTransparentFx=entry.kind==='fx'||entry.kind==='icon';expect(Boolean(entry.fallback)||mayBeTransparentFx,`${entry.id} needs fallback`).toBe(true)}});
 it('throws on unknown ids instead of silently rendering broken media',()=>{expect(()=>asset('missing.asset')).toThrow(/inconnu/)});
});
