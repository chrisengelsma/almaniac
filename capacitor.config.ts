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
      insetsHandling: 'css',
    },
  },
};

export default config;
