import React, { useState } from 'react';
import { useTheme, Card, Button } from '@atlas-v3/ui-system';
import { AtlasApiClient, CohortEndpoints } from '@atlas-v3/api-v3-client';
import { CohortService } from '@atlas-v3/domain-core';
import type { CohortDefinition, ValidationResult } from '@atlas-v3/domain-core';

// ---------------------------------------------------------------------------
// Code snippet constants
// ---------------------------------------------------------------------------

const SNIPPET_API = `// 1. API Layer — initialize the client
import { AtlasApiClient, CohortEndpoints } from '@atlas-v3/api-v3-client';

const client = new AtlasApiClient({
  baseUrl: 'http://localhost:8080/WebAPI',
  timeout: 10_000,
});
const cohortEndpoints = new CohortEndpoints(client);`;

const SNIPPET_DOMAIN = `// 2. Domain Layer — create a service over the endpoints
import { CohortService } from '@atlas-v3/domain-core';

const cohortService = new CohortService(cohortEndpoints);

// Domain operations: list, get, create, update, remove, validate
const cohorts = await cohortService.list();
const result  = cohortService.validate(cohort);`;

const SNIPPET_UI = `// 3. UI Layer — consume domain data with themed components
import { ThemeProvider, useTheme, Card, DataTable, Button } from '@atlas-v3/ui-system';

function CohortList() {
  const theme = useTheme();
  const [cohorts, setCohorts] = useState<CohortDefinition[]>([]);

  useEffect(() => { cohortService.list().then(setCohorts); }, []);

  return (
    <Card title="Cohort Definitions">
      <DataTable columns={columns} data={cohorts} />
    </Card>
  );
}`;

const SNIPPET_FLOW = `// Full data flow: UI → Domain → API → Server → API → Domain → UI
//
// 1. UI calls        cohortService.create(input)
// 2. Domain          validates input via CohortValidator
// 3. Domain          serializes to API payload (JSON string expression)
// 4. API client      POST /cohortdefinition  →  server
// 5. API client      parses response
// 6. Domain          maps API DTO → CohortDefinition (domain model)
// 7. UI              renders the new cohort`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildStack() {
  const client = new AtlasApiClient({
    baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/WebAPI',
  });
  const endpoints = new CohortEndpoints(client);
  return new CohortService(endpoints);
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CodeBlock({ code, label }: { code: string; label: string }) {
  const theme = useTheme();
  return (
    <div style={{ marginBottom: theme.spacing.lg }}>
      <h3 style={{ margin: `0 0 ${theme.spacing.sm}`, fontSize: theme.typography.fontSize.md }}>
        {label}
      </h3>
      <pre
        style={{
          background: '#1e1e1e',
          color: '#d4d4d4',
          padding: theme.spacing.md,
          borderRadius: theme.borderRadius.md,
          overflow: 'auto',
          fontSize: theme.typography.fontSize.sm,
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}


function LiveDemo() {
  const theme = useTheme();
  const [cohorts, setCohorts] = useState<CohortDefinition[]>([]);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const service = React.useMemo(() => buildStack(), []);

  async function handleFetchCohorts() {
    setLoading(true);
    setError(null);
    setValidation(null);
    try {
      const list = await service.list();
      setCohorts(list);
    } catch (e: any) {
      setError(e.message ?? 'Failed to fetch cohorts');
    } finally {
      setLoading(false);
    }
  }

  function handleValidateEmpty() {
    const empty: CohortDefinition = {
      id: 0,
      name: '',
      description: '',
      expressionType: 'SIMPLE_EXPRESSION',
      expression: { Type: 'ALL', CriteriaList: [], DemographicCriteriaList: [], Groups: [] },
      createdDate: '',
      modifiedDate: '',
    };
    setValidation(service.validate(empty));
  }

  function handleValidateLongName() {
    const long: CohortDefinition = {
      id: 0,
      name: 'A'.repeat(256),
      description: '',
      expressionType: 'SIMPLE_EXPRESSION',
      expression: { Type: 'ALL', CriteriaList: [], DemographicCriteriaList: [], Groups: [] },
      createdDate: '',
      modifiedDate: '',
    };
    setValidation(service.validate(long));
  }

  const resultStyle: React.CSSProperties = {
    marginTop: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    background: '#f5f5f5',
    fontSize: theme.typography.fontSize.sm,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  };

  return (
    <Card title="Live Demo — 3-Layer Flow in Action">
      <div style={{ display: 'flex', gap: theme.spacing.sm, flexWrap: 'wrap', marginBottom: theme.spacing.md }}>
        <Button onClick={handleFetchCohorts} disabled={loading}>
          {loading ? 'Loading…' : 'Fetch Cohorts (API → Domain → UI)'}
        </Button>
        <Button variant="secondary" onClick={handleValidateEmpty}>
          Validate Empty Name
        </Button>
        <Button variant="secondary" onClick={handleValidateLongName}>
          Validate 256-char Name
        </Button>
      </div>

      {error && (
        <div style={{ ...resultStyle, color: theme.colors.error }}>Error: {error}</div>
      )}

      {cohorts.length > 0 && (
        <div style={resultStyle}>
          <strong>Fetched {cohorts.length} cohort(s):</strong>
          {'\n'}
          {cohorts.map((c) => `• #${c.id} ${c.name}`).join('\n')}
        </div>
      )}

      {validation && (
        <div style={{ ...resultStyle, color: validation.valid ? theme.colors.success : theme.colors.error }}>
          <strong>Validation {validation.valid ? 'passed ✓' : 'failed ✗'}</strong>
          {!validation.valid && '\n' + validation.errors.map((e) => `• ${e.field}: ${e.message}`).join('\n')}
        </div>
      )}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function ArchitectureDemoPage() {
  const theme = useTheme();

  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ marginTop: 0 }}>Architecture — Package Integration Patterns</h1>
      <p style={{ color: `${theme.colors.text}99`, marginBottom: theme.spacing.lg }}>
        Atlas V3 separates concerns into three layers: <strong>API</strong> (api-v3-client),{' '}
        <strong>Domain</strong> (domain-core), and <strong>UI</strong> (ui-system).
        Below are the wiring patterns and a live demo.
      </p>

      <CodeBlock label="① API Layer — AtlasApiClient + Endpoints" code={SNIPPET_API} />
      <CodeBlock label="② Domain Layer — CohortService" code={SNIPPET_DOMAIN} />
      <CodeBlock label="③ UI Layer — Themed Components" code={SNIPPET_UI} />
      <CodeBlock label="Data Flow Overview" code={SNIPPET_FLOW} />

      <LiveDemo />
    </div>
  );
}
