import { useQuery } from '@tanstack/react-query';

import type { Site } from '../useSelectGameStore';

export default function useGameArchives(username: string, site: Site) {
  return useQuery({
    queryKey: ['gameArchives', username, site],
    queryFn: async () => {
      // if site === 'chess.com'
      return fetchChessCom(username);
    },
    staleTime: 6 * 60 * 60 * 1000,
  });
}

async function fetchChessCom(username: string) {
  const res = await fetch(`https://api.chess.com/pub/player/${username}/games/archives`).then(res => res.json()) as { archives: string[] };

  return res.archives;
}
