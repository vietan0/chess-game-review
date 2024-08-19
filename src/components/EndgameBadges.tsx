import { useBoardStore } from '../useBoardStore';
import translatePiece from '../utils/translatePiece';
import useEndgameBadges from '../utils/useEndgameBadges';
import useKingSquares from '../utils/useKingSquares';

export default function EndgameBadges() {
  const [wkBadge, bkBadge] = useEndgameBadges();
  const [wkSquare, bkSquare] = useKingSquares();
  const currentGame = useBoardStore(state => state.currentGame);
  const currentMoveNum = useBoardStore(state => state.currentMoveNum);
  const isFlipped = useBoardStore(state => state.isFlipped);
  const result = currentGame.header().Result;
  const isGameOver = ['1-0', '0-1', '1/2-1/2'].includes(result);
  const history = currentGame.history({ verbose: true });
  const isFinalMove = currentMoveNum === history.length;
  const [wx, wy] = translatePiece(wkSquare, isFlipped);
  const [bx, by] = translatePiece(bkSquare, isFlipped);

  if (isGameOver && isFinalMove) {
    return (
      <div className="absolute size-full text-background">
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
