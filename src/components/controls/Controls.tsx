import { Icon } from '@iconify/react/dist/iconify.js';
import { Button } from '@nextui-org/button';
import { useShallow } from 'zustand/react/shallow';

import { useBoardStore } from '../../stores/useBoardStore';
import { useSelectGameStore } from '../../stores/useSelectGameStore';
import cn from '../../utils/cn';
import Forms from './Forms';
import GameNav from './GameNav';
import Games from './Games';
import Months from './Months';
import Review from './Review';

export default function Controls() {
  const reset = useBoardStore(state => state.reset);

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
              : <Review />}
      </div>
      <GameNav />
    </div>
  );
}
