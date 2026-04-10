import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

async function bootstrap(): Promise<void> {
  if (import.meta.env.VITE_MOCK_MODE === 'true') {
    const { initMockMode } = await import('./mocks/setup');
    await initMockMode();
    // Small delay to ensure Service Worker is ready to intercept
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

bootstrap();
