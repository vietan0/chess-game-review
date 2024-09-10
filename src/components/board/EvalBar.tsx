import { motion } from 'framer-motion';
import { useMemo } from 'react';

import { useBoardStore } from '../../stores/useBoardStore';
import { useEvalStore } from '../../stores/useEvalStore';
import cn from '../../utils/cn';

export default function EvalBar() {
  const currentGame = useBoardStore(state => state.currentGame);
  const isFlipped = useBoardStore(state => state.isFlipped);
  const lastNav = useBoardStore(state => state.lastNav);
  const currentMoveNum = useBoardStore(state => state.currentMoveNum);
  const cps = useEvalStore(state => state.computed.cps);

  const advs = cps.map((cp) => {
    if (typeof cp === 'string') {
      // mate in y
      return cp;
    }
    else {
      /*
        Since my Stockfish would give a 1500 cp where chesscom/lichess would give a 750-800,
        I multiply it by 0.6 to arbitrarily map it closer to their results.
        https://www.desmos.com/calculator/gqiwyxdsu3
      */
      return (cp * 0.6 / 100).toFixed(1);
    }
  });

  const result = currentGame.header().Result;

  const adv = useMemo(() => {
    if (advs.length === 0)
      return '0.0';

    if (!advs[currentMoveNum]) {
      /*
        Special case: when game ends in checkmate, advs has one less item than fens.
        So when currentMoveNum is the final move, `advs[currentMoveNum]` returns undefined.
        When that happens, display 1-0 or 0-1.
      */
      return result;
    }

    return advs[currentMoveNum];
  }, [advs, currentMoveNum]);

  const initAdv = advs.length === 0
    ? '0.0'
    : lastNav === 1
      ? advs[currentMoveNum - 1]
      : lastNav === -1
        ? currentGame.isCheckmate() && currentMoveNum === advs.length - 1 /* same special case */
          ? advs[currentMoveNum]
          : advs[currentMoveNum + 1]
        : adv;

  /**
   * Evaluation number is always displayed on the winning side.
   *
   * If equal (`0.0`), display on the bottom.
   */
  const isTop = useMemo(() => {
    if (adv === '0.0')
      return false;

    if (adv.startsWith('-') || adv === '0-1') {
      // black is winning
      return !isFlipped;
    }
    else {
      return isFlipped;
    }
  }, [adv, isFlipped]);

  function calcHeight(adv: string) {
    const maxHNoMate = 600 * 0.95;
    const minHNoMate = 600 * 0.05;
    if (!adv)
      return 300;

    if (adv.includes('M')) {
      // mate in y
      return adv.startsWith('-') ? 0 : 600;
    }

    // games ended in checkmate
    if (adv === '1-0')
      return 600;
    if (adv === '0-1')
      return 0;

    if (Number(adv) > 4)
      return maxHNoMate;
    if (Number(adv) < -4)
      return minHNoMate;

    return 67.5 * Number(adv) + 300;
  }

  return (
    <div className={cn(
      'relative flex w-[30px] flex-col overflow-hidden rounded bg-default-100',
      isFlipped ? 'justify-start' : 'justify-end',
    )}
    >
      <motion.div
        animate={{ height: calcHeight(adv) }}
        className="bg-foreground"
        initial={{ height: calcHeight(initAdv) }}
        key={currentMoveNum}
      >
      </motion.div>
      <span className={cn(
        'absolute inset-x-0 me-auto ms-auto w-fit text-[11px] mix-blend-difference',
        isTop ? 'top-1' : 'bottom-1',
      )}
      >
        {(adv.startsWith('-') || adv.startsWith('+')) ? adv.slice(1) : adv}
        {/* don't display sign */}
      </span>
    </div>
  );
}
