import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, useTheme } from '@atlas-v3/ui-system';
import { HomePage } from './pages/HomePage';
import { CohortListPage } from './pages/CohortListPage';

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
        <span style={{ fontSize: theme.typography.fontSize.lg, fontWeight: theme.typography.fontWeight.bold }}>
          Atlas V3 Starter Kit
        </span>
        <nav style={{ display: 'flex', gap: theme.spacing.md }}>
          <Link to="/" style={linkStyle}>Home</Link>
          <Link to="/cohorts" style={linkStyle}>Cohorts</Link>
        </nav>
      </header>
      <main style={mainStyle}>{children}</main>
    </>
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
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
