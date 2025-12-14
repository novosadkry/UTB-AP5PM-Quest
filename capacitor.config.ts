import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'UTB-AP5PM-Quest',
  webDir: 'dist',
  plugins: {
    FirebaseAuthentication: {
      authDomain: undefined,
      skipNativeAuth: false,
      providers: ['google.com']
    }
  }
};

export default config;
