import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  base: '/astro/',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'never' },
  // Preserve selected-only artwork requests instead of embedding every SVG in CSS.
  vite: { build: { assetsInlineLimit: 0 } },
});
