import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

const NATIVE_KEY = 'paw-claw.native-save.v1';
const isGameKey = (key: string) => key.startsWith('paw-claw.') || key.startsWith('pawclaw:');
let pending: Promise<void> = Promise.resolve();
let lastError: string | null = null;

function reportFailure() {
  lastError = 'La sauvegarde a échoué. Libère de l’espace puis réessaie avant de quitter le jeu.';
  window.dispatchEvent(new Event('paw-save-error'));
}

function snapshot(): Record<string, string> {
  const result: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && isGameKey(key)) result[key] = localStorage.getItem(key)!;
  }
  return result;
}

export function saveError() { return lastError; }

/** Serialize native writes so an older write can never replace a newer save. */
export function flushNativeSave(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return Promise.resolve();
  const value = JSON.stringify({ version: 1, values: snapshot() });
  const write = pending.catch(() => {}).then(() => Preferences.set({ key: NATIVE_KEY, value }));
  pending = write;
  void write.then(() => { lastError = null; window.dispatchEvent(new Event('paw-save-error')); }, reportFailure);
  return write;
}

/** Called before React mounts: never overwrite native progress with initial values. */
export async function initializeStorage(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  const { value } = await Preferences.get({ key: NATIVE_KEY });
  if (value !== null) {
    const saved = JSON.parse(value);
    if (saved?.version !== 1 || !saved.values || typeof saved.values !== 'object' || Array.isArray(saved.values)) throw new Error('Sauvegarde mobile illisible.');
    const entries = Object.entries(saved.values);
    if (entries.some(([key, entry]) => !isGameKey(key) || typeof entry !== 'string')) throw new Error('Sauvegarde mobile invalide.');
    for (const key of Object.keys(snapshot())) localStorage.removeItem(key);
    for (const [key, entry] of entries) localStorage.setItem(key, entry as string);
  } else {
    await flushNativeSave();
  }
}

/** Synchronous game API with a durable Preferences mirror on Android and iOS. */
export const gameStorage = {
  getItem(key: string) { return localStorage.getItem(key); },
  setItem(key: string, value: string) {
    try { localStorage.setItem(key, value); } catch (error) { reportFailure(); throw error; }
    if (isGameKey(key)) void flushNativeSave().catch(() => {});
  },
  removeItem(key: string) {
    try { localStorage.removeItem(key); } catch (error) { reportFailure(); throw error; }
    if (isGameKey(key)) void flushNativeSave().catch(() => {});
  },
};
