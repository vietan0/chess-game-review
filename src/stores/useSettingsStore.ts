import { create } from 'zustand';

import useLocalStorage from '../hooks/useLocalStorage';

export type Pieces = 'neo' | 'classic' | 'ocean';
export type Board = 'green' | 'brown' | 'ice';

interface SettingsStore {
  settings: {
    showRatings: boolean;
    pieces: Pieces;
    board: Board;
  };
  toggleShowRatings: () => void;
  choosePieces: (pieces: Pieces) => void;
  chooseBoard: (board: Board) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => {
  const { item: showRatings, set: setShowRatings } = useLocalStorage('showRatings');
  const { item: pieces, set: setPieces } = useLocalStorage('pieces');
  const { item: board, set: setBoard } = useLocalStorage('board');

  return {
    settings: {
      showRatings: showRatings === 'true' ? true : showRatings === null, // first visit (null) defaults to true
      pieces: pieces as Pieces || 'neo',
      board: board as Board || 'green',
    },
    toggleShowRatings: () => set(({ settings }) => {
      setShowRatings('showRatings', settings.showRatings ? 'false' : 'true');

      return { settings: { ...settings, showRatings: !settings.showRatings } };
    }),
    choosePieces: pieces => set(({ settings }) => {
      setPieces('pieces', pieces);

      return { settings: { ...settings, pieces } };
    }),
    chooseBoard: board => set(({ settings }) => {
      setBoard('board', board);

      return { settings: { ...settings, board } };
    }),
  };
});
