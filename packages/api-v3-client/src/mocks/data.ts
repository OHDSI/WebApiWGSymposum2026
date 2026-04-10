import type { CohortDefinition, Concept, ConceptSet } from '../types/index.js';

// ---------------------------------------------------------------------------
// Counter for generating unique IDs
// ---------------------------------------------------------------------------
let nextId = 1;

/** Reset the ID counter (useful in tests). */
export function resetIdCounter(start = 1): void {
  nextId = start;
}

// ---------------------------------------------------------------------------
// Mock Data Factories
// ---------------------------------------------------------------------------

/** Create a mock {@link CohortDefinition} with sensible defaults. */
export function createMockCohort(
  overrides: Partial<CohortDefinition> = {},
): CohortDefinition {
  const id = overrides.id ?? nextId++;
  return {
    id,
    name: `Cohort ${id}`,
    description: `Description for cohort ${id}`,
    expression: JSON.stringify({ Type: 'ALL', CriteriaList: [] }),
    createdBy: 'mock-user',
    createdDate: new Date().toISOString(),
    modifiedBy: 'mock-user',
    modifiedDate: new Date().toISOString(),
    ...overrides,
  };
}

/** Create a mock {@link Concept}. */
export function createMockConcept(
  overrides: Partial<Concept> = {},
): Concept {
  const conceptId = overrides.conceptId ?? nextId++;
  return {
    conceptId,
    conceptName: `Concept ${conceptId}`,
    domainId: 'Condition',
    vocabularyId: 'SNOMED',
    conceptClassId: 'Clinical Finding',
    standardConcept: 'S',
    conceptCode: `${100_000 + conceptId}`,
    ...overrides,
  };
}

/** Create a mock {@link ConceptSet}. */
export function createMockConceptSet(
  overrides: Partial<ConceptSet> = {},
): ConceptSet {
  const id = overrides.id ?? nextId++;
  return {
    id,
    name: `Concept Set ${id}`,
    description: `Description for concept set ${id}`,
    expression: JSON.stringify({ items: [] }),
    ...overrides,
  };
}
