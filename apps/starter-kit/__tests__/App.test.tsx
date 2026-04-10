import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { App } from '../src/App';

// **Validates: Requirements 6.2**

afterEach(cleanup);

describe('App', () => {
  it('renders with ThemeProvider and shows the home page', () => {
    render(React.createElement(App));

    // The home page heading should be visible
    expect(screen.getByText('Atlas V3 Hackathon Boilerplate')).toBeDefined();
  });

  it('renders navigation links', () => {
    render(React.createElement(App));

    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.getByText('Cohorts')).toBeDefined();
  });

  it('renders the header with app title', () => {
    render(React.createElement(App));

    expect(screen.getAllByText('Atlas V3 Starter Kit').length).toBeGreaterThan(0);
  });
});
