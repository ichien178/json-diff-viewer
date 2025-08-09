import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoBase = process.env.VITE_BASE || '/';

export default defineConfig({
  plugins: [react()],
  // Use repo base path on CI (GitHub Pages), keep '/' locally for dev
  base: process.env.CI ? repoBase : '/',
});
