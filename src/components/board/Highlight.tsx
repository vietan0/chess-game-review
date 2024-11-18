import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useBoardStore } from '../../stores/useBoardStore';
import { useEvalStore } from '../../stores/useEvalStore';
import { useManualHighlightStore } from '../../stores/useManualHighlightStore';
import { chooseHighlightColor } from '../../utils/chooseColorFromClassification';
import cn from '../../utils/cn';
import translatePiece from '../../utils/translatePiece';

export default function Highlight() {
  const {
    currentGame,
    currentMoveNum,
    isFlipped,
  } = useBoardStore(useShallow(state => ({
    currentGame: state.currentGame,
    currentMoveNum: state.currentMoveNum,
    isFlipped: state.isFlipped,
  })));

  const classHistory = useEvalStore(state => state.classHistory);
  const manualHighlight = useManualHighlightStore(state => state.squares);

  const manualHighlightDiv = manualHighlight.map((square) => {
    const [xFrom, yFrom] = translatePiece(square, isFlipped);

    return (
      <div
        className="absolute size-[12.5%]"
        key={square}
        style={{
          transform: `translate(${xFrom}%, ${yFrom}%)`,
          backgroundColor: 'rgb(235, 97, 80)',
          opacity: 0.8,
        }}
      />
    );
  });

  const classHighlightDiv = useMemo(() => {
    if (currentMoveNum === 0)
      return null;
    const history = currentGame.history({ verbose: true });
    const currentMove = history[currentMoveNum - 1];
    const [xFrom, yFrom] = translatePiece(currentMove.from, isFlipped);
    const [xTo, yTo] = translatePiece(currentMove.to, isFlipped);
    const classification = classHistory[currentMoveNum - 1];

    return (
      <>
        <div
          className={cn('absolute size-[12.5%]', chooseHighlightColor(classification))}
          style={{ transform: `translate(${xFrom}%, ${yFrom}%)` }}
        />
        <div
          className={cn('absolute size-[12.5%]', chooseHighlightColor(classification))}
          style={{ transform: `translate(${xTo}%, ${yTo}%)` }}
        />
      </>
    );
  }, [currentMoveNum, isFlipped]);

  return (
    <div className="absolute size-full" id="highlight">
      {classHighlightDiv}
      {manualHighlightDiv}
    </div>
  );
}
