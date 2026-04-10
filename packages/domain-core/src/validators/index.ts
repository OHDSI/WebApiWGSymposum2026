// @atlas-v3/domain-core - Validators

import type {
  CohortDefinition,
  ValidationRule,
  ValidationResult,
  ValidationError,
} from '../models/index.js';

// ---------------------------------------------------------------------------
// Cohort validation rules
// ---------------------------------------------------------------------------

export const cohortValidationRules: ValidationRule<CohortDefinition>[] = [
  {
    field: 'name',
    validate: (value) => typeof value === 'string' && value.trim().length > 0,
    message: 'Cohort name is required',
    code: 'REQUIRED_NAME',
  },
  {
    field: 'name',
    validate: (value) => typeof value === 'string' && value.length <= 255,
    message: 'Cohort name must be 255 characters or fewer',
    code: 'NAME_TOO_LONG',
  },
];

// ---------------------------------------------------------------------------
// CohortValidator
// ---------------------------------------------------------------------------

export class CohortValidator {
  validate(definition: CohortDefinition): ValidationResult {
    const errors: ValidationError[] = [];
    for (const rule of cohortValidationRules) {
      if (
        !rule.validate(
          definition[rule.field as keyof CohortDefinition],
          definition,
        )
      ) {
        errors.push({ field: rule.field, message: rule.message, code: rule.code });
      }
    }
    return { valid: errors.length === 0, errors };
  }
}

/**
 * Convenience function — validates a CohortDefinition without instantiating
 * the class directly.
 */
export function validateCohort(definition: CohortDefinition): ValidationResult {
  return new CohortValidator().validate(definition);
}
