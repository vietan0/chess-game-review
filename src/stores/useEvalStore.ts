import { create } from 'zustand';

export interface MoveEval {
  nodes: number;
  pv: string;
  multiPv: number;
  cp?: number;
  mate?: number; // cp and mate are mutual exclusive
}

interface EvalStore {
  reviewState: 'idle' | 'reviewing' | 'finished';
  isListening: boolean;
  fenIndex: number;
  best3Moves: MoveEval[][]; // in LAN format
  outputs: string[];
  saveMove: (moveEval: MoveEval, output: string) => void;
  listen: () => void;
  stopListen: (fensLength: number) => void;
  review: () => void;
  finishReview: () => void;
  reset: () => void;
}

// rename `eval` to `sendMsgToStockfish` or something
export const useEvalStore = create<EvalStore>(set => ({
  reviewState: 'idle',
  isListening: false,
  fenIndex: 0,
  best3Moves: [],
  outputs: [],
  saveMove: (moveEval: MoveEval, output: string) => set(({ best3Moves, outputs }) => {
    if (moveEval.multiPv === 1) {
      return {
        best3Moves: [...best3Moves, [moveEval]],
        outputs: [...outputs, output],
      };
    }
    else {
      const lastSubArr = best3Moves[best3Moves.length - 1];
      const moddedLastSubArr = [...lastSubArr, moveEval];
      // replace last subArr with moddedLastSubArr
      const modded = [...best3Moves];
      modded.splice(-1, 1, moddedLastSubArr);

      return {
        best3Moves: modded,
        output: [...outputs, output],
      };
    }
  }),
  listen: () => set({ isListening: true }),
  stopListen: (fensLength: number) => set(({ fenIndex }) => ({
    isListening: false,
    fenIndex: fenIndex === fensLength - 1 ? fenIndex : fenIndex + 1,
  })),
  review: () => set({ best3Moves: [], reviewState: 'reviewing', outputs: [] }),
  finishReview: () => set({ reviewState: 'finished' }),
  reset: () => set({
    best3Moves: [],
    reviewState: 'idle',
    fenIndex: 0,
    outputs: [],
  }),
}));
