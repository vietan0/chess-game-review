import { useQuery } from '@tanstack/react-query';

import { useSelectGameStore } from '../useSelectGameStore';
import { readStream } from '../utils/nd-json';

interface ChessComPlayer {
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
  white: ChessComPlayer;
  black: ChessComPlayer;
}

export default function useMonthlyArchives(monthLink: string) {
  const site = useSelectGameStore(state => state.site)!;

  return useQuery({
    queryKey: ['gameArchives', monthLink, site],
    queryFn: async () =>
      site === 'chess.com' ? fetchChessComGames(monthLink) : fetchLichessGames(monthLink),
    staleTime: 5 * 60 * 1000,
  });
}

async function fetchChessComGames(monthLink: string) {
  const res = await fetch(monthLink).then(res => res.json()) as { games: ChessComGame[] };
  const noVariants = res.games.filter(game => game.rules === 'chess');
  noVariants.reverse();

  return noVariants;
}

export interface LichessPlayer {
  user: {
    name: string;
    id: string;
  };
  rating: number;
  ratingDiff: number;
}
export interface LichessAI {
  aiLevel: number;
}
export interface LichessGame {
  clock: {
    increment: number;
    initial: number;
    totalTime: number;
  };
  clocks: number[];
  createdAt: number;
  daysPerTurn?: number;
  id: string;
  lastMoveAt: number;
  moves: string;
  perf: string;
  pgn: string;
  players: {
    black: LichessPlayer | LichessAI;
    white: LichessPlayer | LichessAI;
  };
  rated: boolean;
  source: string;
  speed: 'ultraBullet' | 'bullet' | 'blitz' | 'rapid' | 'classical' | 'correspondence';
  status: 'created' | 'started' | 'aborted' | 'mate' | 'resign' | 'stalemate' | 'timeout' | 'draw' | 'outoftime' | 'cheat' | 'noStart' | 'unknownFinish' | 'variantEnd';
  variant: 'standard' | 'chess960' | 'crazyhouse' | 'antichess' | 'atomic' | 'horde' | 'kingOfTheHill' | 'racingKings' | 'threeCheck' | 'fromPosition';
  winner: 'white' | 'black' | undefined;
}

async function fetchLichessGames(monthLink: string) {
  const games: LichessGame[] = [];
  const onMessage = (game: LichessGame) => games.push(game);

  await fetch(monthLink, { headers: { Accept: 'application/x-ndjson' } })
    .then(readStream(onMessage));

  const noVariants = games.filter(game => game.variant === 'standard');

  return noVariants;
}
