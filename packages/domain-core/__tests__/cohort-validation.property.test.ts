import { describe, expect } from 'vitest';
import { fc, it } from '@fast-check/vitest';
import { CohortValidator } from '../src/validators/index.js';
import type { CohortDefinition, CohortExpression } from '../src/models/index.js';

// Feature: atlas-v3-hackathon-boilerplate, Property 5: Cohort Validation Correctness
// **Validates: Requirements 4.2**

/**
 * Helper: build a minimal CohortExpression for test scaffolding.
 */
const stubExpression: CohortExpression = {
  Type: 'ALL',
  CriteriaList: [],
  DemographicCriteriaList: [],
  Groups: [],
};

/**
 * Helper: build a full CohortDefinition with the given name.
 */
function makeCohort(name: string): CohortDefinition {
  return {
    id: 1,
    name,
    description: '',
    expressionType: 'SIMPLE_EXPRESSION',
    expression: stubExpression,
    createdDate: new Date().toISOString(),
    modifiedDate: new Date().toISOString(),
  };
}

describe('CohortValidator name validation (Property 5)', () => {
  const validator = new CohortValidator();

  // --- Property 5a: empty names (after trimming) always produce validation errors ---
  it.prop(
    [fc.stringOf(fc.constantFrom(' ', '\t', '\n', '\r'), { minLength: 0, maxLength: 50 })],
    { numRuns: 100 },
  )(
    'whitespace-only or empty names are always invalid',
    (blankName) => {
      const result = validator.validate(makeCohort(blankName));
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === 'REQUIRED_NAME')).toBe(true);
    },
  );

  // --- Property 5b: names longer than 255 chars always produce validation errors ---
  it.prop(
    [fc.string({ minLength: 256, maxLength: 1000 })],
    { numRuns: 100 },
  )(
    'names longer than 255 characters are always invalid',
    (longName) => {
      const result = validator.validate(makeCohort(longName));
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === 'NAME_TOO_LONG')).toBe(true);
    },
  );

  // --- Property 5c: valid names (non-empty after trim, ≤255 chars) always pass ---
  it.prop(
    [
      fc.string({ minLength: 1, maxLength: 255 }).filter((s) => s.trim().length > 0),
    ],
    { numRuns: 100 },
  )(
    'non-empty names of at most 255 characters always pass name validation',
    (validName) => {
      const result = validator.validate(makeCohort(validName));
      const nameErrors = result.errors.filter(
        (e) => e.code === 'REQUIRED_NAME' || e.code === 'NAME_TOO_LONG',
      );
      expect(nameErrors).toHaveLength(0);
    },
  );
});
