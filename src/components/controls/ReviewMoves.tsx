import { Button } from '@nextui-org/button';
import { Chess, DEFAULT_POSITION } from 'chess.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import openings from '../../openings';
import { useBoardStore } from '../../stores/useBoardStore';
import { formatCp, useEvalStore } from '../../stores/useEvalStore';
import classify from '../../utils/classify';
import cn from '../../utils/cn';
import makePair from '../../utils/makePair';
import EvalGraph from './EvalGraph';

import type { Move } from 'chess.js';

export default function ReviewMoves() {
  const {
    currentGame,
    currentMoveNum,
  } = useBoardStore(useShallow(state => ({
    currentGame: state.currentGame,
    currentMoveNum: state.currentMoveNum,
  })));

  const history = currentGame.history({ verbose: true });
  const fens = [DEFAULT_POSITION, ...history.map(move => move.after)];
  const best3MovesMod = useEvalStore(state => state.best3MovesMod);
  const cps = useEvalStore(state => state.cps);
  const [openingName, setOpeningName] = useState('Starting Position');

  useEffect(() => {
    const currentFen = fens[currentMoveNum];
    const found = openings.find(opening => opening.fen.includes(currentFen.split(' ')[0]));
    if (found && found.name !== openingName)
      setOpeningName(found.name);
  }, [currentMoveNum]);

  function lanToSan(lan: string, i: number) {
    const possibleMoves = new Chess(fens[i]).moves({ verbose: true });
    const found = possibleMoves.find(move => move.lan === lan)!;

    if (!found) {
      console.error(`Cant find legal move ${lan} in fen [${i}]: ${fens[i]}`);

      return `lan-${lan}`;
    }

    return found!.san;
  }

  const historyPairs = makePair(history);
  const currentMove = history[currentMoveNum - 1];
  const advs = cps.map(formatCp);
  const adv = (advs.length === 0) ? '0.0' : advs[currentMoveNum];

  const whiteHasAdv = useMemo(() => {
    let whiteHasAdv: boolean;

    if (typeof cps[currentMoveNum] === 'number') {
      whiteHasAdv = cps[currentMoveNum] >= 0;
    }
    else {
      whiteHasAdv = cps[currentMoveNum].startsWith('+');
    }

    return whiteHasAdv;
  }, [currentMoveNum]);

  const currentMoveClass = useMemo(() => {
    // if played move is in top 3
    // find class in best3MovesMod array (specifically for 'forced' case)
    // else call classify() again
    if (currentMoveNum === 0)
      return '';

    return classify(cps[currentMoveNum - 1], cps[currentMoveNum], currentMoveNum - 1, best3MovesMod[currentMoveNum - 1].length === 1);
  }, [currentMoveNum]);

  return (
    <div className="grid h-full grid-rows-[auto,_auto,_1fr,_80px] gap-3" id="ReviewMoves">
      <div className="flex flex-col gap-1">
        {currentMoveNum > 0 && (
          <>
            <p className="flex justify-between gap-2">
              <span>
                <span className="font-bold">
                  {currentMove.san}
                </span>
                {' '}
                was
                {' '}
                {currentMoveClass}
              </span>
              <span
                className={cn(
                  'w-12 rounded-sm px-2 py-1 text-center font-bold',
                  whiteHasAdv ? 'bg-foreground text-background' : 'bg-default-100',
                )}
              >
                {(adv.startsWith('-') || adv.startsWith('+')) ? adv.slice(1) : adv}
              </span>
            </p>
          </>
        )}
        {best3MovesMod[currentMoveNum - 1]?.map((move, i) => {
          let whiteHasAdv: boolean;
          const adv = formatCp(move.eval);

          if (typeof move.eval === 'number') {
            whiteHasAdv = move.eval >= 0;
          }
          else {
            whiteHasAdv = move.eval.startsWith('+');
          }

          return (
            <div className="grid grid-cols-[60px,_60px,_1fr] items-center justify-items-start gap-4 text-small" key={i}>
              <p className="font-bold">{lanToSan(move.pv, currentMoveNum - 1)}</p>
              <p
                className={cn(
                  'w-12 rounded-sm px-2 py-1 text-center font-bold',
                  whiteHasAdv ? 'bg-foreground text-background' : 'bg-default-100',
                )}
              >
                {(adv.startsWith('-') || adv.startsWith('+')) ? adv.slice(1) : adv}
              </p>
              <p>{move.classification}</p>
            </div>
          );
        })}
      </div>
      <p className="text-small text-foreground-500">{openingName}</p>
      <div className="overflow-scroll">
        <div className="flex flex-col">
          {historyPairs.map((pair, i) => (
            <div
              className={cn(
                'grid grid-cols-[30px,_90px,_90px] items-center justify-items-start gap-2 pl-2',
                i % 2 === 1 && 'bg-default-100/50',
              )}
              key={i}
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
  const ref = useRef<HTMLButtonElement>(null);
  const currentMoveNum = useBoardStore(state => state.currentMoveNum);
  const toMove = useBoardStore(state => state.toMove);
  let realIndex = pairIndex * 2 + 1;

  if (move.color === 'b') {
    realIndex += 1;
  }

  useEffect(() => {
    if (currentMoveNum === realIndex) {
      if (window.innerWidth >= 1024) {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [currentMoveNum]);

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
      ref={ref}
      size="sm"
      variant="light"
    >
      {move.san}
    </Button>
  );
}
