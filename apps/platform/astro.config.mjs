// @ts-check
import { defineConfig } from 'astro/config';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'http://localhost:8000',
  adapter: node({
    mode: 'standalone'
  }),
  server: {
    port: 8000,
    host: true,
  }
});
