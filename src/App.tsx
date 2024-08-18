import { Icon } from '@iconify/react/dist/iconify.js';
import { Button } from '@nextui-org/button';
import { Chess } from 'chess.js';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import Board from './Board';
import PGNForm from './PGNForm';
import capture from './sound/capture.mp3';
import castle from './sound/castle.mp3';
import moveCheck from './sound/move-check.mp3';
import moveSelf from './sound/move-self.mp3';
import promote from './sound/promote.mp3';
import { useStore } from './store';

const sound: Record<string, HTMLAudioElement> = {
  moveSelf: new Audio(moveSelf),
  moveCheck: new Audio(moveCheck),
  castle: new Audio(castle),
  capture: new Audio(capture),
  promote: new Audio(promote),
};

export default function App() {
  const {
    currentGame,
    currentMoveNum,
    lastNav,
    flipBoard,
    toFirstMove,
    toPrevMove,
    toNextMove,
    toLastMove,
    reset,
  } = useStore(useShallow(state => ({
    currentGame: state.currentGame,
    currentMoveNum: state.currentMoveNum,
    lastNav: state.lastNav,
    flipBoard: state.flipBoard,
    toFirstMove: state.toFirstMove,
    toPrevMove: state.toPrevMove,
    toNextMove: state.toNextMove,
    toLastMove: state.toLastMove,
    reset: state.reset,
  })));

  const history = currentGame.history({ verbose: true });
  const displayedGame = new Chess(currentMoveNum > 0 ? history[currentMoveNum - 1].after : undefined);
  const [_randomState, setRandomState] = useState(0); // to trigger re-render when PGNForm call currentGame.loadPgn()
  const prevMove = currentMoveNum === 0 ? undefined : history[currentMoveNum - 1];

  useEffect(() => {
    function stopAll() {
      for (const key in sound) {
        sound[key].pause();
        sound[key].currentTime = 0;
      }
    }

    function playSound() {
      if (!prevMove) {
        // starting position
        stopAll();
      }

      else {
        if (new Chess(prevMove.after).inCheck()) {
          stopAll();
          sound.moveCheck.play();

          return;
        }

        if (prevMove.flags.includes('p')) {
          stopAll();
          sound.promote.play();

          return;
        }

        if (prevMove.flags.includes('c') || prevMove.flags.includes('e')) {
          stopAll();
          sound.capture.play();

          return;
        }

        if (prevMove.flags.includes('k') || prevMove.flags.includes('q')) {
          stopAll();
          sound.castle.play();
        }

        else {
          stopAll();
          sound.moveSelf.play();
        }
      }
    }

    playSound();
  }, [currentMoveNum]);

  return (
    <div className="mx-auto flex max-w-7xl justify-center gap-8 p-6" id="App">
      <Board displayedGame={displayedGame} />
      <div className="flex max-w-md grow flex-col gap-4" id="right">
        <h1 className="text-center text-2xl font-bold">Free Game Review</h1>
        <PGNForm setRandomState={setRandomState} />
        <pre>
          currentMoveNum:
          {' '}
          {currentMoveNum}
        </pre>
        <pre>
          game length:
          {' '}
          {history.length}
        </pre>
        <pre>
          lastNav:
          {' '}
          {lastNav}
        </pre>
        <div className="flex gap-1" id="game-nav">
          <Button
            aria-label="First move"
            className="grow text-3xl"
            disableRipple
            isDisabled={history.length === 0 || currentMoveNum === 0}
            isIconOnly
            onPress={toFirstMove}
            radius="sm"
          >
            <Icon icon="material-symbols:first-page-rounded" />
          </Button>
          <Button
            aria-label="Previous move"
            className="grow text-3xl"
            disableRipple
            isDisabled={history.length === 0 || currentMoveNum === 0}
            isIconOnly
            onPress={toPrevMove}
            radius="sm"
          >
            <Icon icon="material-symbols:chevron-left-rounded" />
          </Button>
          <Button
            aria-label="Next move"
            className="grow text-3xl"
            disableRipple
            isDisabled={history.length === 0 || currentMoveNum === history.length}
            isIconOnly
            onPress={toNextMove}
            radius="sm"
          >
            <Icon icon="material-symbols:chevron-right-rounded" />
          </Button>
          <Button
            aria-label="Last move"
            className="grow text-3xl"
            disableRipple
            isDisabled={history.length === 0 || currentMoveNum === history.length}
            isIconOnly
            onPress={toLastMove}
            radius="sm"
          >
            <Icon icon="material-symbols:last-page-rounded" />
          </Button>
        </div>
        <Button
          aria-label="Flip board"
          className="text-3xl"
          isIconOnly
          onPress={flipBoard}
          radius="sm"
        >
          <Icon icon="material-symbols:sync-rounded" />
        </Button>
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
