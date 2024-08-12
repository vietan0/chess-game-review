/**
 * Convert timestamps to a readable format.
 *
 * Only shows miliseconds under 20s.
 * @example
 * `1:59:32.5` to `1:59:32`
 * `0:40:10.5` to `40:10`
 * `0:01:33.5` to `1:33`
 * `0:00:24.5` to `0:24`
 * `0:00:12.5` to `0:12.5`
 * @param timestamp always in `H:MM:ss[.S]` format
 */
export default function formatTimestamp(timestamp: string) {
  let formatted = timestamp;
  const hours = Number(timestamp[0]);
  const minutes = Number(timestamp.slice(2, 4));
  const seconds = Number(timestamp.slice(5, 7));

  if (hours === 0) {
    // 1. hide hours if less than 1 hour
    formatted = formatted.slice(2);

    if (minutes < 10) {
      // 2. get rid of second digit in minutes if less than 10
      formatted = formatted.slice(1);
    }
  }

  if (minutes > 0 || (minutes === 0 && seconds >= 20)) {
    // 3. hide miliseconds if more than 20s
    if (timestamp.length > 7) {
      formatted = formatted.slice(0, 4);
    }
  }

  return formatted;
}
