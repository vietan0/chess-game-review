import { Chess } from 'chess.js';
import { create } from 'zustand';

interface StoreType {
  currentGame: Chess;
  currentMove: number;
  isFlipped: boolean;
  flipBoard: () => void;
  toFirstMove: () => void;
  toPrevMove: () => void;
  toNextMove: () => void;
  toLastMove: () => void;
  reset: () => void;
}

export const useStore = create<StoreType>(set => ({
  currentGame: new Chess(),
  currentMove: 0,
  toFirstMove: () => set({ currentMove: 0 }),
  toPrevMove: () => set(state => ({ currentMove: state.currentMove - 1 })),
  toNextMove: () => set(state => ({ currentMove: state.currentMove + 1 })),
  toLastMove: () => set(state => ({ currentMove: state.currentGame.history().length })),
  reset: () => set({ currentGame: new Chess(), currentMove: 0 }),
}));
