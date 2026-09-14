import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/**/index.ts'],
  format: ['esm'],
  dts: false,
  external: [
    '@aws-sdk/lib-dynamodb',
    '@aws-sdk/client-dynamodb',
    '@aliaskeep/core',
    '@aliaskeep/services',
    'ulid',
  ],
  tsconfig: './tsconfig.json',
});
