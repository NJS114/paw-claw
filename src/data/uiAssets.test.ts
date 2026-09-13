import {describe,expect,it} from 'vitest';
import {GAME_ASSETS,REQUIRED_GAME_ASSETS,asset,assetIds,assetsFor} from './uiAssets';

describe('Paw & Claw asset catalog',()=>{
 it('has unique ids',()=>{const ids=assetIds();expect(new Set(ids).size).toBe(ids.length)});
 it('keeps required assets documented and usable',()=>{expect(REQUIRED_GAME_ASSETS.length).toBeGreaterThan(6);for(const entry of REQUIRED_GAME_ASSETS){expect(entry.src.length).toBeGreaterThan(0);expect(entry.usage.length).toBeGreaterThan(0);expect(entry.alt.length).toBeGreaterThan(0)}});
 it('resolves every registered asset by id',()=>{for(const entry of GAME_ASSETS)expect(asset(entry.id)).toEqual(entry)});
 it('uses the supplied hero, booster family and card back',()=>{expect(asset('brand.hero-duo').src).toContain('heros-duo-removebg-preview.png');expect(asset('booster.standard-violet').src).toContain('booster.png');expect(asset('booster.magicians').src).toContain('booster_magician.png');expect(asset('booster.pirates').src).toContain('booster_pirate.png');expect(asset('booster.healers').src).toContain('booster_sante.png');expect(asset('booster.card-back').src).toContain('dos_de_carte.png')});
 it('covers the full core mobile game journey',()=>{for(const usage of ['home','collection','deck','shop','matchmaking','battle','booster-opening','victory','defeat','draw','nav','reward'])expect(assetsFor(usage).length,`missing ${usage}`).toBeGreaterThan(0)});
 it('keeps safe fallbacks for planned visual media',()=>{for(const entry of GAME_ASSETS.filter(a=>!a.required)){const mayBeTransparentFx=entry.kind==='fx'||entry.kind==='icon';expect(Boolean(entry.fallback)||mayBeTransparentFx,`${entry.id} needs fallback`).toBe(true)}});
 it('throws on unknown ids instead of silently rendering broken media',()=>{expect(()=>asset('missing.asset')).toThrow(/inconnu/)});
});
