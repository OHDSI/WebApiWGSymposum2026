// @atlas-v3/domain-core - Serializers

import type { CohortDefinition, Serializer } from '../models/index.js';

/**
 * Serializer for {@link CohortDefinition}.
 *
 * `serialize`   — converts a domain model instance to a JSON string.
 * `deserialize` — parses a JSON string back into a domain model instance.
 *
 * Dates are stored as ISO-8601 strings in the model, so standard
 * JSON.stringify / JSON.parse handles them without extra transforms.
 */
export class CohortSerializer implements Serializer<CohortDefinition> {
  /**
   * Convert a {@link CohortDefinition} to its JSON string representation.
   */
  serialize(model: CohortDefinition): string {
    return JSON.stringify(model);
  }

  /**
   * Parse a JSON string into a {@link CohortDefinition}.
   *
   * Performs basic structural validation to ensure the parsed value
   * looks like a valid CohortDefinition before returning it.
   *
   * @throws {SyntaxError} if `json` is not valid JSON.
   * @throws {Error}       if the parsed object is missing required fields.
   */
  deserialize(json: string): CohortDefinition {
    const parsed: unknown = JSON.parse(json);

    if (parsed === null || typeof parsed !== 'object') {
      throw new Error('CohortSerializer: expected a JSON object');
    }

    const obj = parsed as Record<string, unknown>;

    // Validate required top-level fields
    if (typeof obj['id'] !== 'number') {
      throw new Error('CohortSerializer: "id" must be a number');
    }
    if (typeof obj['name'] !== 'string') {
      throw new Error('CohortSerializer: "name" must be a string');
    }
    if (typeof obj['description'] !== 'string') {
      throw new Error('CohortSerializer: "description" must be a string');
    }
    if (typeof obj['expressionType'] !== 'string') {
      throw new Error('CohortSerializer: "expressionType" must be a string');
    }
    if (obj['expression'] === null || typeof obj['expression'] !== 'object') {
      throw new Error('CohortSerializer: "expression" must be an object');
    }
    if (typeof obj['createdDate'] !== 'string') {
      throw new Error('CohortSerializer: "createdDate" must be a string');
    }
    if (typeof obj['modifiedDate'] !== 'string') {
      throw new Error('CohortSerializer: "modifiedDate" must be a string');
    }

    return parsed as CohortDefinition;
  }
}
