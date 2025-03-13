import isLichessAI from './isLichessAI';

import type { LichessGame } from '../queries/useMonthlyArchives';

export default function getLichessResult(username: string, game: LichessGame) {
  let userColor = '';

  if (isLichessAI(game.players.white)) {
    userColor = 'b';
  }
  else if (isLichessAI(game.players.black)) {
    userColor = 'w';
  }
  else {
    userColor = username.toLowerCase() === game.players.white.user.id.toLowerCase() ? 'w' : 'b';
  }

  if (game.winner === 'white')
    return userColor === 'w' ? 'win' : 'lose';
  else if (game.winner === 'black')
    return userColor === 'w' ? 'lose' : 'win';
  else return 'draw';
}
