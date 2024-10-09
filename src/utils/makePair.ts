/**
 * Turn a 1D array into a 2D array (group every 2 items together).
 */
export default function makePair<T>(arr: T[]): T[][] {
  const result = [];

  for (let i = 0; i < arr.length; i++) {
    if (i % 2 === 0) {
      result.push([arr[i]]);
    }
    else {
      result[result.length - 1].push(arr[i]);
    }
  }

  return result;
}
