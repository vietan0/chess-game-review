import { Chess } from 'chess.js';
import { create } from 'zustand';

interface StoreType {
  currentGame: Chess;
  currentMove: number;
  timestamps: RegExpMatchArray | null;
  loadGame: (pgn: string) => void;
  isFlipped: boolean;
  flipBoard: () => void;
  toFirstMove: () => void;
  toPrevMove: () => void;
  toNextMove: () => void;
  toLastMove: () => void;
  reset: () => void;
}

const timestampRegex = /(?<=%clk\s)[\d:.]+/g;

export const useStore = create<StoreType>(set => ({
  currentGame: new Chess(),
  currentMove: 0,
  timestamps: null,
  loadGame: (pgn: string) => set((state) => {
    state.currentGame.loadPgn(pgn);

    return {
      timestamps: pgn.match(timestampRegex),
      currentMove: 0,
    };
  }),
  isFlipped: false,
  flipBoard: () => set(state => ({ isFlipped: !state.isFlipped })),
  toFirstMove: () => set({ currentMove: 0 }),
  toPrevMove: () => set(state => ({ currentMove: state.currentMove - 1 })),
  toNextMove: () => set(state => ({ currentMove: state.currentMove + 1 })),
  toLastMove: () => set(state => ({ currentMove: state.currentGame.history().length })),
  reset: () => set({
    currentGame: new Chess(),
    currentMove: 0,
    timestamps: null,
  }),
}));
