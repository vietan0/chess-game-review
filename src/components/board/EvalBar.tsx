import { motion } from 'framer-motion';
import { useMemo } from 'react';

import { useBoardStore } from '../../stores/useBoardStore';
import { formatCp, useEvalStore } from '../../stores/useEvalStore';
import cn from '../../utils/cn';

export default function EvalBar() {
  const currentGame = useBoardStore(state => state.currentGame);
  const isFlipped = useBoardStore(state => state.isFlipped);
  const lastNav = useBoardStore(state => state.lastNav);
  const currentMoveNum = useBoardStore(state => state.currentMoveNum);
  const cps = useEvalStore(state => state.cps);
  const advs = cps.map(formatCp);
  const adv = (advs.length === 0) ? '0.0' : advs[currentMoveNum];

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
   * If equal (`0.0`) or draw (`1-2/1-2`), display on the bottom.
   */
  const isTop = useMemo(() => {
    if (adv === '0.0' || adv === '1/2-1/2')
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

    // games ended in checkmate/stalemate
    if (adv === '1-0')
      return 600;
    if (adv === '0-1')
      return 0;
    if (adv === '1/2-1/2')
      return 300;

    if (Number(adv) > 5)
      return maxHNoMate;
    if (Number(adv) < -5)
      return minHNoMate;

    return 54 * Number(adv) + 300;
  }

  const displayedAdv = useMemo(() => {
    if (adv === '1/2-1/2') {
      return (
        <>
          <span>1/2</span>
          <p className="-my-1">-</p>
          <span>1/2</span>
        </>
      );
    }

    if (adv.startsWith('-') || adv.startsWith('+'))
      // don't display sign
      return adv.slice(1);

    return adv;
  }, [adv]);

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
        'absolute inset-x-0 me-auto ms-auto w-[30px] text-center text-[11px] mix-blend-difference',
        isTop ? 'top-1' : 'bottom-1',
      )}
      >
        {displayedAdv}
      </span>
    </div>
  );
}
