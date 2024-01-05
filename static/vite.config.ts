import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  envDir:'../',
  plugins: [react()],
  resolve: {
    alias: {
      util: 'util/',
    },
  },
  build: { chunkSizeWarningLimit: 1600 }
})
