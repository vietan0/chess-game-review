import Board from './components/Board';
import Controls from './components/Controls';

export default function App() {
  return (
    <div className="mx-auto flex h-full max-w-7xl justify-center gap-6 p-6" id="App">
      <Board />
      <Controls />
    </div>
  );
}
