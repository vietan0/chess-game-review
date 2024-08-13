import Abandoned from '../icons/Abandoned';
import Checkmate from '../icons/Checkmate';
import DrawBlack from '../icons/DrawBlack';
import DrawWhite from '../icons/DrawWhite';
import Resign from '../icons/Resign';
import Timeout from '../icons/Timeout';
import Winner from '../icons/Winner';
import { useStore } from '../store';

export default function useEndgameBadges() {
  const currentGame = useStore(state => state.currentGame);
  const header = currentGame.header();
  const site = header.Site; // Chess.com | lichess.org
  const result = header.Result;
  const isGameOver = ['1-0', '0-1', '1/2-1/2'].includes(result);
  let whiteKingBadge;
  let blackKingBadge;

  function getLoserBadge() {
    if (site.includes('Chess.com')) {
      const termination = header.Termination;

      if (termination.includes('checkmate')) {
        return <Checkmate />;
      }
      else if (termination.includes('resignation')) {
        return <Resign />;
      }
      else if (termination.includes('time')) {
        return <Timeout />;
      }
      else {
        // imply termination.includes('abandoned')
        return <Abandoned />;
      }
    }
    else if (site.includes('lichess.org')) {
      const comments = currentGame.getComments();
      const termination = comments[comments.length - 1].comment;

      if (termination.includes('checkmate')) {
        return <Checkmate />;
      }
      else if (termination.includes('resigns')) {
        return <Resign />;
      }
      else if (termination.includes('time')) {
        return <Timeout />;
      }
      else {
        // imply termination.includes('left')
        return <Abandoned />;
      }
    }
    else {
      // imply raw pgn
      if (currentGame.isCheckmate())
        return <Checkmate />;

      // if can't differentiate between resign/timeout/abandoned, just don't display at all
      return null;
    }
  }

  if (!isGameOver) {
    return [null, null];
  }

  if (result === '1-0') {
    whiteKingBadge = <Winner />;
    blackKingBadge = getLoserBadge();
  }
  else if (result === '0-1') {
    whiteKingBadge = getLoserBadge();
    blackKingBadge = <Winner />;
  }
  else {
    // result must be '1/2-1/2'
    whiteKingBadge = <DrawWhite />;
    blackKingBadge = <DrawBlack />;
  }

  return [whiteKingBadge, blackKingBadge];
}
