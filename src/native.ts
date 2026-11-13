import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { flushNativeSave, gameStorage } from './data/storage';

export async function initializeNative() {
  if (!Capacitor.isNativePlatform()) return;
  document.documentElement.classList.add('native-game');
  await App.addListener('appStateChange', ({ isActive }) => {
    if (isActive) window.dispatchEvent(new Event('paw-resume'));
    else void flushNativeSave().catch(() => {});
  });
  await App.addListener('backButton', () => {
    const modal = document.querySelector('dialog[open]');
    if (modal) { modal.dispatchEvent(new Event('cancel', { cancelable: true })); return; }
    const event = new Event('paw-back', { cancelable: true });
    window.dispatchEvent(event);
    if (!event.defaultPrevented) void App.minimizeApp();
  });
}

export function tactileFeedback() {
  if (!Capacitor.isNativePlatform() || gameStorage.getItem('paw-claw.haptics') === 'off') return;
  void Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
}
