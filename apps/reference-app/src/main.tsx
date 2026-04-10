import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

async function bootstrap(): Promise<void> {
  if (import.meta.env.VITE_MOCK_MODE === 'true') {
    const { initMockMode } = await import('./mocks/setup');
    await initMockMode();
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

bootstrap();
