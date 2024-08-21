import { useQuery } from '@tanstack/react-query';

interface Player {
  'rating': number;
  'result': string; // maybe union
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
  time_class: string; // maybe union
  rules: string; // could be 'chess' | other stuff
  white: Player;
  black: Player;
}

export default function useMonthlyArchives(monthLink: string) {
  return useQuery({
    queryKey: ['gameArchives', monthLink],
    queryFn: async () => {
      const res = await fetch(monthLink).then(res => res.json()) as { games: ChessComGame[] };

      return res.games;
    },
    staleTime: 6 * 60 * 60 * 1000,
  });
}
