import { useEffect } from 'react';

import Board from './components/board/Board';
import Controls from './components/controls/Controls';

export default function App() {
  useEffect(() => {
    const root = document.getElementById('root');
    if (root)
      root.role = 'presentation';
  }, []);

  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-6 p-6 lg:h-full lg:flex-row lg:items-stretch" id="App">
      <Board />
      <Controls />
    </div>
  );
}
