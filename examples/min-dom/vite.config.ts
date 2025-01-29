import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsxImportSource: '@simple-data-open/min-dom',
    jsx: 'automatic',
  },
});
