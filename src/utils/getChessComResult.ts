import type { ChessComGame } from '../queries/useMonthlyArchives';

export default function getChessComResult(username: string, game: ChessComGame) {
  const userColor = username.toLowerCase() === game.white.username.toLowerCase() ? 'w' : 'b';

  if (game.pgn.endsWith('1-0\n'))
    return userColor === 'w' ? 'win' : 'lose';
  else if (game.pgn.endsWith('0-1\n'))
    return userColor === 'w' ? 'lose' : 'win';
  else return 'draw';
}
