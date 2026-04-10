import { setupServer } from 'msw/node';
import { handlers } from './handlers.js';

/**
 * Create an MSW server instance for Node.js testing environments.
 *
 * Usage in tests:
 * ```ts
 * import { setupMockServer } from '@atlas-v3/api-v3-client/mocks';
 *
 * const server = setupMockServer();
 * beforeAll(() => server.listen());
 * afterEach(() => server.resetHandlers());
 * afterAll(() => server.close());
 * ```
 */
export function setupMockServer() {
  return setupServer(...handlers);
}
