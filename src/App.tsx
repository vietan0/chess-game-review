import { Icon } from '@iconify/react/dist/iconify.js';
import { Button } from '@nextui-org/button';
import { Chess } from 'chess.js';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import Board from './Board';
import PGNForm from './PGNForm';
import { useStore } from './store';

export default function App() {
  const {
    currentGame,
    currentMove,
    toFirstMove,
    toPrevMove,
    toNextMove,
    toLastMove,
    reset,
  } = useStore(useShallow(state => ({
    currentGame: state.currentGame,
    currentMove: state.currentMove,
    toFirstMove: state.toFirstMove,
    toPrevMove: state.toPrevMove,
    toNextMove: state.toNextMove,
    toLastMove: state.toLastMove,
    reset: state.reset,
  })));

  const history = currentGame.history({ verbose: true });
  const displayedGame = new Chess(currentMove > 0 ? history[currentMove - 1].after : undefined);
  const lastMove = currentMove === 0 ? undefined : history[currentMove - 1];
  const [_randomState, setRandomState] = useState(0); // to trigger re-render when PGNForm call currentGame.loadPgn()

  return (
    <div className="mx-auto flex max-w-7xl justify-center gap-8 p-6" id="App">
      <Board displayedGame={displayedGame} lastMove={lastMove} />
      <div className="flex max-w-md grow flex-col gap-4" id="right">
        <h1 className="text-center text-3xl font-bold">Free Game Review</h1>
        <PGNForm setRandomState={setRandomState} />
        <pre>
          currentMove:
          {' '}
          {currentMove}
        </pre>
        <pre>
          game length:
          {' '}
          {history.length}
        </pre>
        <div className="flex gap-1" id="game-nav">
          <Button
            aria-label="First move"
            className="grow text-3xl"
            isDisabled={history.length === 0 || currentMove === 0}
            isIconOnly
            onPress={toFirstMove}
            radius="sm"
          >
            <Icon icon="material-symbols:first-page-rounded" />
          </Button>
          <Button
            aria-label="Previous move"
            className="grow text-3xl"
            isDisabled={history.length === 0 || currentMove === 0}
            isIconOnly
            onPress={toPrevMove}
            radius="sm"
          >
            <Icon icon="material-symbols:chevron-left-rounded" />
          </Button>
          <Button
            aria-label="Next move"
            className="grow text-3xl"
            isDisabled={history.length === 0 || currentMove === history.length}
            isIconOnly
            onPress={toNextMove}
            radius="sm"
          >
            <Icon icon="material-symbols:chevron-right-rounded" />
          </Button>
          <Button
            aria-label="Last move"
            className="grow text-3xl"
            isDisabled={history.length === 0 || currentMove === history.length}
            isIconOnly
            onPress={toLastMove}
            radius="sm"
          >
            <Icon icon="material-symbols:last-page-rounded" />
          </Button>
        </div>
        <Button
          color="danger"
          onPress={reset}
        >
          Reset
        </Button>
      </div>

    </div>
  );
}
