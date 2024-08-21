import { create } from 'zustand';

export type Site = 'chess.com' | 'lichess';

interface Home {
  stage: 'home';
  username: undefined;
  site: undefined;
  monthLink: undefined;
}

interface SelectMonth {
  stage: 'select-month';
  username: string;
  site: Site;
  monthLink: undefined;
}

interface SelectGame {
  stage: 'select-game';
  username: string;
  site: Site;
  monthLink: string;
}

interface Loaded {
  stage: 'loaded';
  username: string;
  site: Site;
  monthLink: string;
}

type Stage = Home | SelectMonth | SelectGame | Loaded;

type StoreType = Stage & {
  backToMonths: () => void;
  backToGames: () => void;
  submitUsername: (username: string, site: Site) => void;
  toSelectGame: (monthLink: string) => void;
  reset: () => void;
};

export const useSelectGameStore = create<StoreType>(set => ({
  stage: 'home',
  username: undefined,
  site: undefined,
  monthLink: undefined,
  backToMonths: () => set({ stage: 'select-month' }),
  backToGames: () => set({ stage: 'select-game' }),
  submitUsername: (username: string, site: Site) => set({ stage: 'select-month', username, site }),
  toSelectGame: (monthLink: string) => set({ stage: 'select-game', monthLink }),
  reset: () => set({ stage: 'home', username: undefined, site: undefined, monthLink: undefined }),
}));
