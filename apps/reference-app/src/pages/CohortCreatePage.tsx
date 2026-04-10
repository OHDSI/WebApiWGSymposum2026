import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AtlasApiClient, CohortEndpoints } from '@atlas-v3/api-v3-client';
import { CohortService } from '@atlas-v3/domain-core';
import type { CohortExpression } from '@atlas-v3/domain-core';
import { Button, Card, Input, useTheme } from '@atlas-v3/ui-system';

// --- 3-layer wiring: API → Domain → UI ---

const apiClient = new AtlasApiClient({
  baseUrl: import.meta.env.VITE_WEBAPI_BASE_URL ?? '/WebAPI',
});
const cohortEndpoints = new CohortEndpoints(apiClient);
const cohortService = new CohortService(cohortEndpoints);

/** Default empty expression for new cohorts. */
const emptyExpression: CohortExpression = {
  Type: 'ALL',
  CriteriaList: [],
  DemographicCriteriaList: [],
  Groups: [],
};

export function CohortCreatePage() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleCreate = () => {
    setSaving(true);
    setError(null);

    cohortService
      .create({
        name,
        description,
        expressionType: 'SIMPLE_EXPRESSION',
        expression: emptyExpression,
      })
      .then((created) => navigate(`/cohorts/${created.id}`))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setSaving(false));
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, marginBottom: theme.spacing.lg }}>
        <Link to="/cohorts" style={{ textDecoration: 'none' }}>
          <Button variant="outline" size="sm">← Back</Button>
        </Link>
        <h1 style={{ margin: 0 }}>Create Cohort</h1>
      </div>

      {error && (
        <Card>
          <p style={{ color: theme.colors.error, margin: 0 }}>Error: {error}</p>
        </Card>
      )}

      <Card title="New Cohort Definition">
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter cohort name"
          />
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description (optional)"
          />
          <div style={{ display: 'flex', gap: theme.spacing.sm }}>
            <Button
              variant="primary"
              size="md"
              onClick={handleCreate}
              disabled={saving || !name.trim()}
            >
              {saving ? 'Creating…' : 'Create Cohort'}
            </Button>
            <Link to="/cohorts" style={{ textDecoration: 'none' }}>
              <Button variant="outline" size="md">Cancel</Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
