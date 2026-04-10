import React from 'react';
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@atlas-v3/ui-system';
import { resetMockStores } from '@atlas-v3/api-v3-client/mocks';
import { setupMockServer } from '@atlas-v3/api-v3-client/mocks/server';
import { CohortListPage } from '../src/pages/CohortListPage';

// **Validates: Requirements 6.2**

const server = setupMockServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
  resetMockStores();
});
afterAll(() => server.close());

function renderPage() {
  return render(
    React.createElement(
      ThemeProvider,
      null,
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(CohortListPage),
      ),
    ),
  );
}

describe('CohortListPage', () => {
  it('renders the page heading', () => {
    renderPage();
    expect(screen.getByText('Cohort Definitions')).toBeDefined();
  });

  it('shows loading state initially', () => {
    renderPage();
    expect(screen.getByText('Loading cohorts…')).toBeDefined();
  });

  it('fetches and displays cohorts from MSW mock', async () => {
    renderPage();

    // Wait for the mock data to load — the MSW handlers return 3 cohorts
    await waitFor(() => {
      expect(screen.getByText('Type 2 Diabetes')).toBeDefined();
    });

    expect(screen.getByText('Hypertension')).toBeDefined();
    expect(screen.getByText('Heart Failure')).toBeDefined();
  });

  it('renders cohort data inside a DataTable', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Type 2 Diabetes')).toBeDefined();
    });

    // DataTable renders column headers
    expect(screen.getByText('ID')).toBeDefined();
    expect(screen.getByText('Name')).toBeDefined();
    expect(screen.getByText('Description')).toBeDefined();
    expect(screen.getByText('Created')).toBeDefined();
  });
});
