import { NextUIProvider } from '@nextui-org/system';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';

import App from './App.tsx';

import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>
        <HelmetProvider>
          <main className="lg:h-screen">
            <App />
          </main>
        </HelmetProvider>
      </NextUIProvider>
      {import.meta.env.PROD || <ReactQueryDevtools initialIsOpen={false} /> }
    </QueryClientProvider>
  </React.StrictMode>,
);
