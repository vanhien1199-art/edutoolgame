import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Dấu chấm trỏ vào src giúp import ngắn gọn
    },
  },
  build: {
    outDir: 'dist',
  }
});
