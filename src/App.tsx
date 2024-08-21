import { Chess } from 'chess.js';
import { useShallow } from 'zustand/react/shallow';

import Board from './components/Board';
import Forms from './components/Forms';
import GameNav from './components/GameNav';
import Games from './components/Games';
import Months from './components/Months';
import { useBoardStore } from './useBoardStore';
import { useSelectGameStore } from './useSelectGameStore';
import useSoundFx from './utils/useSoundFx';

export default function App() {
  const {
    currentGame,
    currentMoveNum,
  } = useBoardStore(useShallow(state => ({
    currentGame: state.currentGame,
    currentMoveNum: state.currentMoveNum,
    lastNav: state.lastNav,
    randomState: state.randomState, // unused, but included to trigger re-render
  })));

  const history = currentGame.history({ verbose: true });
  const displayedGame = new Chess(currentMoveNum > 0 ? history[currentMoveNum - 1].after : undefined);
  const stage = useSelectGameStore(state => state.stage);

  useSoundFx();

  return (
    <div className="mx-auto flex max-h-full max-w-7xl justify-center gap-6 p-6" id="App">
      <Board displayedGame={displayedGame} />
      <div className="flex max-w-md grow flex-col gap-4" id="Controls">
        <a className="inline-block w-full text-center text-xl font-bold" href="/">Game Review</a>
        <div className="overflow-scroll">
          {stage === 'home'
            ? <Forms />
            : stage === 'select-month'
              ? <Months />
              : stage === 'select-game'
                ? <Games />
                : 'loaded' }
        </div>
        <GameNav />
      </div>
    </div>
  );
}
