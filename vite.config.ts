import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    watch: {
      ignored: [
        '**/dist/**',
        '**/.git/**',
        '**/supabase/**',
        '**/assets/**',
        '**/*.png',
        '**/*.webp',
        '**/*.jpg',
        '**/*.jpeg'
      ]
    }
  }
});
