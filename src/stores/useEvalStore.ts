import { DEFAULT_POSITION } from 'chess.js';
import { create } from 'zustand';

import { useBoardStore } from './useBoardStore';
import { type MoveEval, useStockfishOutputStore } from './useStockfishOutputStore';

import type { Chess, Move } from 'chess.js';

/**
 * Retrieves the evaluation from a move evaluation, handling both centipawn and mate values.
 *
 * @return The evaluation in the format of a centipawn value or a mate value.
 */
function extractEval(moveEval: MoveEval, i: number) {
  /**
   * Normalizes the Stockfish's centipawn value to always indicate from white's perspective (positive = white's winning, negative = white's losing).
   *
   * Also, since my Stockfish would give a `1500` cp where chesscom/lichess would give a `750`-`800`,
    I deflate it by `0.6` to arbitrarily map it closer to their results.
    https://www.desmos.com/calculator/gqiwyxdsu3
   */
  function normalizeCp(cp: number, i: number) {
    // if it's black's turn, flip the sign
    const normalized = (i % 2 === 0) ? cp : -cp;

    return Math.round(normalized * 0.6);
  }

  /**
   * Normalizes Stockfish's mate value to always indicate from white's perspective (positive = white's winning, negative = white's losing).
   */
  function normalizeMate(mate: number, i: number) {
    if (i % 2 === 0) {
      // it's white's turn
      if (mate > 0) {
      // white has mate
        return `+M${Math.abs(mate)}`;
      }
      else {
        return `-M${Math.abs(mate)}`;
      }
    }
    else {
      // it's black's turn
      if (mate > 0) {
        return `-M${Math.abs(mate)}`;
      }
      else {
        return `+M${Math.abs(mate)}`;
      }
    }
  }

  if (typeof moveEval.cp === 'number') {
    return normalizeCp(moveEval.cp, i);
  }
  else {
    return normalizeMate(moveEval.mate!, i);
  }
}

/**
 * If previous played move is in top 3,
 * reuse played move's cp as current position's bestMove.
 */
function alterBest3Moves(best3Moves: MoveEval[][], history: Move[]) {
  const best3MovesAltered = [...best3Moves];
  let subArrAltered: MoveEval[] = [];

  for (let i = 0; i < best3Moves.length; i++) {
    const subArr = best3Moves[i];
    const bestMoveEval = subArr[0];
    subArrAltered = i === 0 ? subArr : subArrAltered;

    if (i > 0) {
      const prevMove = history[i - 1];
      const prevMoveEval = subArrAltered.find(subArr => subArr.pv === prevMove?.lan);

      if (prevMoveEval) {
        const { cp } = prevMoveEval;
        const alteredBestMoveEval = { ...bestMoveEval };

        if (cp) {
          alteredBestMoveEval.cp = -cp;
        }

        subArrAltered = [alteredBestMoveEval, ...subArr.slice(1)];
      }
      else {
        subArrAltered = subArr;
      }
    }

    // replace
    best3MovesAltered[i] = subArrAltered;
  }

  return best3MovesAltered;
}

function getCps(best3Moves: MoveEval[][], currentGame: Chess) {
  const history = currentGame.history({ verbose: true });
  // should have 3 types of value: number, string ("+M1"/"-M1"), string ("1-0"/"0-1") for checkmate case
  const beforeMate = best3Moves.map((subArr, i) => extractEval(subArr[0], i));
  const isCheckmate = currentGame.isCheckmate();
  const fens = [DEFAULT_POSITION, ...history.map(move => move.after)];

  if (isCheckmate && beforeMate.length === fens.length - 1) {
    // only push the checkmate after done analyzing
    const result = currentGame.header().Result; // '1-0' or '0-1'
    const afterMate = [...beforeMate, result];

    return afterMate;
  }
  else {
    return beforeMate;
  }
}

export function formatCp(cp: string | number) {
  if (typeof cp === 'string') {
    // e.g. "+M1", "1-0", return as-is
    return cp;
  }

  return (cp / 100).toFixed(1);
}

function getWinPercents(cps: (string | number)[]) {
  return cps.map((cp) => {
    if (typeof cp === 'number') {
      return (50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1)).toFixed(1);
    }
    else if (cp.startsWith('-') || cp === '0-1') {
      return '0';
    }
    else {
      return '100';
    }
  });
}

interface EvalStore {
  best3MovesAltered: MoveEval[][];
  cps: (string | number)[];
  winPercents: string[];
  populate: () => void;
  reset: () => void;
}

export const useEvalStore = create<EvalStore>(set => ({
  best3MovesAltered: [],
  cps: [],
  winPercents: [],
  populate: () => set(() => {
    // should only be called once, after best3Moves is filled
    const best3Moves = useStockfishOutputStore.getState().best3Moves;
    const currentGame = useBoardStore.getState().currentGame;
    const history = currentGame.history({ verbose: true });
    const best3MovesAltered = alterBest3Moves(best3Moves, history);
    const cps = getCps(best3MovesAltered, currentGame);
    const winPercents = getWinPercents(cps);

    return { best3MovesAltered, cps, winPercents };
  }),
  reset: () => set({ best3MovesAltered: [], cps: [], winPercents: [] }),
}));
