import Abandoned from '../icons/Abandoned';
import Checkmate from '../icons/Checkmate';
import DrawBlack from '../icons/DrawBlack';
import DrawWhite from '../icons/DrawWhite';
import Resign from '../icons/Resign';
import Timeout from '../icons/Timeout';
import Winner from '../icons/Winner';
import { useBoardStore } from '../useBoardStore';
import useLoser from './useLoser';

export default function useEndgameBadges() {
  const currentGame = useBoardStore(state => state.currentGame);
  const header = currentGame.header();
  const result = header.Result;
  const isGameOver = ['1-0', '0-1', '1/2-1/2'].includes(result);
  let whiteKingBadge;
  let blackKingBadge;
  const { loseBy } = useLoser();

  const badgeMap = {
    checkmate: <Checkmate />,
    resign: <Resign />,
    timeout: <Timeout />,
    abandoned: <Abandoned />,
    unknown: null,
  };

  if (!isGameOver) {
    return [null, null];
  }

  if (result === '1-0') {
    whiteKingBadge = <Winner />;
    blackKingBadge = badgeMap[loseBy!];
  }
  else if (result === '0-1') {
    whiteKingBadge = badgeMap[loseBy!];
    blackKingBadge = <Winner />;
  }
  else {
    // result must be '1/2-1/2'
    whiteKingBadge = <DrawWhite />;
    blackKingBadge = <DrawBlack />;
  }

  return [whiteKingBadge, blackKingBadge];
}
