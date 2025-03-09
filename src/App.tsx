import { Button } from '@heroui/button';
import { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import Board from './components/board/Board';
import Controls from './components/controls/Controls';

export default function App() {
  useEffect(() => {
    const root = document.getElementById('root');
    if (root)
      root.role = 'presentation';
  }, []);

  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-6 p-6 lg:h-full lg:flex-row lg:items-stretch" id="App">
        <Board />
        <Controls />
      </div>
    </ErrorBoundary>
  );
}

// eslint-disable-next-line unused-imports/no-unused-vars
function Fallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => any }) {
  return (
    <div className="flex h-full flex-col gap-2 p-8" role="alert">
      <p className="text-2xl">Something went wrong:</p>
      <code className="inline-block text-small text-danger-500">
        {error.message}
      </code>
      <div className="flex gap-1">
        <Button
          onPress={() => {
            window.location.reload();
          }}
        >
          Refresh
        </Button>
      </div>
    </div>
  );
}
