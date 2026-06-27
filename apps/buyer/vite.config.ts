import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { resolveViteBase } from './src/config/resolveViteBase';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: resolveViteBase(env.VITE_BASE_PATH),
    plugins: [react(), tailwindcss()],
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
