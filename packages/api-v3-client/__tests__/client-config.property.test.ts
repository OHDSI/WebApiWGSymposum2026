import { describe, expect } from 'vitest';
import { fc, it } from '@fast-check/vitest';
import { AtlasApiClient } from '../src/client.js';
import type { ApiClientConfig } from '../src/types/index.js';

// Feature: atlas-v3-hackathon-boilerplate, Property 3: API Client Config Preservation
// **Validates: Requirements 3.1**

/**
 * Arbitrary generator for ApiClientConfig.
 * - baseUrl: non-empty URL-like string (may have trailing slashes)
 * - headers: optional record of string key-value pairs
 * - timeout: optional positive integer in ms
 */
const arbApiClientConfig = fc.record(
  {
    baseUrl: fc.webUrl(),
    headers: fc.dictionary(
      fc.string({ minLength: 1, maxLength: 32 }),
      fc.string({ maxLength: 128 }),
    ),
    timeout: fc.nat({ max: 120_000 }),
  },
  { requiredKeys: ['baseUrl'] },
) as fc.Arbitrary<ApiClientConfig>;

describe('AtlasApiClient config preservation (Property 3)', () => {
  it.prop([arbApiClientConfig], { numRuns: 100 })(
    'preserves the supplied ApiClientConfig after initialisation',
    (config) => {
      const client = new AtlasApiClient(config);
      const retrieved = client.getConfig();

      // baseUrl: constructor strips trailing slashes, so compare normalised value
      const expectedBaseUrl = config.baseUrl.replace(/\/+$/, '');
      expect(retrieved.baseUrl).toBe(expectedBaseUrl);

      // headers: should match input (defaulting to {} when undefined)
      expect(retrieved.headers).toEqual(config.headers ?? {});

      // timeout: should match input (defaulting to 30_000 when undefined)
      expect(retrieved.timeout).toBe(config.timeout ?? 30_000);

      // returned config should be a copy, not the same reference
      expect(retrieved).not.toBe((client as any).config);
    },
  );
});
