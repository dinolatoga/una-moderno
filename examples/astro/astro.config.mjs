import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  base: '/astro/',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'never' },
});
