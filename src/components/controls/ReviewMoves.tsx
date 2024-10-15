import { Button } from '@nextui-org/button';
import { Chess, DEFAULT_POSITION } from 'chess.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import openings from '../../openings';
import { useBoardStore } from '../../stores/useBoardStore';
import { extractEval, formatCp, useEvalStore } from '../../stores/useEvalStore';
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
  const best3MovesAltered = useEvalStore(state => state.best3MovesAltered);

  const best3MovesSan = useMemo(
    () => best3MovesAltered.map((subArr, i) => subArr.map(obj => ({ ...obj, pv: lanToSan(obj.pv, i) }))),
    [best3MovesAltered],
  );

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

  return (
    <div className="grid h-full grid-rows-[auto,_auto,_1fr,_80px] gap-3" id="ReviewMoves">
      <div className="flex flex-col gap-1">
        {best3MovesSan[currentMoveNum]?.map((move, i) => {
          const cp = extractEval(move, currentMoveNum);
          const adv = formatCp(cp);
          let whiteHasAdv: boolean;

          if (typeof cp === 'number') {
            whiteHasAdv = cp >= 0;
          }
          else {
            whiteHasAdv = cp.startsWith('+');
          }

          return (
            <div className="grid grid-cols-[60px,_1fr] items-center justify-items-start gap-4 text-small" key={i}>
              <p className="font-bold">{move.pv}</p>
              <p
                className={cn(
                  'rounded-sm px-2 py-1 font-bold',
                  whiteHasAdv ? 'bg-foreground text-background' : 'bg-default-100',
                )}
              >
                {(adv.startsWith('-') || adv.startsWith('+')) ? adv.slice(1) : adv}
              </p>
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
