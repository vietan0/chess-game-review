import { useBoardStore } from '../useBoardStore';

import type { Color } from 'chess.js';

export default function useLoser() {
  const currentGame = useBoardStore(state => state.currentGame);
  const header = currentGame.header();
  const site = header.Site; // Chess.com | lichess.org
  const result = header.Result;
  const isGameOver = ['1-0', '0-1', '1/2-1/2'].includes(result);

  if (!isGameOver || result === '1/2-1/2')
    return { loser: null, loseBy: null };

  const loser: Color | null = result === '1-0' ? 'b' : 'w';
  let loseBy: 'checkmate' | 'resign' | 'timeout' | 'abandoned' | null;

  if (site.includes('Chess.com')) {
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
  else if (site.includes('lichess.org')) {
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
  else {
    // imply raw pgn
    if (currentGame.isCheckmate())
      loseBy = 'checkmate';

    // if can't differentiate between resign/timeout/abandoned, just don't display at all
    loseBy = null;
  }

  return { loser, loseBy };
}
