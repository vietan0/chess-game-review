import type { ChessComGame } from '../queries/useMonthlyArchives';

export default function isChessComBotGame(game: ChessComGame) {
  return game.time_control.endsWith('/0');
}
