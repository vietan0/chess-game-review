import { create } from 'zustand';

import type { ChessComGame, LichessGame } from './queries/useMonthlyArchives';

export type Site = 'chess.com' | 'lichess';

interface Home {
  stage: 'home';
  username: undefined;
  site: undefined;
  monthLink: undefined;
  game: undefined;
}

interface SelectMonth {
  stage: 'select-month';
  username: string;
  site: Site;
  monthLink: undefined;
  game: undefined;
}

interface SelectGame {
  stage: 'select-game';
  username: string;
  site: Site;
  monthLink: string;
  game: undefined;
}

interface Loaded {
  stage: 'loaded';
  username: string;
  site: Site;
  monthLink: string;
  game: ChessComGame | LichessGame;
}

type Stage = Home | SelectMonth | SelectGame | Loaded;

type StoreType = Stage & {
  backToMonths: () => void;
  backToGames: () => void;
  submitUsername: (username: string, site: Site) => void;
  submitMonth: (monthLink: string) => void;
  submitGame: (game?: ChessComGame | LichessGame) => void;
  reset: () => void;
};

export const useSelectGameStore = create<StoreType>(set => ({
  stage: 'home',
  username: undefined,
  site: undefined,
  monthLink: undefined,
  game: undefined, // only indicate game loaded through sites, stay undefined if loaded from PGNForm
  backToMonths: () => set({ stage: 'select-month' }),
  backToGames: () => set({ stage: 'select-game' }),
  submitUsername: (username: string, site: Site) => set({ stage: 'select-month', username, site }),
  submitMonth: (monthLink: string) => set({ stage: 'select-game', monthLink }),
  submitGame: (game?: ChessComGame | LichessGame) => set({ stage: 'loaded', game }),
  reset: () => set({ stage: 'home', username: undefined, site: undefined, monthLink: undefined, game: undefined }),
}));
