import type { ChessComGame, LichessGame } from '../queries/useMonthlyArchives';

export default function isChessCom(game: ChessComGame | LichessGame): game is ChessComGame {
  return (game as ChessComGame).uuid !== undefined;
}
