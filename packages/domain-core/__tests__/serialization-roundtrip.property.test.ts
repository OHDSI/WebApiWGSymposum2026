import { describe, expect } from 'vitest';
import { fc, it } from '@fast-check/vitest';
import { CohortSerializer } from '../src/serializers/index.js';
import type { CohortDefinition, CohortExpression } from '../src/models/index.js';

// Feature: atlas-v3-hackathon-boilerplate, Property 6: Domain Model Serialization Round-Trip
// **Validates: Requirements 4.3**

/**
 * Arbitrary for NumericRange.
 */
const arbNumericRange = fc.record({
  Value: fc.integer(),
  Op: fc.constantFrom('gt', 'gte', 'lt', 'lte', 'eq', 'bt'),
  Extent: fc.option(fc.integer(), { nil: undefined }),
});

/**
 * Arbitrary for DateRange.
 */
const arbDateRange = fc.record({
  Value: fc.string({ minLength: 1, maxLength: 20 }),
  Op: fc.constantFrom('gt', 'gte', 'lt', 'lte', 'eq', 'bt'),
  Extent: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined }),
});

/**
 * Arbitrary for Criterion.
 */
const arbCriterion = fc.record({
  ConditionOccurrence: fc.option(
    fc.record({
      CodesetId: fc.option(fc.nat(), { nil: undefined }),
      First: fc.option(fc.boolean(), { nil: undefined }),
      OccurrenceStartDate: fc.option(arbDateRange, { nil: undefined }),
      OccurrenceEndDate: fc.option(arbDateRange, { nil: undefined }),
      Age: fc.option(arbNumericRange, { nil: undefined }),
    }),
    { nil: undefined },
  ),
  DrugExposure: fc.option(
    fc.record({
      CodesetId: fc.option(fc.nat(), { nil: undefined }),
      First: fc.option(fc.boolean(), { nil: undefined }),
      OccurrenceStartDate: fc.option(arbDateRange, { nil: undefined }),
      OccurrenceEndDate: fc.option(arbDateRange, { nil: undefined }),
      DaysSupply: fc.option(arbNumericRange, { nil: undefined }),
    }),
    { nil: undefined },
  ),
});


/**
 * Arbitrary for CriteriaGroup.
 */
const arbCriteriaGroup = fc.record({
  Criteria: fc.array(arbCriterion, { maxLength: 3 }),
  Type: fc.constantFrom('ALL', 'ANY', 'AT_LEAST'),
  Count: fc.option(fc.nat({ max: 10 }), { nil: undefined }),
});

/**
 * Arbitrary for ConceptFilter.
 */
const arbConceptFilter = fc.record({
  CONCEPT_ID: fc.nat(),
  CONCEPT_NAME: fc.option(fc.string({ maxLength: 50 }), { nil: undefined }),
});

/**
 * Arbitrary for DemographicCriteria.
 */
const arbDemographicCriteria = fc.record({
  Age: fc.option(arbNumericRange, { nil: undefined }),
  Gender: fc.option(fc.array(arbConceptFilter, { maxLength: 2 }), { nil: undefined }),
  Race: fc.option(fc.array(arbConceptFilter, { maxLength: 2 }), { nil: undefined }),
  Ethnicity: fc.option(fc.array(arbConceptFilter, { maxLength: 2 }), { nil: undefined }),
});

/**
 * Arbitrary for ExpressionGroup (non-recursive to keep generation bounded).
 */
const arbExpressionGroup = fc.record({
  Type: fc.constantFrom('ALL', 'ANY'),
  CriteriaList: fc.array(arbCriteriaGroup, { maxLength: 2 }),
  DemographicCriteriaList: fc.array(arbDemographicCriteria, { maxLength: 1 }),
  Groups: fc.constant([]),
});

/**
 * Arbitrary for CohortExpression.
 */
const arbCohortExpression: fc.Arbitrary<CohortExpression> = fc.record({
  Type: fc.constantFrom('ALL', 'ANY'),
  CriteriaList: fc.array(arbCriteriaGroup, { maxLength: 3 }),
  DemographicCriteriaList: fc.array(arbDemographicCriteria, { maxLength: 2 }),
  Groups: fc.array(arbExpressionGroup, { maxLength: 2 }),
});

/**
 * Arbitrary for CohortDefinition — generates valid instances
 * that can survive a JSON round-trip through CohortSerializer.
 */
const arbCohortDefinition: fc.Arbitrary<CohortDefinition> = fc.record({
  id: fc.nat(),
  name: fc.string({ minLength: 1, maxLength: 255 }),
  description: fc.string({ maxLength: 500 }),
  expressionType: fc.constantFrom('SIMPLE_EXPRESSION', 'CUSTOM'),
  expression: arbCohortExpression,
  createdDate: fc.date().map((d) => d.toISOString()),
  modifiedDate: fc.date().map((d) => d.toISOString()),
});

describe('CohortSerializer round-trip (Property 6)', () => {
  const serializer = new CohortSerializer();

  it.prop([arbCohortDefinition], { numRuns: 100 })(
    'serialize then deserialize produces an equivalent object',
    (cohort) => {
      const serialized = serializer.serialize(cohort);
      const deserialized = serializer.deserialize(serialized);
      expect(deserialized).toEqual(cohort);
    },
  );
});
