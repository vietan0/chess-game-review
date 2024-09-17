import { create } from 'zustand';

export interface MoveEval {
  nodes: number;
  pv: string;
  cp?: number;
  mate?: number; // technically mate and cp are mutual exclusive
}

interface StoreType {
  analyzeState: 'idle' | 'analyzing' | 'finished';
  best3Moves: MoveEval[][]; // in LAN format
  outputs: string[];
  computed: {
    readonly cps: (string | number)[];
    readonly winPercents: string[];
  };
  saveMove: (moveEval: MoveEval, output: string) => void;
  begin: () => void;
  finish: () => void;
  reset: () => void;
}

export const useEvalStore = create<StoreType>((set, get) => ({
  analyzeState: 'idle',
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
    return {
      best3Moves: [...best3Moves, [moveEval]],
      outputs: [...outputs, output],
    };

    // prepare for saving 3 moves:
    // how to recognize if an output is describing multiPv 1/2/3 of the same fen or the next fen?
    // can't use `nodes` because it's not unique

    // if (moveEval is not from the same position, which means it's the next position) {
    //   // create a subarray, add object
    //   return { best3Moves: [...best3Moves, [moveEval]], outputs: [...outputs, message] };
    // }
    // else {
    //   // 2. array already has subArr of best moves in this current position
    //   // --> add newItem to subArr
    //   const lastSubArr = best3Moves[best3Moves.length - 1];
    //   const moddedLastSubArr = [...lastSubArr, moveEval];
    //   // replace last subArr with addedLastSubArr
    //   const modded = [...best3Moves];
    //   modded.splice(-1, 1, moddedLastSubArr);

    //   return { best3Moves: modded, output: [...outputs, message] };
    // }
  }),
  begin: () => set({ best3Moves: [], analyzeState: 'analyzing', outputs: [] }),
  finish: () => set({ analyzeState: 'finished' }),
  reset: () => set({ best3Moves: [], analyzeState: 'idle', outputs: [] }),
}));
