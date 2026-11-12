import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pawandclaw.game',
  appName: 'Paw & Claw',
  webDir: 'dist',
  backgroundColor: '#1b2941',
  android: { allowMixedContent: false },
  ios: { contentInset: 'never', preferredContentMode: 'mobile' },
  plugins: {
    SplashScreen: { launchAutoHide: true, launchShowDuration: 800, backgroundColor: '#1b2941', showSpinner: false },
    StatusBar: { overlaysWebView: false, backgroundColor: '#1b2941', style: 'DARK' },
  },
};
export default config;
