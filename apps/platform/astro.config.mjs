import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

import node from '@astrojs/node';

const tokensPath = fileURLToPath(new URL('./src/styles/tokens.css', import.meta.url));
const tokensCss = readFileSync(tokensPath, 'utf8');
const breakpoints = Object.fromEntries(
  [...tokensCss.matchAll(/--bp-([a-z0-9-]+):\s*([^;]+);/g)].map(([, name, value]) => [
    name,
    value.trim(),
  ]),
);

function breakpointTokens() {
  return {
    postcssPlugin: 'breakpoint-tokens',
    Once(root) {
      root.walkAtRules('media', (atRule) => {
        if (!atRule.params.includes('--bp-')) return;
        atRule.params = atRule.params.replace(
          /--bp-([a-z0-9-]+)/g,
          (match, name) => breakpoints[name] ?? match,
        );
      });
    },
  };
}

export default defineConfig({
  output: 'server',
  site: process.env.ASTRO_SITE,
  adapter: node({
    mode: 'standalone',
  }),
  server: {
    port: 8000,
    host: true,
  },
  vite: {
    ssr: {
      noExternal: ['zod'],
    },
    css: {
      postcss: {
        plugins: [breakpointTokens()],
      },
    },
  },
  
});
