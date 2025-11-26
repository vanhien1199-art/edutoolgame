import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Cloudflare Pages tương thích tốt nhất với output directory là 'dist'
  build: {
    outDir: 'dist',
  }
});