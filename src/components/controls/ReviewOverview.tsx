import { Button } from '@nextui-org/button';

import { useBoardStore } from '../../stores/useBoardStore';
import { useEvalStore } from '../../stores/useEvalStore';
import { useStageStore } from '../../stores/useStageStore';
import useNames from '../../utils/useNames';
import EvalGraph from './EvalGraph';

export default function ReviewOverview() {
  const [wName, bName] = useNames();
  const currentMoveNum = useBoardStore(state => state.currentMoveNum);
  const toNextMove = useBoardStore(state => state.toNextMove);
  const accuracy = useEvalStore(state => state.accuracy);
  const setStage = useStageStore(state => state.setStage);

  return (
    <div id="ReviewOverview">
      <EvalGraph />
      <div className="mt-4 flex flex-col gap-2" id="accuracy">
        <div className="grid grid-cols-[180px,_1fr,_1fr] items-center gap-4">
          <p>Players</p>
          <p className="overflow-x-scroll text-ellipsis font-bold">{wName}</p>
          <p className="overflow-x-scroll text-ellipsis font-bold">{bName}</p>
        </div>
        <div className="grid grid-cols-[180px,_1fr,_1fr] items-center gap-4">
          <p>Accuracy</p>
          <div><span className="inline-block rounded bg-white px-3 py-2 font-bold text-background">{accuracy[0]}</span></div>
          <div><span className="inline-block rounded bg-default-100 px-3 py-2 font-bold">{accuracy[1]}</span></div>
        </div>
      </div>
      <p>Move Classifications</p>
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
