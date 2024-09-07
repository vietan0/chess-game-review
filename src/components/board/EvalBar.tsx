import { motion } from 'framer-motion';
import { useMemo } from 'react';

import { useBoardStore } from '../../stores/useBoardStore';
import { useEvalStore } from '../../stores/useEvalStore';
import cn from '../../utils/cn';

export default function EvalBar() {
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
      return (cp / 100).toFixed(1);
    }
  });

  const adv = advs.length === 0 ? '0.0' : advs[currentMoveNum];

  const initAdv = advs.length === 0
    ? '0.0'
    : lastNav === 1
      ? advs[currentMoveNum - 1]
      : lastNav === -1
        ? advs[currentMoveNum + 1]
        : adv;

  /**
   * Evaluation number is always displayed on the winning side.
   *
   * If equal (`0.0`), display on the bottom.
   */
  const isTop = useMemo(() => {
    if (adv === '0.0')
      return false;

    if (adv.includes('-')) {
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
      return adv.includes('-') ? 0 : 600;
    }

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
        {adv.includes('-') ? adv.slice(1) : adv}
      </span>
    </div>
  );
}
