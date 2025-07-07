import { Button } from '@heroui/button';
import { Icon } from '@iconify/react/dist/iconify.js';
import { DEFAULT_POSITION } from 'chess.js';
import { useEffect, useMemo, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';

import MoveClassification from '../../icons/move-classifications/MoveClassification';
import { useBoardStore } from '../../stores/useBoardStore';
import { formatCp, useEvalStore } from '../../stores/useEvalStore';
import { chooseTextColor } from '../../utils/chooseColorFromClassification';
import cn from '../../utils/cn';
import lanToSan from '../../utils/lanToSan';
import makePair from '../../utils/makePair';
import EvalGraph from './EvalGraph';

import type { Move } from 'chess.js';

export default function ReviewMoves() {
  const {
    currentGame,
    currentMoveNum,
    isFlipped,
  } = useBoardStore(useShallow(state => ({
    currentGame: state.currentGame,
    currentMoveNum: state.currentMoveNum,
    isFlipped: state.isFlipped,
  })));

  const history = currentGame.history({ verbose: true });
  const fens = [DEFAULT_POSITION, ...history.map(move => move.after)];

  const {
    best3MovesWithClass,
    cps,
    classHistory,
    openingNames,
  } = useEvalStore(useShallow(state => ({
    best3MovesWithClass: state.best3MovesWithClass,
    cps: state.cps,
    classHistory: state.classHistory,
    openingNames: state.openingNames,
  })));

  const historyPairs = makePair(history);
  const currentMove = history[currentMoveNum - 1];
  const classification = classHistory[currentMoveNum - 1];
  const advs = cps.map(formatCp);
  const adv = (advs.length === 0) ? '0.0' : advs[currentMoveNum];

  const whiteHasAdv = useMemo(() => {
    let whiteHasAdv: boolean;

    if (typeof cps[currentMoveNum] === 'number') {
      whiteHasAdv = cps[currentMoveNum] >= 0;
    }
    else {
      whiteHasAdv = cps[currentMoveNum].startsWith('+') || cps[currentMoveNum] === '1-0';
    }

    return whiteHasAdv;
  }, [currentMoveNum]);

  const result = currentGame.header().Result;

  return (
    <div className="grid h-full grid-rows-[auto,_auto,_auto,_1fr,_80px] gap-3" id="ReviewMoves">
      <div className="flex flex-col gap-1">
        {currentMoveNum > 0 && (
          <p className="flex justify-between gap-2">
            <span>
              <MoveClassification
                classification={classification}
                className="mr-1 inline-block"
              />
              <span className="font-bold">
                {currentMove.san}
              </span>
              {' '}
              is
              {' '}
              {classification === 'book'
                ? 'a book move'
                : classification === 'inaccuracy'
                  ? 'an inaccuracy'
                  : ['blunder', 'mistake'].includes(classification)
                      ? `a ${classification}`
                      : classification}
            </span>
            <span
              className={cn(
                'rounded-sm px-2 py-1 text-center font-bold',
                whiteHasAdv ? 'bg-foreground text-background' : 'bg-default-100',
                adv === '1/2-1/2' ? 'w-20' : 'w-14',
              )}
            >
              {(adv.startsWith('-') || adv.startsWith('+')) ? adv.slice(1) : adv}
            </span>
          </p>
        )}
        {best3MovesWithClass[currentMoveNum - 1]
          ?.filter(move => move.pv !== currentMove.lan)
          .map((move, i) => {
            let adv;
            const san = lanToSan(move.pv, currentMoveNum - 1, fens);

            if (san.endsWith('#')) {
              const moveEval = move.eval as string;
              adv = moveEval.startsWith('+') ? '1-0' : '0-1';
            }
            else {
              adv = formatCp(move.eval);
            }

            let whiteHasAdv: boolean;

            if (typeof move.eval === 'number') {
              whiteHasAdv = move.eval >= 0;
            }
            else {
              whiteHasAdv = move.eval.startsWith('+');
            }

            return (
              <div className="grid grid-cols-[90px,_1fr] items-center justify-items-start gap-4 text-small" key={i}>
                <p className="font-bold">
                  <MoveClassification
                    classification={move.classification}
                    className="mr-1 inline-block size-5"
                  />
                  {san}
                </p>
                <p
                  className={cn(
                    'w-12 rounded-sm px-2 py-1 text-center font-bold',
                    whiteHasAdv ? 'bg-foreground text-background' : 'bg-default-100',
                  )}
                >
                  {(adv.startsWith('-') || adv.startsWith('+')) ? adv.slice(1) : adv}
                </p>
              </div>
            );
          })}
      </div>
      <p className="text-small text-foreground-500">{openingNames[currentMoveNum]}</p>
      <div className="flex gap-4">
        <a
          className="flex w-fit gap-0 text-tiny text-foreground-500 hover:underline"
          href={`https://www.chess.com/analysis?fen=${fens[currentMoveNum]}&flip=${isFlipped}`}
          target="_blank"
        >
          <span>chess.com</span>
          <Icon
            className="text-small"
            icon="material-symbols:arrow-outward-rounded"
          />
        </a>
        <a
          className="flex w-fit gap-0 text-tiny text-foreground-500 hover:underline"
          href={`https://lichess.org/analysis/${fens[currentMoveNum]}`}
          target="_blank"
        >
          <span>lichess</span>
          <Icon
            className="text-small"
            icon="material-symbols:arrow-outward-rounded"
          />
        </a>
      </div>
      <div className="overflow-scroll">
        <div className="flex flex-col">
          {historyPairs.map((pair, i) => (
            <div
              className={cn(
                'grid grid-cols-[40px,_90px,_90px] items-center justify-items-start gap-2 pl-2',
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
          <p className="p-2 text-tiny font-bold text-foreground-500">{result}</p>
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
  const classHistory = useEvalStore(state => state.classHistory);
  let realIndex = pairIndex * 2 + 1;

  if (move.color === 'b') {
    realIndex += 1;
  }

  const classification = classHistory[realIndex - 1];

  useEffect(() => {
    if (currentMoveNum === realIndex) {
      if (window.innerWidth >= 1024) {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [currentMoveNum]);

  return (
    <div className="relative">
      {['inaccuracy', 'mistake', 'blunder'].includes(classification) && (
        <MoveClassification
          classification={classification}
          className="absolute -left-5 top-1.5 size-5 cursor-pointer"
          onClick={() => toMove(realIndex)}
        />
      )}
      <Button
        className={cn(
          'min-w-0 justify-start rounded-[4px] px-2 font-bold',
          currentMoveNum === realIndex && 'bg-default-200',
          chooseTextColor(classification),
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
    </div>
  );
}
