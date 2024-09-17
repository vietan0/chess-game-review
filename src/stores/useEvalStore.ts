import { create } from 'zustand';

export interface MoveEval {
  nodes: number;
  pv: string;
  multiPv: number;
  cp?: number;
  mate?: number; // technically mate and cp are mutual exclusive
}

interface StoreType {
  analyzeState: 'idle' | 'analyzing' | 'finished';
  isListening: boolean;
  fenIndex: number;
  best3Moves: MoveEval[][]; // in LAN format
  outputs: string[];
  computed: {
    readonly cps: (string | number)[];
    readonly winPercents: string[];
  };
  saveMove: (moveEval: MoveEval, output: string) => void;
  listen: () => void;
  stopListen: (fensLength: number) => void;
  analyze: () => void;
  finishAnalyze: () => void;
  reset: () => void;
}

export const useEvalStore = create<StoreType>((set, get) => ({
  analyzeState: 'idle',
  isListening: false,
  fenIndex: 0,
  best3Moves: [],
  outputs: [],
  computed: {
    get cps() {
      return get().best3Moves.map((subArr, i) => {
        const bestMove = subArr[0];

        if (typeof bestMove.cp === 'number') {
          if (i % 2 === 0) {
            // it's white's turn
            return bestMove.cp;
          }
          else {
            // it's black's turn
            return -bestMove.cp;
          }
        }
        else {
          if (i % 2 === 0) {
            // it's white's turn
            if (bestMove.mate! > 0) {
              // white has mate
              return `+M${Math.abs(bestMove.mate!)}`;
            }
            else {
              return `-M${Math.abs(bestMove.mate!)}`;
            }
          }
          else {
            // it's black's turn
            if (bestMove.mate! > 0) {
              return `-M${Math.abs(bestMove.mate!)}`;
            }
            else {
              return `+M${Math.abs(bestMove.mate!)}`;
            }
          }
        }
      });
    },
    get winPercents() {
      return get().computed.cps.map((cp) => {
        if (typeof cp === 'string') {
          // mate in y
          return cp;
        }
        else {
          const winPercent = 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1);

          return `${winPercent.toFixed(1)}%`;
        }
      });
    },
  },
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
  analyze: () => set({ best3Moves: [], analyzeState: 'analyzing', outputs: [] }),
  finishAnalyze: () => set({ analyzeState: 'finished' }),
  reset: () => set({ best3Moves: [], analyzeState: 'idle', outputs: [] }),
}));
