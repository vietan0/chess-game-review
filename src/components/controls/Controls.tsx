import { Helmet } from '@dr.pogodin/react-helmet';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useShallow } from 'zustand/react/shallow';

import { useBoardStore } from '../../stores/useBoardStore';
import { useSelectGameStore } from '../../stores/useSelectGameStore';
import { useStageStore } from '../../stores/useStageStore';
import cn from '../../utils/cn';
import useNames from '../../utils/useNames';
import Forms from './Forms';
import GameNav from './GameNav';
import Games from './Games';
import Months from './Months';
import Review from './Review';

export default function Controls() {
  const reset = useBoardStore(state => state.reset);

  const {
    stage,
    setStage,
    isLoaded,
  } = useStageStore(useShallow(state => ({
    stage: state.stage,
    setStage: state.setStage,
    isLoaded: state.computed.isLoaded,
  })));

  const {
    site,
    resetSelectGameStore,
  } = useSelectGameStore(useShallow(state => ({
    site: state.site,
    resetSelectGameStore: state.reset,
  })));

  const [wName, bName] = useNames();

  function back() {
    if (stage === 'select-month') {
      resetSelectGameStore();
      setStage('home');
    }

    else if (stage === 'select-game') {
      setStage('select-month');
    }

    else if (stage === 'loaded' || stage === 'reviewing' || stage === 'review-overview') {
      reset();

      if (site) {
        setStage('select-game');
      }
      else {
        resetSelectGameStore();
        setStage('home');
      }
    }
    else if (stage === 'review-moves') {
      setStage('review-overview');
    }
  }

  return (
    <div
      className={`
        mb-28 flex h-[500px] max-w-[642px] min-w-[310px] grow flex-col gap-4
        backdrop-blur-sm
        xs:mb-14 xs:h-[640px]
        lg:mb-0 lg:size-auto lg:h-auto lg:max-w-[480px]
      `}
      id="Controls"
    >
      <Helmet>
        <title>
          {isLoaded
            ? `${wName} vs. ${bName} | Game Review`
            : 'Game Review'}
        </title>
      </Helmet>
      <div className="grid grid-cols-[40px_1fr_40px] gap-1">
        <Button
          aria-label="Back"
          className={cn('text-2xl', stage === 'home' && 'invisible')}
          isIconOnly
          onPress={back}
          radius="sm"
          size="sm"
          variant="light"
        >
          <Icon icon="material-symbols:chevron-left-rounded" />
        </Button>
        <p
          className={cn('flex w-full items-center justify-center font-bold', stage === 'home' && `
            text-xl
          `)}
        >
          {stage === 'home'
            ? (
                <>
                  <img alt="" className="mr-1 size-5" src="/star.svg" />
                  <span>Game Review</span>
                </>
              )
            : stage === 'select-month' ? 'Select Month' : stage === 'select-game' ? 'Select Game' : 'Review'}
        </p>
      </div>
      <div className={`
        grow overflow-scroll
        xs:px-4
      `}
      >
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
