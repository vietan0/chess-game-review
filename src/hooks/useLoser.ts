import { useBoardStore } from '../stores/useBoardStore';
import useResult from './useResult';

import type { Color } from 'chess.js';

export default function useLoser() {
  const currentGame = useBoardStore(state => state.currentGame);
  const header = currentGame.header();
  const result = useResult();
  let loser: Color | null;
  let loseBy: 'checkmate' | 'resign' | 'timeout' | 'abandoned' | null;
  const isGameOver = result && ['1-0', '0-1', '1/2-1/2'].includes(result);

  // determine from PGN body first, not header
  if (!isGameOver) {
    loser = null;
    loseBy = null;
  }
  else {
    if (result === '1/2-1/2') {
      loser = null;
      loseBy = null;
    }
    else if (result === '1-0') {
      loser = 'b';
      loseBy = currentGame.isCheckmate() ? 'checkmate' : null;
    }
    else {
      // result === '0-1'
      loser = 'w';
      loseBy = currentGame.isCheckmate() ? 'checkmate' : null;
    }
  }

  // determine further loseBy if site is Chess.com or Lichess
  if (header.Site) {
    if (header.Site.includes('Chess.com')) {
      const termination = header.Termination;

      if (termination.includes('checkmate')) {
        loseBy = 'checkmate';
      }
      else if (termination.includes('resignation')) {
        loseBy = 'resign';
      }
      else if (termination.includes('time')) {
        loseBy = 'timeout';
      }
      else {
        // imply termination.includes('abandoned')
        loseBy = 'abandoned';
      }
    }
    else if (header.Site.includes('lichess.org')) {
      const comments = currentGame.getComments();
      const termination = comments[comments.length - 1].comment;

      if (termination.includes('checkmate')) {
        loseBy = 'checkmate';
      }
      else if (termination.includes('resigns')) {
        loseBy = 'resign';
      }
      else if (termination.includes('time')) {
        loseBy = 'timeout';
      }
      else {
        // imply termination.includes('left')
        loseBy = 'abandoned';
      }
    }
  }

  return { loser, loseBy };
}
