import dayjs from 'dayjs';

/**
 * Groups an array of links by year.
 *
 * @param links - An array of links to be grouped by year -
 * e.g. returned from this URL https://api.chess.com/pub/player/erik/games/archives
 * @return A 2D array where each sub-array contains links from the same year.
 */
export function groupChessComLinksByYear(links: string[]) {
  const initialValue: string[][] = [];

  return links.reduce((result: string[][], link: string) => {
    const year = link.slice(-7, -3); // e.g. '2024'

    // check if there exists a subArr in the result,
    // push the link to that subArr if it exists, create a subArr if not
    const subArrYearIndex = result.findIndex((subArr: string[]) => {
      const subArrWithStringThatContainsYear = subArr.some((link: string) => link.includes(year));

      return subArrWithStringThatContainsYear;
    });

    if (subArrYearIndex < 0) {
      result.push([link]);
    }
    else {
      result[subArrYearIndex].push(link);
    }

    return result;
  }, initialValue);
}

/**
 * Extracts the specified unit (month or year) from a Lichess link.
 *
 * @example
 * getUnitFromLichessLink('https://lichess.org/api/games/user/vietan0?since=1722445200000&to=1725123600000', 'year'); // 2024
 */
export function getUnitFromLichessLink(link: string, unit: 'month' | 'year') {
  const sinceRegex = /(?<=since=)\d+(?=&to)/;
  const sinceStr = link.match(sinceRegex)![0];
  const since = Number(sinceStr); // UNIX timestamp
  const year = dayjs(since).year();
  const month = dayjs(since).month() + 1;

  return unit === 'month' ? month : year;
}

export function groupLichessLinksByYear(links: string[]) {
  const initialValue: string[][] = [];

  return links.reduce((result: string[][], link: string) => {
    const year = getUnitFromLichessLink(link, 'year');

    // check if there exists a subArr in the result,
    // push the link to that subArr if it exists, create a subArr if not
    const subArrYearIndex = result.findIndex((subArr: string[]) => {
      const subArrWithUnixFromYear = subArr.some((link: string) => {
        const linkYear = getUnitFromLichessLink(link, 'year');

        return year === linkYear;
      });

      return subArrWithUnixFromYear;
    });

    if (subArrYearIndex < 0) {
      result.push([link]);
    }
    else {
      result[subArrYearIndex].push(link);
    }

    return result;
  }, initialValue);
}
