import { Chess } from 'chess.js';
import { create } from 'zustand';

interface BoardStore {
  currentGame: Chess;
  currentMoveNum: number;
  isFlipped: boolean;
  lastNav: 1 | 0 | -1;
  timestamps: RegExpMatchArray | null;
  randomState: number;
  loadGame: (pgn: string) => void;
  flipBoard: (newVal?: boolean) => void;
  toMove: (moveNum: number) => void;
  toFirstMove: () => void;
  toPrevMove: () => void;
  toNextMove: () => void;
  toFinalMove: () => void;
  reset: () => void;
}

const timestampRegex = /(?<=%clk\s)[\d:.]+/g;

export const useBoardStore = create<BoardStore>(set => ({
  currentGame: new Chess(),
  currentMoveNum: 0, // 0 means starting position, 1 means first move
  isFlipped: false,
  lastNav: 0,
  timestamps: null,
  randomState: 0,
  loadGame: (pgn: string) => set((state) => {
    state.currentGame.loadPgn(pgn);

    return {
      currentMoveNum: 0,
      lastNav: 0,
      timestamps: pgn.match(timestampRegex),
      randomState: Math.random(), // trigger re-render manually, because Chess.loadPgn() won't
    };
  }),
  flipBoard: (newVal?: boolean) => set(state => ({ isFlipped: typeof newVal === 'boolean' ? newVal : !state.isFlipped, lastNav: 0 })),
  toMove: (moveNum: number) => set({ currentMoveNum: moveNum, lastNav: 0 }),
  toFirstMove: () => set({ currentMoveNum: 0, lastNav: 0 }),
  toPrevMove: () => set((state) => {
    const history = state.currentGame.history({ verbose: true });
    if (history.length === 0 || state.currentMoveNum === 0)
      return state;

    return { currentMoveNum: state.currentMoveNum - 1, lastNav: -1 };
  }),
  toNextMove: () => set((state) => {
    const history = state.currentGame.history({ verbose: true });
    if (history.length === 0 || state.currentMoveNum === history.length)
      return state;

    return { currentMoveNum: state.currentMoveNum + 1, lastNav: 1 };
  }),
  toFinalMove: () => set(state => ({ currentMoveNum: state.currentGame.history().length, lastNav: 0 })),
  reset: () => set({
    currentGame: new Chess(),
    currentMoveNum: 0,
    lastNav: 1,
    timestamps: null,
    randomState: 0,
  }),
}));
