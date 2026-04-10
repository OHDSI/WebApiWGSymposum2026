import React, { useEffect, useState } from 'react';
import { AtlasApiClient, CohortEndpoints } from '@atlas-v3/api-v3-client';
import { CohortService } from '@atlas-v3/domain-core';
import type { CohortDefinition } from '@atlas-v3/domain-core';
import { Button, Card, DataTable, useTheme } from '@atlas-v3/ui-system';
import type { Column } from '@atlas-v3/ui-system';

const columns: Column<CohortDefinition>[] = [
  { key: 'id', header: 'ID' },
  { key: 'name', header: 'Name' },
  { key: 'description', header: 'Description' },
  { key: 'createdDate', header: 'Created' },
];

export function CohortListPage() {
  const theme = useTheme();
  const [cohorts, setCohorts] = useState<CohortDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize services inside the component or a memo to ensure env vars are fresh
  const cohortService = React.useMemo(() => {
    const isMock = import.meta.env.VITE_MOCK_MODE === 'true';
    const baseUrl = isMock ? '/WebAPI' : (import.meta.env.VITE_WEBAPI_BASE_URL ?? '/WebAPI');

    const apiClient = new AtlasApiClient({
      baseUrl,
    });
    const cohortEndpoints = new CohortEndpoints(apiClient);
    return new CohortService(cohortEndpoints);
  }, []);

  useEffect(() => {
    let cancelled = false;
    console.log('[CohortListPage] Fetching cohorts...');

    cohortService
      .list()
      .then((data) => {
        if (!cancelled) {
          console.log('[CohortListPage] Successfully fetched cohorts:', data);
          setCohorts(data);
        }
      })
      .catch((err: unknown) => {
        console.error('[CohortListPage] Failed to fetch cohorts:', err);
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [cohortService]);

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    cohortService
      .list()
      .then(setCohorts)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, marginBottom: theme.spacing.lg }}>
        <h1 style={{ margin: 0 }}>Cohort Definitions</h1>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          Refresh
        </Button>
      </div>

      <Card title="3-Layer Architecture Demo">
        <p style={{ marginTop: 0, color: `${theme.colors.text}99` }}>
          API layer (AtlasApiClient) → Domain layer (CohortService) → UI layer (DataTable)
        </p>
      </Card>

      <div style={{ marginTop: theme.spacing.lg }}>
        {loading && <p>Loading cohorts…</p>}
        {error && (
          <Card>
            <p style={{ color: theme.colors.error, margin: 0 }}>Error: {error}</p>
          </Card>
        )}
        {!loading && !error && (
          <DataTable<CohortDefinition> columns={columns} data={cohorts} />
        )}
      </div>
    </div>
  );
}
