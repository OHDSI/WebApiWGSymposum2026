import { setupMockWorker } from '@atlas-v3/api-v3-client/mocks';

/**
 * Initialize the MSW browser worker with Atlas V3 API mock handlers.
 * Call this before rendering the React app when running in mock mode.
 */
export async function initMockMode(): Promise<void> {
  const worker = setupMockWorker();
  await worker.start({ onUnhandledRequest: 'bypass' });
  console.log('[MSW] Mock mode enabled — API requests will be intercepted.');
}
