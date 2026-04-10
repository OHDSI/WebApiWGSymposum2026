// @atlas-v3/domain-core - Domain Services

import type { CohortEndpoints } from '@atlas-v3/api-v3-client';
import type {
  CohortDefinition,
  CreateCohortInput,
  UpdateCohortInput,
  ValidationResult,
  CohortExpression,
} from '../models/index.js';
import { CohortValidator } from '../validators/index.js';

// ---------------------------------------------------------------------------
// API ↔ Domain mapping helpers
// ---------------------------------------------------------------------------

/**
 * Maps an API-level cohort (expression stored as JSON string) to a
 * domain-level {@link CohortDefinition} (expression parsed into an object).
 */
function toDomainCohort(api: {
  id: number;
  name: string;
  description?: string;
  expression?: string | object;
  createdDate?: string;
  modifiedDate?: string;
}): CohortDefinition {
  let expression: CohortExpression;

  if (typeof api.expression === 'string') {
    try {
      expression = JSON.parse(api.expression) as CohortExpression;
    } catch {
      console.warn(`[toDomainCohort] Failed to parse expression JSON for cohort ${api.id}. Falling back to empty.`);
      expression = { Type: 'ALL', CriteriaList: [], DemographicCriteriaList: [], Groups: [] };
    }
  } else if (api.expression && typeof api.expression === 'object') {
    expression = api.expression as unknown as CohortExpression;
  } else {
    expression = { Type: 'ALL', CriteriaList: [], DemographicCriteriaList: [], Groups: [] };
  }

  return {
    id: api.id,
    name: api.name,
    description: api.description ?? '',
    expressionType: 'SIMPLE_EXPRESSION',
    expression,
    createdDate: api.createdDate ?? '',
    modifiedDate: api.modifiedDate ?? '',
  };
}

/**
 * Maps a domain-level {@link CohortDefinition} back to the API payload shape
 * (expression serialised as a JSON string).
 */
function toApiPayload(domain: {
  name: string;
  description?: string;
  expressionType?: string;
  expression: CohortExpression;
}): { name: string; description: string; expression: string } {
  return {
    name: domain.name,
    description: domain.description ?? '',
    expression: JSON.stringify(domain.expression),
  };
}


// ---------------------------------------------------------------------------
// CohortService interface
// ---------------------------------------------------------------------------

/** Domain service contract for cohort operations. */
export interface ICohortService {
  list(): Promise<CohortDefinition[]>;
  get(id: number): Promise<CohortDefinition>;
  create(input: CreateCohortInput): Promise<CohortDefinition>;
  update(id: number, input: UpdateCohortInput): Promise<CohortDefinition>;
  remove(id: number): Promise<void>;
  validate(definition: CohortDefinition): ValidationResult;
}

// ---------------------------------------------------------------------------
// CohortService implementation
// ---------------------------------------------------------------------------

/**
 * Domain service that orchestrates cohort CRUD operations.
 *
 * - Delegates HTTP communication to {@link CohortEndpoints} from api-v3-client
 * - Runs domain-level validation via {@link CohortValidator} before mutations
 * - Maps between API-level DTOs and domain models
 */
export class CohortService implements ICohortService {
  private readonly endpoints: CohortEndpoints;
  private readonly validator: CohortValidator;

  constructor(endpoints: CohortEndpoints) {
    this.endpoints = endpoints;
    this.validator = new CohortValidator();
  }

  /** Fetch all cohort definitions and map them to domain models. */
  async list(): Promise<CohortDefinition[]> {
    const response = await this.endpoints.getAll();
    return response.data.map(toDomainCohort);
  }

  /** Fetch a single cohort definition by id. */
  async get(id: number): Promise<CohortDefinition> {
    const response = await this.endpoints.getById(id);
    return toDomainCohort(response.data);
  }

  /**
   * Validate and create a new cohort definition.
   *
   * Builds a temporary domain model for validation, then sends the
   * API-level payload to the server.
   *
   * @throws {Error} if validation fails.
   */
  async create(input: CreateCohortInput): Promise<CohortDefinition> {
    const candidate: CohortDefinition = {
      id: 0,
      name: input.name,
      description: input.description ?? '',
      expressionType: input.expressionType,
      expression: input.expression,
      createdDate: '',
      modifiedDate: '',
    };

    const result = this.validator.validate(candidate);
    if (!result.valid) {
      const messages = result.errors.map((e) => `${e.field}: ${e.message}`).join('; ');
      throw new Error(`Validation failed: ${messages}`);
    }

    const payload = toApiPayload(input);
    const response = await this.endpoints.create(payload as any);
    return toDomainCohort(response.data);
  }

  /**
   * Validate and update an existing cohort definition.
   *
   * Fetches the current state, merges the partial update, validates,
   * then sends the update to the server.
   *
   * @throws {Error} if validation fails.
   */
  async update(id: number, input: UpdateCohortInput): Promise<CohortDefinition> {
    // Fetch current state to merge with partial update
    const current = await this.get(id);

    const merged: CohortDefinition = {
      ...current,
      name: input.name ?? current.name,
      description: input.description ?? current.description,
      expressionType: input.expressionType ?? current.expressionType,
      expression: input.expression ?? current.expression,
    };

    const result = this.validator.validate(merged);
    if (!result.valid) {
      const messages = result.errors.map((e) => `${e.field}: ${e.message}`).join('; ');
      throw new Error(`Validation failed: ${messages}`);
    }

    const payload = toApiPayload(merged);
    const response = await this.endpoints.update(id, payload as any);
    return toDomainCohort(response.data);
  }

  /** Delete a cohort definition by id. */
  async remove(id: number): Promise<void> {
    await this.endpoints.delete(id);
  }

  /** Run domain-level validation on a cohort definition. */
  validate(definition: CohortDefinition): ValidationResult {
    return this.validator.validate(definition);
  }
}
