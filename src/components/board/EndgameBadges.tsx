import useEndgameBadges from '../../hooks/useEndgameBadges';
import useKingSquares from '../../hooks/useKingSquares';
import useResult from '../../hooks/useResult';
import { useBoardStore } from '../../stores/useBoardStore';
import translatePiece from '../../utils/translatePiece';

export default function EndgameBadges() {
  const [wkBadge, bkBadge] = useEndgameBadges();
  const [wkSquare, bkSquare] = useKingSquares();
  const currentGame = useBoardStore(state => state.currentGame);
  const currentMoveNum = useBoardStore(state => state.currentMoveNum);
  const isFlipped = useBoardStore(state => state.isFlipped);
  const result = useResult();
  const isGameOver = result && ['1-0', '0-1', '1/2-1/2'].includes(result);
  const history = currentGame.history({ verbose: true });
  const isFinalMove = currentMoveNum === history.length;
  const [wx, wy] = translatePiece(wkSquare, isFlipped);
  const [bx, by] = translatePiece(bkSquare, isFlipped);

  if (isGameOver && isFinalMove) {
    return (
      <div className="pointer-events-none absolute size-full text-background" id="endgame-badges">
        <div
          className="absolute size-[12.5%]"
          style={{ transform: `translate(${wx + 80}%, ${wy - 17.5}%)` }}
        >
          {wkBadge}
        </div>
        <div
          className="absolute size-[12.5%]"
          style={{ transform: `translate(${bx + 80}%, ${by - 17.5}%)` }}
        >
          {bkBadge}
        </div>
      </div>
    );
  }
}
