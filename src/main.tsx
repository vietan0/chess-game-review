import { NextUIProvider } from '@nextui-org/system';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextUIProvider>
      <main className="min-h-screen bg-content1 text-foreground dark">
        <App />
      </main>
    </NextUIProvider>
  </React.StrictMode>,
);
