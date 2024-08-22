/**
 * Groups an array of links by year.
 *
 * @param links - An array of links to be grouped by year -
 * e.g. returned from this URL https://api.chess.com/pub/player/erik/games/archives
 * @return A 2D array where each sub-array contains links from the same year.
 */
export default function groupLinksByYear(links: string[]) {
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
