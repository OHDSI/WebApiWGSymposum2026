import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, useTheme } from '@atlas-v3/ui-system';

export function HomePage() {
  const theme = useTheme();

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  };

  return (
    <div>
      <h1 style={{ margin: `0 0 ${theme.spacing.sm} 0` }}>
        Atlas V3 Hackathon Boilerplate
      </h1>
      <p style={{ color: `${theme.colors.text}99`, marginBottom: theme.spacing.lg }}>
        A monorepo starter kit demonstrating the 3-layer architecture: UI · Domain · API
      </p>

      <div style={gridStyle}>
        <Card title="UI Layer — @atlas-v3/ui-system">
          <p>Theme-aware components: Button, Card, DataTable, Input.</p>
          <p>ThemeProvider supplies consistent design tokens to every component.</p>
        </Card>

        <Card title="Domain Layer — @atlas-v3/domain-core">
          <p>Pure TypeScript models, validators, serializers, and services.</p>
          <p>CohortService orchestrates business logic independent of the UI.</p>
        </Card>

        <Card title="API Layer — @atlas-v3/api-v3-client">
          <p>AtlasApiClient wraps fetch with typed responses and error handling.</p>
          <p>MSW mock handlers enable offline development without a backend.</p>
        </Card>
      </div>

      <div style={{ marginTop: theme.spacing.xl }}>
        <Link to="/cohorts" style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="lg">
            View Cohort List Demo →
          </Button>
        </Link>
      </div>
    </div>
  );
}
