import dayjs from 'dayjs';

export const dailyIncrementRegex = /(?<=\/)\d+$/;
export const mainTimeRegex = /\d+(?=\+)|^\d+$/;
const incrementRegex = /(?<=\+)\d+$/;

// from 600+5 to 10 | 5
// from 1800 to 30m
export default function formatTimeControl(timeControl: string) {
  if (timeControl.includes('/')) {
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
