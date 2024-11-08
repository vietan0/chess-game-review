import { create } from 'zustand';

import type { Square } from 'chess.js';

interface ManualHighlightStore {
  squares: Square[];
  toggleHighlight: (square: Square) => void;
  resetHighlight: () => void;
}

export const useManualHighlightStore = create<ManualHighlightStore>(set => ({
  squares: [],
  toggleHighlight: (square: Square) => set(({ squares }) => {
    if (!squares.includes(square)) {
      return {
        squares: [...squares, square],
      };
    }

    return {
      squares: squares.filter(s => s !== square),
    };
  }),
  resetHighlight: () => set({ squares: [] }),
}));
