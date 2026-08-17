import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.engelsma.almaniac',
  appName: 'Almaniac',
  webDir: 'dist',
  ios: {
    scrollEnabled: false,
    backgroundColor: '#faf9f4',
    contentInset: 'never',
    preferredContentMode: 'mobile',
  },
  android: {
    backgroundColor: '#faf9f4',
    scrollEnabled: false,
  },
  plugins: {
    SystemBars: {
      // Avoid WebView-parent padding on API 35+; it skews touch coords on tablets.
      insetsHandling: 'disable',
    },
  },
};

export default config;
