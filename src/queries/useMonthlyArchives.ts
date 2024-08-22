import { useQuery } from '@tanstack/react-query';

interface Player {
  'rating': number;
  'result': 'win' | 'checkmated' | 'agreed' | 'repetition' | 'timeout' | 'resigned' | 'stalemate' | 'lose' | 'insufficient' | '50move' | 'abandoned' | 'kingofthehill' | 'threecheck' | 'timevsinsufficient' | 'bughousepartnerlose';
  '@id': string;
  'username': string;
  'uuid': string;
}

export interface ChessComGame {
  url: string;
  pgn: string;
  time_control: string;
  end_time: number;
  rated: boolean;
  accuracies?: {
    white: number;
    black: number;
  };
  tcn: string;
  uuid: string;
  initial_setup: string;
  fen: string;
  time_class: 'daily' | 'rapid' | 'blitz' | 'bullet';
  rules: 'chess' | 'chess960' | 'bughouse' | 'kingofthehill' | 'threecheck' | 'crazyhouse';
  white: Player;
  black: Player;
}

export default function useMonthlyArchives(monthLink: string) {
  return useQuery({
    queryKey: ['gameArchives', monthLink],
    queryFn: async () => {
      const res = await fetch(monthLink).then(res => res.json()) as { games: ChessComGame[] };
      const noVariants = res.games.filter(game => game.rules === 'chess');
      noVariants.reverse();

      return noVariants;
    },
    staleTime: 5 * 60 * 1000,
  });
}
