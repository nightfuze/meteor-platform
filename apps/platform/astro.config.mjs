import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig, envField } from 'astro/config';
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
  env: {
    schema: {
      MONGO_HOST: envField.string({ context: 'server', access: 'secret', default: 'localhost' }),
      MONGO_PORT: envField.string({ context: 'server', access: 'secret', default: '27017' }),
      MONGO_ROOT_USER: envField.string({ context: 'server', access: 'secret' }),
      MONGO_ROOT_PASSWORD: envField.string({ context: 'server', access: 'secret' }),
      DATABASE_NAME: envField.string({ context: 'server', access: 'secret' }),
      MONGO_AUTH_SOURCE: envField.string({ context: 'server', access: 'secret', default: 'admin' }),
      MONGODB_URI: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  vite: {
    ssr: {
      noExternal:
        process.env.NODE_ENV === 'production'
          ? ['zod', 'mongodb', '@meteor/db', '@meteor/types']
          : ['zod', '@meteor/db', '@meteor/types'],
      external: process.env.NODE_ENV === 'production' ? [] : ['mongodb'],
    },
    envDir: '../../',
    css: {
      postcss: {
        plugins: [breakpointTokens()],
      },
    },
  },
});
