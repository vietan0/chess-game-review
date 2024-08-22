import { Icon } from '@iconify/react/dist/iconify.js';
import { Button } from '@nextui-org/button';
import { Chess } from 'chess.js';
import { useShallow } from 'zustand/react/shallow';

import Board from './components/Board';
import Forms from './components/Forms';
import GameNav from './components/GameNav';
import Games from './components/Games';
import Months from './components/Months';
import { useBoardStore } from './useBoardStore';
import { useSelectGameStore } from './useSelectGameStore';
import cn from './utils/cn';
import useSoundFx from './utils/useSoundFx';

export default function App() {
  const {
    currentGame,
    currentMoveNum,
    reset,
  } = useBoardStore(useShallow(state => ({
    currentGame: state.currentGame,
    currentMoveNum: state.currentMoveNum,
    randomState: state.randomState, // unused, but included to trigger re-render
    reset: state.reset,
  })));

  const history = currentGame.history({ verbose: true });
  const displayedGame = new Chess(currentMoveNum > 0 ? history[currentMoveNum - 1].after : undefined);

  const {
    stage,
    site,
    backToMonths,
    backToGames,
    resetSelectGame,
  } = useSelectGameStore(useShallow(state => ({
    stage: state.stage,
    site: state.site,
    backToMonths: state.backToMonths,
    backToGames: state.backToGames,
    resetSelectGame: state.reset,
  })));

  useSoundFx();

  function back() {
    if (stage === 'select-month') {
      resetSelectGame();
    }

    else if (stage === 'select-game') {
      backToMonths();
    }

    else if (stage === 'loaded') {
      if (site) {
        backToGames();
      }
      else {
        reset();
        resetSelectGame();
      }
    }
  }

  return (
    <div className="mx-auto flex h-full max-w-7xl justify-center gap-6 p-6" id="App">
      <Board displayedGame={displayedGame} />
      <div className="flex max-w-md grow flex-col gap-4" id="Controls">
        <div className="grid grid-cols-[40px_1fr_40px] gap-1">
          <Button
            aria-label="Back"
            className={cn('text-2xl', stage === 'home' && 'invisible')}
            disableRipple
            isIconOnly
            onPress={back}
            radius="sm"
            size="sm"
            variant="light"
          >
            <Icon icon="material-symbols:chevron-left-rounded" />
          </Button>
          <a
            className={cn('flex w-full items-center justify-center font-bold', stage === 'home' && 'text-xl')}
            href="/"
          >
            {stage === 'home' && <img className="mr-1 size-5" src="/star.svg" />}
            {stage === 'home' ? 'Game Review' : stage === 'select-month' ? 'Select Month' : stage === 'select-game' ? 'Select Game' : 'Review'}
          </a>
        </div>
        <div className="grow overflow-scroll">
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
