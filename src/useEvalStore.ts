import { create } from 'zustand';

export interface MoveEval {
  nodes: number;
  pv: string;
  cp?: number;
  mate?: number; // technically mate and cp are mutual exclusive
}

interface StoreType {
  best3Moves: MoveEval[][]; // in LAN format
  computed: {
    readonly cps: string[];
    readonly winPercents: string[];
  };
  saveMove: (moveEval: MoveEval) => void;
  reset: () => void;
}

export const useEvalStore = create<StoreType>((set, get) => ({
  best3Moves: [],
  computed: {
    get cps() {
      return get().best3Moves.map((subArr, i) => {
        const bestMove = subArr[0];

        if (typeof bestMove.cp === 'number') {
          if (i % 2 === 0) {
            // it's white's turn
            return String(bestMove.cp);
          }
          else {
            // it's black's turn
            return String(-bestMove.cp);
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
        if (cp.includes('M')) {
          // mate in y
          return cp;
        }
        else {
          const winPercent = 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * Number(cp))) - 1);

          return `${winPercent.toFixed(1)}%`;
        }
      });
    },
  },
  saveMove: (moveEval: MoveEval) => set(({ best3Moves: best3MovesLans }) => {
    // same node = same move
    if (best3MovesLans.some(subArr => subArr.some(obj => obj.nodes === moveEval.nodes)) === false) {
      // 1. if array doesn't include a subarray that includes an object with `nodes`
      // --> create a subarray, add object
      // if (JSON.stringify(moveEval) !== JSON.stringify(best3MovesLans[best3MovesLans.length - 1]))
      // prevent duplicate if there are duplicated listener added in development (after every Vite HMR save)
      return { best3Moves: [...best3MovesLans, [moveEval]] };
      // else return { best3MovesLans };
    }
    else {
      // 2. array already has subArr with this nodes
      // --> add newItem to subArr
      const lastSubArr = best3MovesLans[best3MovesLans.length - 1];
      const moddedLastSubArr = [...lastSubArr, moveEval];
      // replace last subArr with addedLastSubArr
      const modded = [...best3MovesLans];
      modded.splice(-1, 1, moddedLastSubArr);

      return { best3Moves: modded };
    }
  }),
  reset: () => set({ best3Moves: [] }),

}));
