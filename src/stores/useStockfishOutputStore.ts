import { create } from 'zustand';

import { useStageStore } from './useStageStore';

export interface MoveEval {
  nodes: number;
  pv: string;
  multiPv: number;
  cp?: number;
  mate?: number; // cp and mate are mutual exclusive
}
export interface StockfishOutputStore {
  isListening: boolean;
  fenIndex: number;
  best3Moves: MoveEval[][]; // in LAN format
  outputs: string[];
  saveMove: (moveEval: MoveEval, output: string) => void;
  listen: () => void;
  stopListen: (fensLength: number) => void;
  review: () => void;
  reset: () => void;
  mock: (obj: Partial<StockfishOutputStore>) => void;
}
export const useStockfishOutputStore = create<StockfishOutputStore>(set => ({
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
        outputs: [...outputs, output],
      };
    }
  }),
  listen: () => set({ isListening: true }),
  stopListen: (fensLength: number) => set(({ fenIndex }) => ({
    isListening: false,
    fenIndex: fenIndex === fensLength - 1 ? fenIndex : fenIndex + 1,
  })),
  review: () => set(() => {
    const setStage = useStageStore.getState().setStage;
    setStage('reviewing');

    return { best3Moves: [], fenIndex: 0, outputs: [] };
  }),
  reset: () => set({ best3Moves: [], fenIndex: 0, outputs: [] }),
  mock: (obj: Partial<StockfishOutputStore>) => set(state => ({ ...state, ...obj })),
}));
