import { type UserConfig } from 'vite';
import { createBaseConfig, type BaseConfigOptions } from './vite.config.base';

export interface LibConfigOptions extends BaseConfigOptions {
  entry?: string;
  name?: string;
  formats?: ('es' | 'cjs')[];
}

export function createLibConfig(options?: LibConfigOptions): UserConfig {
  const base = createBaseConfig(options);
  return {
    ...base,
    build: {
      ...base.build,
      lib: {
        entry: options?.entry ?? 'src/index.ts',
        name: options?.name,
        formats: options?.formats ?? ['es', 'cjs'],
      },
      rollupOptions: {
        external: ['react', 'react-dom'],
      },
    },
  };
}
