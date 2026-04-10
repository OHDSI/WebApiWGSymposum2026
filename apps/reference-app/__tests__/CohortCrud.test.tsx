import React from 'react';
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@atlas-v3/ui-system';
import { resetMockStores } from '@atlas-v3/api-v3-client/mocks';
import { setupMockServer } from '@atlas-v3/api-v3-client/mocks/server';
import { CohortListPage } from '../src/pages/CohortListPage';
import { CohortCreatePage } from '../src/pages/CohortCreatePage';
import { CohortDetailPage } from '../src/pages/CohortDetailPage';

// **Validates: Requirements 7.1**

const server = setupMockServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
  resetMockStores();
});
afterAll(() => server.close());

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderWithRouter(ui: React.ReactElement, initialEntries: string[] = ['/']) {
  return render(
    React.createElement(
      ThemeProvider,
      null,
      React.createElement(MemoryRouter, { initialEntries }, ui),
    ),
  );
}

// ---------------------------------------------------------------------------
// CohortListPage
// ---------------------------------------------------------------------------

describe('CohortListPage', () => {
  it('renders heading and loading state', () => {
    renderWithRouter(React.createElement(CohortListPage));
    expect(screen.getByText('Cohort Definitions')).toBeDefined();
    expect(screen.getByText('Loading cohorts…')).toBeDefined();
  });


  it('fetches and displays cohorts from MSW mock', async () => {
    renderWithRouter(React.createElement(CohortListPage));

    await waitFor(() => {
      expect(screen.getByText('Type 2 Diabetes')).toBeDefined();
    });

    expect(screen.getByText('Hypertension')).toBeDefined();
    expect(screen.getByText('Heart Failure')).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// CohortCreatePage
// ---------------------------------------------------------------------------

describe('CohortCreatePage', () => {
  it('fills form and creates a new cohort', async () => {
    // Render with routing so navigate() after creation works
    renderWithRouter(
      React.createElement(
        Routes,
        null,
        React.createElement(Route, {
          path: '/cohorts/new',
          element: React.createElement(CohortCreatePage),
        }),
        React.createElement(Route, {
          path: '/cohorts/:id',
          element: React.createElement('div', null, 'detail-placeholder'),
        }),
      ),
      ['/cohorts/new'],
    );

    expect(screen.getByRole('heading', { name: 'Create Cohort' })).toBeDefined();

    // Fill in the name field
    const nameInput = screen.getByPlaceholderText('Enter cohort name');
    fireEvent.change(nameInput, { target: { value: 'New Test Cohort' } });

    // Fill in the description field
    const descInput = screen.getByPlaceholderText('Enter description (optional)');
    fireEvent.change(descInput, { target: { value: 'A test description' } });

    // Submit — button is now enabled after name is filled
    const createButton = screen.getByRole('button', { name: 'Create Cohort' });
    fireEvent.click(createButton);

    // After creation the page navigates to /cohorts/:id
    await waitFor(() => {
      expect(screen.getByText('detail-placeholder')).toBeDefined();
    });
  });
});

// ---------------------------------------------------------------------------
// CohortDetailPage
// ---------------------------------------------------------------------------

describe('CohortDetailPage', () => {
  it('displays cohort details fetched by id', async () => {
    renderWithRouter(
      React.createElement(
        Routes,
        null,
        React.createElement(Route, {
          path: '/cohorts/:id',
          element: React.createElement(CohortDetailPage),
        }),
      ),
      ['/cohorts/1'],
    );

    // Loading state
    expect(screen.getByText('Loading cohort…')).toBeDefined();

    // Wait for the detail to load — cohort id=1 is "Type 2 Diabetes"
    // The name appears in both the Card title and the detail field, so use getAllByText
    await waitFor(() => {
      expect(screen.getAllByText('Type 2 Diabetes').length).toBeGreaterThanOrEqual(1);
    });

    // Verify detail fields are rendered
    expect(screen.getByText('Cohort Detail')).toBeDefined();
    expect(screen.getByText('Description for cohort 1')).toBeDefined();
    expect(screen.getByText('SIMPLE_EXPRESSION')).toBeDefined();
  });
});
