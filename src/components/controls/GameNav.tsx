import { Icon } from '@iconify/react/dist/iconify.js';
import { Button } from '@nextui-org/button';
import { useHotkeys } from 'react-hotkeys-hook';
import { useShallow } from 'zustand/react/shallow';

import { useBoardStore } from '../../stores/useBoardStore';
import { useSelectGameStore } from '../../stores/useSelectGameStore';

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

  useHotkeys('right', () => toNextMove());
  useHotkeys('left', () => toPrevMove());
  useHotkeys('up', () => toFirstMove());
  useHotkeys('down', () => toFinalMove());
  useHotkeys('x', () => flipBoard());

  const resetSelectGameStore = useSelectGameStore(state => state.reset);
  const history = currentGame.history({ verbose: true });

  return (
    <div className="mt-auto flex flex-col gap-2" id="GameNav">
      <div className="flex gap-1">
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
          onPress={toFinalMove}
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
          }}
          size="sm"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
