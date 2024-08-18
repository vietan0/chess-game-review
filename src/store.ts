import { Chess } from 'chess.js';
import { create } from 'zustand';

interface StoreType {
  currentGame: Chess;
  currentMoveNum: number;
  isFlipped: boolean;
  lastNav: 1 | 0 | -1;
  timestamps: RegExpMatchArray | null;
  loadGame: (pgn: string) => void;
  flipBoard: () => void;
  toFirstMove: () => void;
  toPrevMove: () => void;
  toNextMove: () => void;
  toFinalMove: () => void;
  reset: () => void;
}

const timestampRegex = /(?<=%clk\s)[\d:.]+/g;

export const useStore = create<StoreType>(set => ({
  currentGame: new Chess(),
  currentMoveNum: 0, // 0 means starting position, 1 means first move
  isFlipped: false,
  lastNav: 1,
  timestamps: null,
  loadGame: (pgn: string) => set((state) => {
    state.currentGame.loadPgn(pgn);

    return {
      currentMoveNum: 0,
      lastNav: 1,
      timestamps: pgn.match(timestampRegex),
    };
  }),
  flipBoard: () => set(state => ({ isFlipped: !state.isFlipped, lastNav: 0 })),
  toFirstMove: () => set({ currentMoveNum: 0, lastNav: 0 }),
  toPrevMove: () => set(state => ({ currentMoveNum: state.currentMoveNum - 1, lastNav: -1 })),
  toNextMove: () => set(state => ({ currentMoveNum: state.currentMoveNum + 1, lastNav: 1 })),
  toFinalMove: () => set(state => ({ currentMoveNum: state.currentGame.history().length, lastNav: 0 })),
  reset: () => set({
    currentGame: new Chess(),
    currentMoveNum: 0,
    lastNav: 1,
    timestamps: null,
  }),
}));
