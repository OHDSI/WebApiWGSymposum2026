import type { AtlasApiClient } from '../client.js';
import type { ApiResponse, Concept, ConceptSet } from '../types/index.js';

/**
 * Endpoints for searching concepts and retrieving concept sets
 * via the Atlas WebAPI v3.
 */
export class ConceptEndpoints {
  constructor(private readonly client: AtlasApiClient) {}

  /** Search for concepts matching the given query string. */
  search(query: string): Promise<ApiResponse<Concept[]>> {
    return this.client.post<Concept[]>('/vocabulary/search', { query });
  }

  /** Retrieve a single concept by id. */
  getById(id: number): Promise<ApiResponse<Concept>> {
    return this.client.get<Concept>(`/vocabulary/concept/${id}`);
  }

  /** Retrieve all concept set definitions. */
  getConceptSets(): Promise<ApiResponse<ConceptSet[]>> {
    return this.client.get<ConceptSet[]>('/conceptset');
  }
}
