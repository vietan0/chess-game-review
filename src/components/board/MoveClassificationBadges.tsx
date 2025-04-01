import { useShallow } from 'zustand/react/shallow';

import MoveClassification from '../../icons/move-classifications/MoveClassification';
import { useBoardStore } from '../../stores/useBoardStore';
import { useEvalStore } from '../../stores/useEvalStore';
import badgeStyle from '../../utils/badgeStyle';
import translatePiece from '../../utils/translatePiece';

export default function MoveClassificationBadges() {
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
  const history = currentGame.history({ verbose: true });
  const currentMove = history[currentMoveNum - 1];

  if (!currentMove)
    return null;
  const classification = classHistory[currentMoveNum - 1];
  const [x, y] = translatePiece(currentMove.to, isFlipped);

  return (
    <div className="pointer-events-none absolute size-full" id="move-classification-badges">
      <div
        className="absolute size-[12.5%]"
        style={{ transform: `translate(${x + 80}%, ${y - 17.5}%)` }}
      >
        <MoveClassification
          classification={classification}
          style={badgeStyle}
        />
      </div>
    </div>
  );
}
