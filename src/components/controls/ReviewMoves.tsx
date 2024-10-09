import { Button } from '@nextui-org/button';
import { Chess, DEFAULT_POSITION } from 'chess.js';

import { useBoardStore } from '../../stores/useBoardStore';
import { useEvalStore } from '../../stores/useEvalStore';
import cn from '../../utils/cn';
import makePair from '../../utils/makePair';
import EvalGraph from './EvalGraph';

import type { Move } from 'chess.js';

export default function ReviewMoves() {
  const currentGame = useBoardStore(state => state.currentGame);
  const history = currentGame.history({ verbose: true });
  const fens = [DEFAULT_POSITION, ...history.map(move => move.after)];
  const best3Moves = useEvalStore(state => state.best3MovesAltered);
  const best3MovesSan = best3Moves.map((subArr, i) => subArr.map(obj => lanToSan(obj.pv, i)));

  // create move pairs arrays from history
  function lanToSan(lan: string, i: number) {
    const possibleMoves = new Chess(fens[i]).moves({ verbose: true });
    const found = possibleMoves.find(move => move.lan === lan)!;

    if (!found) {
      console.error(`Cant find legal move ${lan} in fen [${i}]: ${fens[i]}`);

      return `lan-${lan}`;
    }

    return found!.san;
  }

  const best3MovesDiv = (
    <div id="best3Moves">
      <div className="grid grid-cols-[30px,_1fr] gap-4">
        <code className="justify-self-end font-bold">i</code>
        <code className="font-bold">Best 3 Moves</code>
      </div>
      {best3MovesSan.map((subArr, i) => (
        <div
          className="grid grid-cols-[30px,_1fr] gap-4"
          key={i}
        >
          <code className="justify-self-end">{i}</code>
          <code>{JSON.stringify(subArr)}</code>
        </div>
      ))}
    </div>
  );

  const historyPairs = makePair(history);

  return (
    <div className="grid h-full grid-rows-[1fr,_80px] gap-2" id="ReviewMoves">
      <div className="overflow-scroll">
        <div className="flex flex-col">
          {historyPairs.map((pair, i) => (
            <div className={cn(
              'grid grid-cols-[20px,_70px,_70px] items-center justify-items-start gap-2 pl-2',
              i % 2 === 1 && 'bg-default-100/50',
            )}
            >
              <p className="text-tiny text-foreground-500">
                {i + 1}
                .
              </p>
              <MoveButton move={pair[0]} pairIndex={i} />
              {pair[1] && <MoveButton move={pair[1]} pairIndex={i} />}
            </div>
          ),
          )}
        </div>
      </div>
      <EvalGraph />
    </div>
  );
}

function MoveButton({ pairIndex, move }: { pairIndex: number; move: Move }) {
  const currentMoveNum = useBoardStore(state => state.currentMoveNum);
  const toMove = useBoardStore(state => state.toMove);
  let realIndex = pairIndex * 2 + 1;

  if (move.color === 'b') {
    realIndex += 1;
  }

  return (
    <Button
      className={cn(
        'min-w-0 justify-start rounded-[4px] px-2 font-bold',
        currentMoveNum === realIndex && 'bg-default-200',
      )}
      disableAnimation
      disableRipple
      onPress={() => toMove(realIndex)}
      radius="sm"
      size="sm"
      variant="light"
    >
      {move.san}
    </Button>
  );
}
