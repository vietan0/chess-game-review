import { Helmet } from '@dr.pogodin/react-helmet';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { createPortal } from 'react-dom';
import { useMediaQuery } from 'react-responsive';
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

  const isLg = useMediaQuery({
    query: '(min-width: 1024px)',
  });

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
        flex h-[500px] max-w-[642px] min-w-[310px] grow flex-col gap-4
        backdrop-blur-sm
        xs:h-[660px]
        lg:mb-0 lg:h-auto lg:max-h-[696px] lg:w-auto lg:max-w-[480px]
      `}
      // max-h-[696px] is the height of sibling element <Board />
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
        mb-32 grow overflow-scroll
        xs:mb-16 xs:px-4
        lg:mb-0
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
      {isLg ? <GameNav /> : createPortal(<GameNav />, document.getElementById('root')!)}
    </div>
  );
}
