// @atlas-v3/domain-core - Domain Models
// Pure TypeScript types — no UI framework dependencies.

// ---------------------------------------------------------------------------
// Criterion — individual criterion within a criteria group
// ---------------------------------------------------------------------------

/** Condition occurrence criterion details. */
export interface ConditionOccurrence {
  CodesetId?: number;
  First?: boolean;
  OccurrenceStartDate?: DateRange;
  OccurrenceEndDate?: DateRange;
  Age?: NumericRange;
}

/** Drug exposure criterion details. */
export interface DrugExposure {
  CodesetId?: number;
  First?: boolean;
  OccurrenceStartDate?: DateRange;
  OccurrenceEndDate?: DateRange;
  DaysSupply?: NumericRange;
}

/** A date range filter used in criteria. */
export interface DateRange {
  Value: string;
  Op: string;
  Extent?: string;
}

/** A numeric range filter used in criteria. */
export interface NumericRange {
  Value: number;
  Op: string;
  Extent?: number;
}

/**
 * An individual criterion in a cohort expression.
 * Exactly one of the domain-specific fields should be set.
 */
export interface Criterion {
  ConditionOccurrence?: ConditionOccurrence;
  DrugExposure?: DrugExposure;
}

// ---------------------------------------------------------------------------
// CriteriaGroup — logical grouping of criteria
// ---------------------------------------------------------------------------

/** A group of criteria combined with a logical operator. */
export interface CriteriaGroup {
  /** The criteria in this group. */
  Criteria: Criterion[];
  /** Logical grouping type (e.g. "ALL", "ANY", "AT_LEAST"). */
  Type: string;
  /** Required count when Type is "AT_LEAST" or similar. */
  Count?: number;
}

// ---------------------------------------------------------------------------
// Supporting expression types
// ---------------------------------------------------------------------------

/** Demographic criteria (age, gender, race, etc.). */
export interface DemographicCriteria {
  Age?: NumericRange;
  Gender?: ConceptFilter[];
  Race?: ConceptFilter[];
  Ethnicity?: ConceptFilter[];
}

/** A concept-based filter value. */
export interface ConceptFilter {
  CONCEPT_ID: number;
  CONCEPT_NAME?: string;
}

/** A nested expression group for complex logic. */
export interface ExpressionGroup {
  Type: string;
  CriteriaList: CriteriaGroup[];
  DemographicCriteriaList: DemographicCriteria[];
  Groups: ExpressionGroup[];
}

// ---------------------------------------------------------------------------
// CohortExpression — the full expression tree
// ---------------------------------------------------------------------------

/** Expression tree that defines cohort inclusion logic. */
export interface CohortExpression {
  /** Top-level logical operator (e.g. "ALL"). */
  Type: string;
  /** Primary criteria groups. */
  CriteriaList: CriteriaGroup[];
  /** Demographic criteria applied at the top level. */
  DemographicCriteriaList: DemographicCriteria[];
  /** Nested sub-groups for complex boolean logic. */
  Groups: ExpressionGroup[];
}

// ---------------------------------------------------------------------------
// CohortDefinition — the top-level domain model
// ---------------------------------------------------------------------------

/** Full domain representation of a cohort definition. */
export interface CohortDefinition {
  /** Server-assigned identifier. */
  id: number;
  /** Human-readable name. */
  name: string;
  /** Optional description of the cohort. */
  description: string;
  /** Expression type discriminator (e.g. "SIMPLE_EXPRESSION", "CUSTOM"). */
  expressionType: string;
  /** Parsed expression tree (domain-level, not raw JSON string). */
  expression: CohortExpression;
  /** ISO-8601 creation timestamp. */
  createdDate: string;
  /** ISO-8601 last-modified timestamp. */
  modifiedDate: string;
}

// ---------------------------------------------------------------------------
// Input types for create / update operations
// ---------------------------------------------------------------------------

/** Input for creating a new cohort definition. */
export interface CreateCohortInput {
  name: string;
  description?: string;
  expressionType: string;
  expression: CohortExpression;
}

/** Input for updating an existing cohort definition. */
export type UpdateCohortInput = Partial<CreateCohortInput>;

// ---------------------------------------------------------------------------
// Validation result types (used by validators)
// ---------------------------------------------------------------------------

/** Result of a domain-level validation. */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/** A single validation error. */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

/** A reusable validation rule for any model type. */
export interface ValidationRule<T> {
  field: keyof T | string;
  validate: (value: unknown, model: T) => boolean;
  message: string;
  code: string;
}

// ---------------------------------------------------------------------------
// Serializer interface
// ---------------------------------------------------------------------------

/** Generic serializer contract for domain models. */
export interface Serializer<T> {
  serialize(model: T): string;
  deserialize(json: string): T;
}
