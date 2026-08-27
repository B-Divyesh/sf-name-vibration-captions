import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'in.sociobot.nametap',
  appName: 'Name Tap',
  webDir: 'dist',
  backgroundColor: '#F4F0E6',
  android: {
    backgroundColor: '#F4F0E6',
    allowMixedContent: false,
    captureInput: false,
    webContentsDebuggingEnabled: false
  }
};

export default config;
