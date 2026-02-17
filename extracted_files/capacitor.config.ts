
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mamo.tools',
  appName: 'خردوات المامو',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Permissions: {
      display: 'prompt' // Ask for permissions automatically
    }
  }
};

export default config;
