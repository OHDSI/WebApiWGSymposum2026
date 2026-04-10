import { http, HttpResponse } from 'msw';
import type { CohortDefinition } from '../types/index.js';
import {
  createMockCohort,
  createMockConcept,
  createMockConceptSet,
} from './data.js';

// ---------------------------------------------------------------------------
// In-memory stores (reset between tests via `resetMockStores`)
// ---------------------------------------------------------------------------

let cohorts: CohortDefinition[] = [
  createMockCohort({ id: 1, name: 'Type 2 Diabetes' }),
  createMockCohort({ id: 2, name: 'Hypertension' }),
  createMockCohort({ id: 3, name: 'Heart Failure' }),
];

let nextCohortId = 4;

const concepts = [
  createMockConcept({ conceptId: 201826, conceptName: 'Type 2 diabetes mellitus', domainId: 'Condition', vocabularyId: 'SNOMED' }),
  createMockConcept({ conceptId: 320128, conceptName: 'Essential hypertension', domainId: 'Condition', vocabularyId: 'SNOMED' }),
  createMockConcept({ conceptId: 316139, conceptName: 'Heart failure', domainId: 'Condition', vocabularyId: 'SNOMED' }),
];

const conceptSets = [
  createMockConceptSet({ id: 1, name: 'Diabetes Conditions' }),
  createMockConceptSet({ id: 2, name: 'Cardiovascular Conditions' }),
];

/** Reset all in-memory mock stores to their initial state. */
export function resetMockStores(): void {
  nextCohortId = 4;
  cohorts = [
    createMockCohort({ id: 1, name: 'Type 2 Diabetes' }),
    createMockCohort({ id: 2, name: 'Hypertension' }),
    createMockCohort({ id: 3, name: 'Heart Failure' }),
  ];
}


// ---------------------------------------------------------------------------
// Cohort Handlers
// ---------------------------------------------------------------------------

const cohortHandlers = [
  /** GET /cohortdefinition — list all cohort definitions */
  http.get('*/cohortdefinition', () => {
    return HttpResponse.json(cohorts);
  }),

  /** GET /cohortdefinition/:id — get a single cohort definition */
  http.get('*/cohortdefinition/:id', ({ params }) => {
    const id = Number(params.id);
    const cohort = cohorts.find((c) => c.id === id);
    if (!cohort) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(cohort);
  }),

  /** POST /cohortdefinition — create a new cohort definition */
  http.post('*/cohortdefinition', async ({ request }) => {
    const body = (await request.json()) as Omit<CohortDefinition, 'id'>;
    const created = createMockCohort({
      ...body,
      id: nextCohortId++,
      createdDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString(),
    });
    cohorts.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),

  /** PUT /cohortdefinition/:id — update an existing cohort definition */
  http.put('*/cohortdefinition/:id', async ({ params, request }) => {
    const id = Number(params.id);
    const idx = cohorts.findIndex((c) => c.id === id);
    if (idx === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    const body = (await request.json()) as Partial<CohortDefinition>;
    cohorts[idx] = {
      ...cohorts[idx],
      ...body,
      id, // preserve original id
      modifiedDate: new Date().toISOString(),
    };
    return HttpResponse.json(cohorts[idx]);
  }),

  /** DELETE /cohortdefinition/:id — delete a cohort definition */
  http.delete('*/cohortdefinition/:id', ({ params }) => {
    const id = Number(params.id);
    const idx = cohorts.findIndex((c) => c.id === id);
    if (idx === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    cohorts.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];

// ---------------------------------------------------------------------------
// Concept Handlers
// ---------------------------------------------------------------------------

const conceptHandlers = [
  /** POST /vocabulary/search — search concepts by query */
  http.post('*/vocabulary/search', async ({ request }) => {
    const body = (await request.json()) as { query: string };
    const query = (body.query ?? '').toLowerCase();
    const results = concepts.filter((c) =>
      c.conceptName.toLowerCase().includes(query),
    );
    return HttpResponse.json(results);
  }),

  /** GET /vocabulary/concept/:id — get a single concept */
  http.get('*/vocabulary/concept/:id', ({ params }) => {
    const id = Number(params.id);
    const concept = concepts.find((c) => c.conceptId === id);
    if (!concept) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(concept);
  }),

  /** GET /conceptset — list all concept sets */
  http.get('*/conceptset', () => {
    return HttpResponse.json(conceptSets);
  }),
];

// ---------------------------------------------------------------------------
// Combined handlers export
// ---------------------------------------------------------------------------

/** All MSW request handlers for the Atlas V3 API mock. */
export const handlers = [...cohortHandlers, ...conceptHandlers];
