import { Icon } from '@iconify/react/dist/iconify.js';
import { Button } from '@nextui-org/button';
import { useHotkeys } from 'react-hotkeys-hook';
import { useShallow } from 'zustand/react/shallow';

import { useBoardStore } from '../../stores/useBoardStore';
import { useSelectGameStore } from '../../stores/useSelectGameStore';
import { useStageStore } from '../../stores/useStageStore';
import Settings from './Settings';

export default function GameNav() {
  const {
    currentGame,
    currentMoveNum,
    flipBoard,
    toFirstMove,
    toPrevMove,
    toNextMove,
    toFinalMove,
    reset,
  } = useBoardStore(useShallow(state => ({
    currentGame: state.currentGame,
    currentMoveNum: state.currentMoveNum,
    flipBoard: state.flipBoard,
    toFirstMove: state.toFirstMove,
    toPrevMove: state.toPrevMove,
    toNextMove: state.toNextMove,
    toFinalMove: state.toFinalMove,
    reset: state.reset,
  })));

  const resetSelectGameStore = useSelectGameStore(state => state.reset);
  const stage = useStageStore(state => state.stage);
  const setStage = useStageStore(state => state.setStage);
  const reviewFinished = useStageStore(state => state.computed.reviewFinished);
  const history = currentGame.history({ verbose: true });

  useHotkeys('right', () => {
    if (history.length === 0 || currentMoveNum === history.length || !reviewFinished)
      return;
    toNextMove();

    if (stage === 'review-overview' && currentMoveNum === 0) {
      setStage('review-moves');
    }
  });

  useHotkeys('left', () => {
    if (history.length === 0 || currentMoveNum === 0 || !reviewFinished)
      return;
    toPrevMove();
  });

  useHotkeys('up', () => {
    if (history.length === 0 || currentMoveNum === 0 || !reviewFinished)
      return;
    toFirstMove();
  });

  useHotkeys('down', () => {
    if (history.length === 0 || currentMoveNum === history.length || !reviewFinished)
      return;
    toFinalMove();

    if (stage === 'review-overview' && currentMoveNum === 0) {
      setStage('review-moves');
    }
  });

  useHotkeys('x', () => flipBoard());

  return (
    <div className="mt-auto flex flex-col gap-2" id="GameNav">
      <div className="flex gap-1">
        <Button
          aria-label="First move"
          className="grow text-3xl"
          disableRipple
          isDisabled={history.length === 0 || currentMoveNum === 0 || !reviewFinished}
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
          isDisabled={history.length === 0 || currentMoveNum === 0 || !reviewFinished}
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
          isDisabled={history.length === 0 || currentMoveNum === history.length || !reviewFinished}
          isIconOnly
          onPress={() => {
            toNextMove();

            if (stage === 'review-overview' && currentMoveNum === 0) {
              setStage('review-moves');
            }
          }}
          radius="sm"
        >
          <Icon icon="material-symbols:chevron-right-rounded" />
        </Button>
        <Button
          aria-label="Final move"
          className="grow text-3xl"
          disableRipple
          isDisabled={history.length === 0 || currentMoveNum === history.length || !reviewFinished}
          isIconOnly
          onPress={() => {
            toFinalMove();

            if (stage === 'review-overview' && currentMoveNum === 0) {
              setStage('review-moves');
            }
          }}
          radius="sm"
        >
          <Icon icon="material-symbols:last-page-rounded" />
        </Button>
      </div>
      <div className="flex gap-1" id="minor-buttons">
        <Button
          aria-label="Flip board"
          className="text-2xl"
          isIconOnly
          onPress={() => flipBoard()}
          radius="sm"
          size="sm"
        >
          <Icon icon="material-symbols:sync-rounded" />
        </Button>
        <Button
          color="danger"
          onPress={() => {
            reset();
            resetSelectGameStore();
            setStage('home');
          }}
          size="sm"
          variant="flat"
        >
          Reset
        </Button>
        <Settings />
      </div>
    </div>
  );
}
