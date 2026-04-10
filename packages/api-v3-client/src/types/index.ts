// ---------------------------------------------------------------------------
// API Client Configuration
// ---------------------------------------------------------------------------

/** Configuration for initialising the Atlas V3 API client. */
export interface ApiClientConfig {
  /** Base URL of the WebAPI instance (e.g. "https://api.example.com/WebAPI"). */
  baseUrl: string;
  /** Optional default headers sent with every request. */
  headers?: Record<string, string>;
  /** Request timeout in milliseconds. Defaults to 30 000. */
  timeout?: number;
}

// ---------------------------------------------------------------------------
// Generic API Response / Error
// ---------------------------------------------------------------------------

/** Typed wrapper around an HTTP response from the API. */
export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

/** Unified error thrown by the API client for any non-2xx response. */
export class ApiError extends Error {
  /** HTTP status code returned by the server. */
  readonly status: number;
  /** Raw response body (may be JSON or plain text). */
  readonly body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

// ---------------------------------------------------------------------------
// Domain Types – Cohort
// ---------------------------------------------------------------------------


/** A cohort definition as returned by the WebAPI /cohortdefinition endpoints. */
export interface CohortDefinition {
  /** Server-assigned identifier. */
  id: number;
  /** Human-readable name of the cohort. */
  name: string;
  /** Optional description. */
  description?: string;
  /** JSON expression that defines the cohort logic. */
  expression: string;
  /** User who created the definition. */
  createdBy?: string;
  /** ISO-8601 creation timestamp. */
  createdDate?: string;
  /** User who last modified the definition. */
  modifiedBy?: string;
  /** ISO-8601 last-modified timestamp. */
  modifiedDate?: string;
}

// ---------------------------------------------------------------------------
// Domain Types – Concept / ConceptSet
// ---------------------------------------------------------------------------

/** A single OMOP concept record. */
export interface Concept {
  conceptId: number;
  conceptName: string;
  domainId: string;
  vocabularyId: string;
  conceptClassId: string;
  standardConcept?: string;
  conceptCode: string;
}

/** A concept set definition as returned by the WebAPI. */
export interface ConceptSet {
  /** Server-assigned identifier. */
  id: number;
  /** Human-readable name. */
  name: string;
  /** Optional description. */
  description?: string;
  /** JSON expression describing the concept set items. */
  expression: string;
}
