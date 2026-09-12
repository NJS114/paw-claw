import {describe,expect,it} from 'vitest';
import {GAME_ASSETS,REQUIRED_GAME_ASSETS,asset,assetsFor} from './uiAssets';

describe('Paw & Claw asset catalog',()=>{
 it('has unique ids',()=>{const ids=GAME_ASSETS.map(a=>a.id);expect(new Set(ids).size).toBe(ids.length)});
 it('keeps required assets documented and usable',()=>{expect(REQUIRED_GAME_ASSETS.length).toBeGreaterThan(3);for(const entry of REQUIRED_GAME_ASSETS){expect(entry.src).toMatch(/^\/assets\/generated\//);expect(entry.usage.length).toBeGreaterThan(0);expect(entry.alt.length).toBeGreaterThan(0)}});
 it('resolves assets by id',()=>{expect(asset('brand.hero-duo').kind).toBe('character');expect(asset('booster.standard-violet').usage).toContain('booster-opening')});
 it('indexes assets by usage',()=>{expect(assetsFor('home').some(a=>a.id==='brand.hero-duo')).toBe(true);expect(assetsFor('booster-opening').some(a=>a.kind==='booster')).toBe(true)});
 it('throws on unknown ids instead of silently rendering broken media',()=>{expect(()=>asset('missing.asset')).toThrow(/inconnu/)});
});
