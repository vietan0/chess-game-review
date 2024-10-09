import Board from './components/board/Board';
import Controls from './components/controls/Controls';
import useMockState from './useMockState';

export default function App() {
  useMockState();

  return (
    <div className="mx-auto flex h-full max-w-7xl justify-center gap-6 p-6" id="App">
      <Board />
      <Controls />
    </div>
  );
}
