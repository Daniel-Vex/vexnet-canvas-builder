import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.4b479b4c84e240a4ab69e3f1182686c6',
  appName: 'vexnet-canvas-builder',
  webDir: 'dist',
  server: {
    url: 'https://4b479b4c-84e2-40a4-ab69-e3f1182686c6.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;