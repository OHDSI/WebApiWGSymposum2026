import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, useTheme } from '@atlas-v3/ui-system';
import { CohortListPage } from './pages/CohortListPage';
import { CohortDetailPage } from './pages/CohortDetailPage';
import { CohortCreatePage } from './pages/CohortCreatePage';
import { ArchitectureDemoPage } from './pages/ArchitectureDemoPage';

function Layout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.lg,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    backgroundColor: theme.colors.primary,
    color: '#ffffff',
    fontFamily: theme.typography.fontFamily,
  };

  const linkStyle: React.CSSProperties = {
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
  };

  const mainStyle: React.CSSProperties = {
    padding: theme.spacing.lg,
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
    minHeight: 'calc(100vh - 60px)',
  };

  return (
    <>
      <header style={headerStyle}>
        <span style={{
          fontSize: theme.typography.fontSize.lg,
          fontWeight: theme.typography.fontWeight.bold,
        }}>
          Atlas V3 Reference App
        </span>
        <nav style={{ display: 'flex', gap: theme.spacing.md }}>
          <Link to="/" style={linkStyle}>Home</Link>

          <Link to="/cohorts" style={linkStyle}>Cohorts</Link>
          <Link to="/architecture" style={linkStyle}>Architecture</Link>
        </nav>
      </header>
      <main style={mainStyle}>{children}</main>
    </>
  );
}


function HomePage() {
  const theme = useTheme();

  return (
    <div>
      <h1>Atlas V3 Reference App</h1>
      <p style={{ color: `${theme.colors.text}99` }}>
        This is the reference application demonstrating Atlas V3 architecture patterns
        with full Cohort CRUD operations.
      </p>
      <div style={{ display: 'flex', gap: theme.spacing.md }}>
        <Link to="/cohorts" style={{ textDecoration: 'none' }}>
          <span style={{
            color: theme.colors.primary,
            fontWeight: theme.typography.fontWeight.medium,
          }}>
            View Cohort Definitions →
          </span>
        </Link>
        <Link to="/architecture" style={{ textDecoration: 'none' }}>
          <span style={{
            color: theme.colors.secondary,
            fontWeight: theme.typography.fontWeight.medium,
          }}>
            Architecture Patterns →
          </span>
        </Link>
      </div>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cohorts" element={<CohortListPage />} />
            <Route path="/cohorts/new" element={<CohortCreatePage />} />
            <Route path="/cohorts/:id" element={<CohortDetailPage />} />
            <Route path="/architecture" element={<ArchitectureDemoPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
