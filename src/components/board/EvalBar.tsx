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

  /**
   * Calculate the height of the evaluation bar *in percentage* based on the evaluation number.
   */
  function calcHeight(adv: string | undefined) {
    if (!adv)
      return 50;

    const maxHNoMate = 95;
    const minHNoMate = 5;

    if (adv.includes('M')) {
      // mate in y
      return adv.startsWith('-') ? 0 : 100;
    }

    // games ended in checkmate/stalemate
    if (adv === '1-0')
      return 100;
    if (adv === '0-1')
      return 0;
    if (adv === '1/2-1/2')
      return 50;

    if (Number(adv) > 5)
      return maxHNoMate;
    if (Number(adv) < -5)
      return minHNoMate;

    return 9 * Number(adv) + 50;
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
      `
        relative flex w-6 shrink-0 flex-col overflow-hidden rounded
        bg-default-100
        xs:w-[30px]
      `,
      isFlipped ? 'justify-start' : 'justify-end',
    )}
    >
      <motion.div
        animate={{ height: `${calcHeight(adv)}%` }}
        className="bg-foreground"
        initial={{ height: `${calcHeight(initAdv)}%` }}
        key={currentMoveNum}
      >
      </motion.div>
      <span className={cn(
        `
          absolute inset-x-0 ms-auto me-auto w-full text-center text-[9px]
          mix-blend-difference
          xs:text-[11px]
        `,
        isTop ? 'top-1' : 'bottom-1',
      )}
      >
        {displayedAdv}
      </span>
    </div>
  );
}
