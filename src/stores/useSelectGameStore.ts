import { create } from 'zustand';

import type { ChessComGame, LichessGame } from '../queries/useMonthlyArchives';

export type Site = 'chess.com' | 'lichess';

interface Home {
  username: undefined;
  site: undefined;
  monthLink: undefined;
  game: undefined;
}

interface SelectMonth {
  username: string;
  site: Site;
  monthLink: undefined;
  game: undefined;
}

interface SelectGame {
  username: string;
  site: Site;
  monthLink: string;
  game: undefined;
}

interface Loaded {
  username: string;
  site: Site;
  monthLink: string;
  game: ChessComGame | LichessGame;
}

type SelectStages = Home | SelectMonth | SelectGame | Loaded;

type SelectGameStore = SelectStages & {
  submitUsername: (username: string, site: Site) => void;
  submitMonth: (monthLink: string) => void;
  submitGame: (game?: ChessComGame | LichessGame) => void;
  reset: () => void;
};

export const useSelectGameStore = create<SelectGameStore>(set => ({
  username: undefined,
  site: undefined,
  monthLink: undefined,
  game: undefined, // only indicate game loaded through sites, stay undefined if loaded from PGNForm
  submitUsername: (username: string, site: Site) => set({ username, site }),
  submitMonth: (monthLink: string) => set({ monthLink }),
  submitGame: (game?: ChessComGame | LichessGame) => set({ game }),
  reset: () => set({ username: undefined, site: undefined, monthLink: undefined, game: undefined }),
}));
