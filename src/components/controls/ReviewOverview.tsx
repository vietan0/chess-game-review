import { Button } from '@heroui/button';
import { useMemo } from 'react';

import MoveClassification from '../../icons/move-classifications/MoveClassification';
import { useBoardStore } from '../../stores/useBoardStore';
import { useEvalStore } from '../../stores/useEvalStore';
import { useStageStore } from '../../stores/useStageStore';
import capitalize from '../../utils/capitalize';
import { chooseTextColor } from '../../utils/chooseColorFromClassification';
import cn from '../../utils/cn';
import useNames from '../../utils/useNames';
import EvalGraph from './EvalGraph';

import type { Classification } from '../../utils/classify';

export default function ReviewOverview() {
  const [wName, bName] = useNames();
  const currentMoveNum = useBoardStore(state => state.currentMoveNum);
  const toNextMove = useBoardStore(state => state.toNextMove);
  const accuracy = useEvalStore(state => state.accuracy);
  const classHistory = useEvalStore(state => state.classHistory);

  const record = useMemo(() => {
    // [white, black]
    const record = {
      best: [0, 0],
      excellent: [0, 0],
      good: [0, 0],
      book: [0, 0],
      inaccuracy: [0, 0],
      mistake: [0, 0],
      blunder: [0, 0],
      forced: [0, 0],
    };

    for (let i = 0; i < classHistory.length; i++) {
      const cl = classHistory[i];

      if (i % 2 === 0) {
        record[cl] = [
          record[cl][0] + 1,
          record[cl][1],
        ];
      }
      else {
        record[cl] = [
          record[cl][0],
          record[cl][1] + 1,
        ];
      }
    }

    return record;
  }, [classHistory]);

  const setStage = useStageStore(state => state.setStage);

  return (
    <div className="flex flex-col gap-4 text-small" id="ReviewOverview">
      <EvalGraph />
      <div className="flex flex-col gap-2" id="accuracy">
        <div className="grid grid-cols-[100px,_1fr,_24px,_1fr] items-center gap-4 [&>*]:w-full">
          <p className="text-foreground-500">Players</p>
          <p className="truncate text-center font-bold">{wName}</p>
          <span className="invisible text-[1px]">purposefully blank space</span>
          <p className="truncate text-center font-bold">{bName}</p>
        </div>
        <div className="grid grid-cols-[100px,_1fr,_24px,_1fr] items-center gap-4">
          <p className="text-foreground-500">Accuracy</p>
          <p className="inline-block justify-self-center rounded bg-white px-3 py-2 text-lg font-bold text-background">{accuracy[0]}</p>
          <span className="invisible text-[1px]">purposefully blank space</span>
          <p className="inline-block justify-self-center rounded bg-default-100 px-3 py-2 text-lg font-bold">{accuracy[1]}</p>
        </div>
      </div>
      <hr className="border-default-200" />
      <div className="flex flex-col gap-4">
        {Object.entries(record).map(([classification, counts], i) => {
          const cl = classification as Classification;
          if (cl === 'forced')
            return null;

          return (
            <div className="grid grid-cols-[100px,_1fr,_24px,_1fr] items-center gap-4" key={i}>
              <p className="text-foreground-500">{capitalize(cl)}</p>
              <p className={cn(
                'justify-self-center text-base font-bold',
                chooseTextColor(cl),
              )}
              >
                {counts[0]}
              </p>
              <MoveClassification classification={cl} />
              <p className={cn(
                'justify-self-center text-base font-bold',
                chooseTextColor(cl),
              )}
              >
                {counts[1]}
              </p>
            </div>
          );
        })}
      </div>
      <Button
        className="h-12 text-medium font-bold"
        color="primary"
        fullWidth
        onPress={() => {
          setStage('review-moves');
          if (currentMoveNum === 0)
            toNextMove();
        }}
        radius="sm"
      >
        Start Review
      </Button>
    </div>
  );
}
