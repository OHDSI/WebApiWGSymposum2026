import type { AtlasApiClient } from '../client.js';
import type { ApiResponse, CohortDefinition } from '../types/index.js';

/**
 * Endpoints for managing cohort definitions via the Atlas WebAPI v3.
 */
export class CohortEndpoints {
  constructor(private readonly client: AtlasApiClient) {}

  /** Retrieve all cohort definitions. */
  getAll(): Promise<ApiResponse<CohortDefinition[]>> {
    return this.client.get<CohortDefinition[]>('/cohortdefinition');
  }

  /** Retrieve a single cohort definition by id. */
  getById(id: number): Promise<ApiResponse<CohortDefinition>> {
    return this.client.get<CohortDefinition>(`/cohortdefinition/${id}`);
  }

  /** Create a new cohort definition. */
  create(cohort: Omit<CohortDefinition, 'id'>): Promise<ApiResponse<CohortDefinition>> {
    return this.client.post<CohortDefinition>('/cohortdefinition', cohort);
  }

  /** Update an existing cohort definition. */
  update(id: number, cohort: Partial<CohortDefinition>): Promise<ApiResponse<CohortDefinition>> {
    return this.client.put<CohortDefinition>(`/cohortdefinition/${id}`, cohort);
  }

  /** Delete a cohort definition by id. */
  delete(id: number): Promise<ApiResponse<void>> {
    return this.client.delete<void>(`/cohortdefinition/${id}`);
  }
}
