import { setupWorker } from 'msw/browser';
import { handlers } from './handlers.js';

/**
 * Create an MSW worker instance for browser environments.
 *
 * Usage in app entry point:
 * ```ts
 * import { setupMockWorker } from '@atlas-v3/api-v3-client/mocks';
 *
 * if (import.meta.env.VITE_MOCK_MODE === 'true') {
 *   const worker = setupMockWorker();
 *   await worker.start({ onUnhandledRequest: 'bypass' });
 * }
 * ```
 */
export function setupMockWorker() {
  return setupWorker(...handlers);
}
