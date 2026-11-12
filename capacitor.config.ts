import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pawandclaw.game',
  appName: 'Paw & Claw',
  webDir: 'dist',
  backgroundColor: '#f4e5c6',
  android: { allowMixedContent: false },
  ios: { contentInset: 'never', preferredContentMode: 'mobile' },
  plugins: {
    SplashScreen: { launchAutoHide: true, launchShowDuration: 800, backgroundColor: '#f4e5c6', showSpinner: false },
    StatusBar: { overlaysWebView: false, backgroundColor: '#f4e5c6', style: 'LIGHT' },
  },
};
export default config;
