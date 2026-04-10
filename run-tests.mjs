import { startVitest } from 'vitest/node';

const vitest = await startVitest('test', [], {
  run: true,
  config: './vitest.config.ts',
});

await vitest?.close();
