import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import objectSupport from 'dayjs/plugin/objectSupport';

import { useSelectGameStore } from '../stores/useSelectGameStore';
import { groupChessComLinksByYear, groupLichessLinksByYear } from '../utils/groupChessComLinksByYear';

dayjs.extend(objectSupport);
dayjs.extend(isSameOrBefore);

export default function useGameArchives(username: string) {
  const site = useSelectGameStore(state => state.site)!;

  return useQuery({
    queryKey: ['gameArchives', username, site],
    queryFn: async () =>
      site === 'chess.com' ? fetchChessCom(username) : fetchLichess(username),
    staleTime: 24 * 60 * 60 * 1000,
  });
}

async function fetchChessCom(username: string) {
  const res = await fetch(`https://api.chess.com/pub/player/${username}/games/archives`).then(res => res.json()) as { archives: string[] };

  return groupChessComLinksByYear(res.archives.reverse());
}

async function fetchLichess(username: string) {
  const createdAt = await fetch(`https://lichess.org/api/user/${username}`)
    .then(res => res.json())
    .then(userInfo => userInfo.createdAt as number); // UNIX timestamp

  const now = dayjs();
  const created = dayjs(createdAt);

  // round down the created date to start of month
  // .e.g if created at 2016-08-12T14:48:29,
  // createdMonth is 2016-08-01T00:00:00
  const createdMonth = dayjs({
    year: created.year(),
    month: created.month(),
    day: 1,
  });

  // generate UNIX timestamps for all the months inbetween (edge-inclusive)
  const sinceTo: { since: number; to: number }[] = [];
  let currentMonth = createdMonth; // will increase 1 month each while-loop

  while (currentMonth.isSameOrBefore(now)) {
    const nextMonth = currentMonth.add(1, 'month');

    sinceTo.unshift({
      since: currentMonth.valueOf(),
      to: nextMonth.valueOf(),
    });

    currentMonth = nextMonth;
  }

  const monthLinks = sinceTo.map(({ since, to }) => `https://lichess.org/api/games/user/${username}?pgnInJson=true&clocks=true&literate=true&since=${since}&to=${to}`);

  return groupLichessLinksByYear(monthLinks);
}
