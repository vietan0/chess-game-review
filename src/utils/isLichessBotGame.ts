import isLichessAI from './isLichessAI';

import type { LichessGame } from '../queries/useMonthlyArchives';

export default function isLichessBotGame(game: LichessGame) {
  return isLichessAI(game.players.white) || isLichessAI(game.players.black);
}
