export const mainTimeRegex = /\d+(?=\+)|^\d+$/;
const incrementRegex = /(?<=\+)\d+$/;

// from 600+5 to 10|5
// from 1800 to 30
export default function formatTimeControl(timeControl: string) {
  let mainTime = '';
  let increment = '';
  const mainTimeMatches = timeControl.match(mainTimeRegex);
  if (!mainTimeMatches)
    throw new Error('invalid time control');

  const seconds = Number(mainTimeMatches[0]);

  if (seconds < 60) {
    mainTime = `${String(seconds)}s`;
  }
  else {
    mainTime = `${String(seconds / 60)}m`;
  }

  const incrementMatches = timeControl.match(incrementRegex);

  if (incrementMatches) {
    increment = incrementMatches[0];
  }

  return increment ? `${mainTime.slice(0, mainTime.length - 1)} | ${increment}` : mainTime;
}
