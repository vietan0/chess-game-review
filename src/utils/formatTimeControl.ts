import dayjs from 'dayjs';

import type { ChessComGame, LichessGame } from '../queries/useMonthlyArchives'; // ES 2015

export const dailyIncrementRegex = /(?<=\/)\d+$/;
// 3 cases: no increment OR increment OR x moves in y hours then increment
// test: https://regexr.com/89nnm
export const mainTimeRegex = /^\d+$|^\d+(?=\+)|(?<=\/)\d+(?=:\d)/;
const incrementRegex = /(?<=\+)\d+$/;

/**
 * Formats a time control string in the format used by Chess.com.
 *
 * @example
 * formatChessComTimeControl('600+5') // '10 | 5'
 * formatChessComTimeControl('1800') // '30m'
 */
export function formatChessComTimeControl(timeControl: ChessComGame['time_control']) {
  if (timeControl.startsWith('1/')) {
    // daily game
    const dailyIncrement = timeControl.match(dailyIncrementRegex)![0];
    const formatted = dayjs.duration(Number(dailyIncrement), 'seconds').format('D[d]');

    return formatted;
  }

  let mainTime = '';
  let increment = '';
  const mainTimeMatch = timeControl.match(mainTimeRegex);

  if (!mainTimeMatch)
    return `invalid time control: ${timeControl}`;

  const seconds = Number(mainTimeMatch[0]);

  if (seconds < 60) {
    mainTime = dayjs.duration(seconds, 'seconds').format('ss[s]');
  }
  else {
    mainTime = dayjs.duration(seconds, 'seconds').format('m[m]');
  }

  const incrementMatch = timeControl.match(incrementRegex);

  if (incrementMatch) {
    increment = incrementMatch[0];
  }

  return increment ? `${mainTime.slice(0, -1)} | ${increment}` : mainTime;
}

export function formatLichessTimeControl(game: LichessGame) {
  if (game.speed === 'correspondence') {
    // daily game
    return dayjs.duration(game.daysPerTurn!, 'days').format('D[d]');
  }

  let mainTime = '';

  if (game.clock.initial < 60) {
    mainTime = dayjs.duration(game.clock.initial, 'seconds').format('ss[s]');
  }
  else {
    mainTime = dayjs.duration(game.clock.initial, 'seconds').format('m[m]');
  }

  return game.clock.increment ? `${mainTime.slice(0, -1)} | ${game.clock.increment}` : mainTime;
}
