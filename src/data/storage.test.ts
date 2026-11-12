import { beforeEach, describe, expect, it, vi } from 'vitest';
const native = vi.hoisted(() => ({ active: false, get: vi.fn(), set: vi.fn() }));
vi.mock('@capacitor/core', () => ({ Capacitor: { isNativePlatform: () => native.active } }));
vi.mock('@capacitor/preferences', () => ({ Preferences: { get: native.get, set: native.set } }));
import { initializeStorage, gameStorage, flushNativeSave } from './storage';

beforeEach(() => { native.active = false; native.get.mockReset(); native.set.mockReset(); native.set.mockResolvedValue(undefined); });
describe('native progress mirror', () => {
  it('keeps web saves local and never invokes native plugins', async () => {
    gameStorage.setItem('paw-claw.test', 'web');
    await initializeStorage(); await flushNativeSave();
    expect(localStorage.getItem('paw-claw.test')).toBe('web');
    expect(native.get).not.toHaveBeenCalled(); expect(native.set).not.toHaveBeenCalled();
  });
  it('restores native progress before gameplay without deleting unrelated keys', async () => {
    native.active = true;
    localStorage.setItem('other-app', 'keep');
    localStorage.setItem('paw-claw.old', 'stale');
    native.get.mockResolvedValue({ value: JSON.stringify({ version: 1, values: { 'paw-claw.progression.v1': '{"coins":270}' } }) });
    await initializeStorage();
    expect(gameStorage.getItem('paw-claw.progression.v1')).toBe('{"coins":270}');
    expect(localStorage.getItem('other-app')).toBe('keep');
    expect(localStorage.getItem('paw-claw.old')).toBeNull();
  });
  it('does not erase data when the native snapshot is invalid', async () => {
    native.active = true;
    localStorage.setItem('paw-claw.test', 'keep');
    native.get.mockResolvedValue({ value: '{"version":1,"values":{"foreign":"bad"}}' });
    await expect(initializeStorage()).rejects.toThrow();
    expect(localStorage.getItem('paw-claw.test')).toBe('keep');
    expect(native.set).not.toHaveBeenCalled();
  });
  it('serializes writes so the latest progress wins and excludes foreign storage', async () => {
    native.active = true;
    localStorage.setItem('other-app', 'private');
    gameStorage.setItem('paw-claw.test', 'first');
    gameStorage.setItem('paw-claw.test', 'latest');
    await flushNativeSave();
    const payload = JSON.parse(native.set.mock.calls[native.set.mock.calls.length - 1][0].value);
    expect(payload.values).toEqual({ 'paw-claw.test': 'latest' });
  });
});
