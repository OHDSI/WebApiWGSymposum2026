import { defineConfig, type UserConfig } from 'vite';

export interface BaseConfigOptions {
  react?: boolean;
}

export function createBaseConfig(options?: BaseConfigOptions): UserConfig {
  return defineConfig({
    build: {
      target: 'es2022',
      sourcemap: true,
    },
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
  });
}
