import { useShallow } from 'zustand/react/shallow';

import { useBoardStore } from '../../stores/useBoardStore';
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

  if (currentMoveNum === 0)
    return null;
  const history = currentGame.history({ verbose: true });
  const currentMove = history[currentMoveNum - 1];
  const [xFrom, yFrom] = translatePiece(currentMove.from, isFlipped);
  const [xTo, yTo] = translatePiece(currentMove.to, isFlipped);

  return (
    <div id="highlight">
      <div
        className="absolute size-[12.5%] bg-highlight"
        style={{ transform: `translate(${xFrom}%, ${yFrom}%)` }}
      />
      <div
        className="absolute size-[12.5%] bg-highlight"
        style={{ transform: `translate(${xTo}%, ${yTo}%)` }}
      />
    </div>
  );
}
