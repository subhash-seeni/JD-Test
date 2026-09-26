import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // Ensures assets load correctly on GitHub Pages under subpaths
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
});
