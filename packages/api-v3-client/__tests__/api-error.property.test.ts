import { describe, expect, vi, beforeEach, afterEach } from 'vitest';
import { fc, it } from '@fast-check/vitest';
import { AtlasApiClient } from '../src/client.js';
import { ApiError } from '../src/types/index.js';

// Feature: atlas-v3-hackathon-boilerplate, Property 4: Unified API Error Handling
// **Validates: Requirements 3.3**

/**
 * Arbitrary generator for HTTP error status codes (4xx and 5xx).
 */
const arbErrorStatus = fc.integer({ min: 400, max: 599 });

/**
 * Arbitrary generator for an optional JSON error body.
 */
const arbErrorBody = fc.oneof(
  fc.record({
    code: fc.string({ minLength: 1, maxLength: 32 }),
    message: fc.string({ maxLength: 128 }),
  }),
  fc.constant(undefined),
);

/**
 * Arbitrary generator for HTTP status text.
 */
const arbStatusText = fc.string({ minLength: 1, maxLength: 64 });

describe('AtlasApiClient unified error handling (Property 4)', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    // Ensure a clean fetch mock for each run
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    globalThis.fetch = originalFetch;
  });

  it.prop([arbErrorStatus, arbErrorBody, arbStatusText], { numRuns: 100 })(
    'throws ApiError with correct status for any HTTP error status (4xx/5xx)',
    async (status, errorBody, statusText) => {
      // Arrange: mock fetch to return an error response
      const hasJsonBody = errorBody !== undefined;
      const mockResponse = {
        ok: false,
        status,
        statusText,
        json: hasJsonBody
          ? () => Promise.resolve(errorBody)
          : () => Promise.reject(new SyntaxError('No JSON')),
        text: () => Promise.resolve(statusText),
        headers: new Headers(),
      } as unknown as Response;

      vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse);

      const client = new AtlasApiClient({ baseUrl: 'https://api.example.com' });

      // Act & Assert
      try {
        await client.get('/test');
        // Should never reach here
        expect.unreachable('Expected ApiError to be thrown');
      } catch (error) {
        // The error must be an instance of ApiError
        expect(error).toBeInstanceOf(ApiError);

        const apiError = error as ApiError;

        // Status code must match the HTTP status
        expect(apiError.status).toBe(status);

        // Error name must be 'ApiError'
        expect(apiError.name).toBe('ApiError');

        // Message must contain the HTTP status code
        expect(apiError.message).toContain(String(status));

        // Body must match: JSON body when parseable, statusText fallback otherwise
        if (hasJsonBody) {
          expect(apiError.body).toEqual(errorBody);
        } else {
          expect(apiError.body).toBe(statusText);
        }
      }
    },
  );
});
