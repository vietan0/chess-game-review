import { DEFAULT_POSITION } from 'chess.js';
import { create } from 'zustand';

import openings from '../openings.tsv';
import classify from '../utils/classify';
import { useBoardStore } from './useBoardStore';
import { type MoveEval, useStockfishOutputStore } from './useStockfishOutputStore';

import type { Classification } from '../utils/classify';
import type { Chess, Move } from 'chess.js';

export type MoveEvalMerged = Omit<MoveEval, 'cp' | 'mate'> & {
  eval: string | number;
};
export type MoveEvalWithClass = MoveEvalMerged & {
  classification: Classification;
};

/**
 * Normalize Stockfish's centipawn and mate value from a move, to always indicate from white's perspective (positive = white's winning, negative = white's losing).
 *
 * Also, since my Stockfish would give a `1500` cp where chesscom/lichess would give a `750`-`800`,
    I deflate it by `0.6` to arbitrarily map it closer to their results.
    https://www.desmos.com/calculator/gqiwyxdsu3
 */
function normalizeEval(moveEval: MoveEval, i: number) {
  function normalizeCp(cp: number, i: number) {
    // if it's black's turn, flip the sign
    const normalized = (i % 2 === 0) ? cp : -cp;

    return Math.round(normalized * 0.6);
  }

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
 * reuse played move's `cp` as current position's bestMove's `cp`.
 */
function reuseCp(best3Moves: MoveEval[][], history: Move[]) {
  const reusedCp = [...best3Moves];
  let subArrAltered: MoveEval[] = [];

  for (let i = 0; i < reusedCp.length; i++) {
    const subArr = reusedCp[i];
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
    reusedCp[i] = subArrAltered;
  }

  return reusedCp;
}

function sortBest3Moves(best3Moves: MoveEvalMerged[][]) {
  // sort after reusing cp
  return best3Moves.map((subArr, i) => {
    const sortedSubArr = [...subArr].sort((a, b) => {
      /*
        if i is even, it's White to move: +M5, +M10, 3, 0, -3, -M10, -M5
        if i is odd, it's Black to move: -M5, -M10, -3, 0, 3, +M10, +M5
      */
      function decreaseSort(a: MoveEvalMerged, b: MoveEvalMerged) {
        if (typeof a.eval === 'string') {
          if (typeof b.eval === 'string') {
            // 1. both strings
            if (a.eval[0] === b.eval[0]) {
            // 1a. same sign
              const aNum = Number(a.eval.slice(2));
              const bNum = Number(a.eval.slice(2));

              // both positive
              if (a.eval[0] === '+') {
                return aNum <= bNum ? -1 : 1;
              }
              // both negative
              else {
                return aNum >= bNum ? -1 : 1;
              }
            }
            else {
            // 1b. opposite sign
              return a.eval[0] === '+' ? -1 : 1;
            }
          }
          else {
            // 2. string to number
            return a.eval[0] === '+' ? -1 : 1;
          }
        }
        else {
          if (typeof b.eval === 'number') {
            // 3. both numbers
            return a.eval >= b.eval ? -1 : 1;
          }
          else {
            // 4. number to string
            return b.eval[0] === '-' ? -1 : 1;
          }
        }
      }

      if (i % 2 === 0) {
        return decreaseSort(a, b);
      }
      else {
        return decreaseSort(a, b) * -1;
      }
    });

    return sortedSubArr;
  });
}

function classifyBest3Moves(best3Moves: MoveEval[][], history: Move[]) {
  // Step 1: reuse cp
  const reusedCp = reuseCp(best3Moves, history);

  // Step 2: merge `cp` and `mate` into `eval`
  const normalized = reusedCp.map((subArr, i) => subArr.map(moveEval => ({
    pv: moveEval.pv,
    nodes: moveEval.nodes,
    multiPv: moveEval.multiPv,
    eval: normalizeEval(moveEval, i),
  })));

  // Step 3: resort after reusing cp
  const sorted = sortBest3Moves(normalized);

  // Step 4: add classification
  const classified = sorted.map<MoveEvalWithClass[]>((subArr, i) => {
    const beforeEval = subArr[0].eval;

    const addedClass = subArr.map((moveEval, _, arr) => {
      const afterEval = moveEval.eval;

      const classification = classify({
        subArr: arr,
        lan: moveEval.pv,
        history,
        i,
        beforeEval,
        afterEval,
      });

      return { ...moveEval, classification };
    });

    return addedClass;
  });

  return classified;
}

function classifyActualMoves(best3MovesWithClass: MoveEvalWithClass[][], cps: (string | number)[], history: Move[]) {
  return history.map((move, i, arr) => {
    // if actual move is in top 3, then it's already classified within best3MovesWithClass
    // else run classify again
    const playedMoveIsInTop3 = best3MovesWithClass[i].find(moveEval => moveEval.pv === move.lan);

    if (playedMoveIsInTop3)
      return playedMoveIsInTop3.classification;

    return classify({
      subArr: best3MovesWithClass[i],
      lan: move.lan,
      history: arr,
      i,
      beforeEval: cps[i],
      afterEval: cps[i + 1],
    });
  });
}

function getOpenings(fens: string[]) {
  const openingNames = [];

  for (let i = 0; i < fens.length; i++) {
    if (i === 0) {
      openingNames.push('Starting Position');
      continue;
    }

    const currentFen = fens[i];
    const found = openings.find(opening => opening.epd.includes(currentFen.split(' ')[0]));
    openingNames.push(found ? found.name : openingNames[openingNames.length - 1]);
  }

  return openingNames;
}

function getCps(best3MovesWithClass: MoveEvalWithClass[][], currentGame: Chess) {
  const history = currentGame.history({ verbose: true });
  // should have 3 types of value: number, string ("+M1"/"-M1"), string ("1-0"/"0-1") for checkmate case
  const beforeMate = best3MovesWithClass.map(subArr => subArr[0].eval);
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

function getAccuracy(cps: (string | number)[]): [number, number] {
  function calcAcc(before: number, after: number, i: number) {
    const diff = i % 2 === 0 ? before - after : after - before;
    if (diff <= 0)
      return 100;
    const a = 99.99;
    const b = -0.14;
    const c = 0;
    const acc = a * Math.exp(b * diff) - c;

    return acc;
  }

  const winPercents = cps.map((cp) => {
    if (typeof cp === 'number') {
      return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1);
    }
    else if (cp.startsWith('-') || cp === '0-1') {
      return 0;
    }
    else {
      return 100;
    }
  });

  const wAccArr = [];
  const bAccArr = [];

  for (let i = 0; i < winPercents.length - 1; i++) {
    const acc = calcAcc(winPercents[i], winPercents[i + 1], i);

    if (i % 2 === 0) {
      wAccArr.push(acc);
    }
    else {
      bAccArr.push(acc);
    }
  }

  const wAcc = wAccArr.reduce((a, b) => a + b, 0) / wAccArr.length;
  const bAcc = bAccArr.reduce((a, b) => a + b, 0) / wAccArr.length;
  const formatted: [number, number] = [Number(wAcc.toFixed(1)), Number(bAcc.toFixed(1))];

  return formatted;
}

interface EvalStore {
  best3MovesWithClass: MoveEvalWithClass[][];
  classHistory: Classification[];
  openingNames: string[];
  cps: (string | number)[];
  accuracy: [number, number];
  populate: () => void;
  reset: () => void;
}

export const useEvalStore = create<EvalStore>(set => ({
  best3MovesWithClass: [],
  classHistory: [],
  openingNames: [],
  cps: [], // while this show eval --> should I group these two together?
  accuracy: [0, 0],
  populate: () => set(() => {
    // should only be called once, after best3Moves is filled
    const best3Moves = useStockfishOutputStore.getState().best3Moves;
    const currentGame = useBoardStore.getState().currentGame;
    const history = currentGame.history({ verbose: true });
    const best3MovesWithClass = classifyBest3Moves(best3Moves, history);
    const fens = [DEFAULT_POSITION, ...history.map(move => move.after)];
    const openingNames = getOpenings(fens);
    const cps = getCps(best3MovesWithClass, currentGame);
    const classHistory = classifyActualMoves(best3MovesWithClass, cps, history);
    const accuracy = getAccuracy(cps);

    return { best3MovesWithClass, classHistory, openingNames, cps, accuracy };
  }),
  reset: () => set({ best3MovesWithClass: [], classHistory: [], openingNames: [], cps: [], accuracy: [0, 0] }),
}));
