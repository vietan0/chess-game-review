import { Chess, DEFAULT_POSITION, type Move } from 'chess.js';

import openings from '../openings.tsv';
import lanToSan from './lanToSan';

import type { MoveEvalMerged, MoveEvalWithClass } from '../stores/useEvalStore';
import type { MoveEval } from '../stores/useStockfishOutputStore';

export type Classification = 'best' | 'excellent' | 'good' | 'inaccuracy' | 'mistake' | 'blunder' | 'forced' | 'book';

/**
 * Always returns a negative number or 0. 0 means it was the best move, and a negative number means it was not the best (sub-optimal, or worse).
 *
 * (A positive delta would mean the same thing as 0, but a positive delta shouldn't be possible in the first place)
 */
function getDelta(beforeEval: number, afterEval: number, whiteToMove: boolean) {
  return whiteToMove ? afterEval - beforeEval : beforeEval - afterEval;
}

/**
 * Chooses the appropriate thresholds for classification based on `beforeEval`,
 * since the resulting evaluation affects how impactful a mistake is.
 *
 * For example, for the same difference `delta = 200`:
 * - a move that lower the advantage from `+200` to `0` will be classified as a mistake,
 * - but a move that lower the advantage from `+500` to `+300` is only an inaccuracy (still winning),
 * - or a move that lower the advantage from `-100` to `-300` is only an inaccurcy (already losing).
 */
function chooseThresholds(beforeEval: number, wasLosing: boolean) {
  const thresholds = [
    {
      wasLosing: [0, -25, -50, -150, -250],
      wasWinning: [0, -25, -50, -150, -250],
    },
    {
      wasLosing: [0, -50, -100, -200, -300],
      wasWinning: [0, -50, -100, -150, -250],
    },
    {
      wasLosing: [0, -75, -150, -250, -400],
      wasWinning: [0, -75, -150, -200, -300],
    },
    {
      wasLosing: [0, -150, -200, -400, -600],
      wasWinning: [0, -75, -150, -200, -300],
    },
    {
      wasLosing: [0, -150, -200, -400, -600],
      wasWinning: [0, -150, -200, -300, -400],
    },
  ];

  if (Math.abs(beforeEval) <= 50) {
    return wasLosing ? thresholds[0].wasLosing : thresholds[0].wasWinning;
  }

  if (Math.abs(beforeEval) <= 300) {
    return wasLosing ? thresholds[1].wasLosing : thresholds[1].wasWinning;
  }

  if (Math.abs(beforeEval) <= 400) {
    return wasLosing ? thresholds[2].wasLosing : thresholds[2].wasWinning;
  }

  if (Math.abs(beforeEval) <= 500) {
    return wasLosing ? thresholds[3].wasLosing : thresholds[3].wasWinning;
  }

  return wasLosing ? thresholds[4].wasLosing : thresholds[4].wasWinning;
}

function getClassFromThresholds(delta: number, thresholds: number[]): Classification {
  if (delta >= thresholds[0])
    return 'best';

  if (delta < thresholds[0] && thresholds[1] < delta) {
    return 'excellent';
  }

  if (delta <= thresholds[1] && thresholds[2] < delta) {
    return 'good';
  }

  if (delta <= thresholds[2] && thresholds[3] < delta) {
    return 'inaccuracy';
  }

  if (delta <= thresholds[3] && thresholds[4] < delta) {
    return 'mistake';
  }

  else {
    // delta < thresholds[4]
    return 'blunder';
  }
}

function bothNumbers(beforeEval: number, afterEval: number, whiteToMove: boolean) {
  const wasLosing = (whiteToMove && beforeEval < 0) || (!whiteToMove && beforeEval > 0);
  const delta = getDelta(beforeEval, afterEval, whiteToMove);

  if (
    !wasLosing
    && beforeEval * afterEval > 0 // same sign
  ) {
    if (Math.abs(beforeEval) > 800 && Math.abs(afterEval) > 500) {
      // special case 1: when totally winning before and after, 'inaccuracy' is the lowest classification
      if (delta >= -50)
        return 'best';
      if (delta > -150)
        return 'excellent';
      if (delta > -200)
        return 'good';

      return 'inaccuracy';
    }

    if (Math.abs(beforeEval) > 600 && Math.abs(afterEval) < 200) {
      // special case 2: when totally winning before, then advantage is < 200 after, auto 'blunder'
      return 'blunder';
    }
  }

  if (
    wasLosing
    && beforeEval * afterEval > 0 // same sign
  ) {
    if (Math.abs(beforeEval) > 600 && Math.abs(afterEval) > 900) {
      // special case 3: when dead lost before and after, 'inaccuracy' is the lowest classification
      if (delta >= -50)
        return 'best';
      if (delta > -150)
        return 'excellent';
      if (delta > -200)
        return 'good';

      return 'inaccuracy';
    }
  }

  const thresholds = chooseThresholds(beforeEval, wasLosing);
  const classification = getClassFromThresholds(delta, thresholds);

  return classification;
}

function bothStrings(beforeEval: string, afterEval: string, whiteToMove: boolean): Classification {
  // 1. stalemate case
  if (afterEval === '1/2-1/2') {
    return 'blunder';
  }

  // 2. checkmate case
  if (afterEval === '1-0' || afterEval === '0-1') {
    return 'best';
  }

  // 3. switch sign means blunder
  if (
    (beforeEval[0] === '-' && afterEval[0] === '+')
    || (beforeEval[0] === '+' && afterEval[0] === '-')) {
    return 'blunder';
  }

  // 4. same sign -> compare mate values
  const beforeM = Number(beforeEval.slice(2));
  const afterM = Number(afterEval.slice(2));
  const deltaM = whiteToMove ? beforeM - afterM : afterM - beforeM;

  if (deltaM >= 0) {
    return 'best';
  }
  else if (deltaM >= -10) {
    return 'excellent';
  }
  else {
    // deltaM < -10
    return 'good';
  }
}

function numberToString(beforeEval: number, afterEval: string, whiteToMove: boolean): Classification {
  const stalemate = afterEval === '1/2-1/2';
  const mateIsPositive = !stalemate && afterEval.startsWith('+');

  if (stalemate) {
    if (whiteToMove) {
      // white moves, then stalemate
      if (beforeEval <= 100)
        return 'good';
      if (beforeEval <= 200)
        return 'inaccuracy';
      if (beforeEval <= 300)
        return 'mistake';

      return 'blunder';
    }
    else {
      // black moves, then stalemate
      if (beforeEval >= -100)
        return 'good';
      if (beforeEval >= -200)
        return 'inaccuracy';
      if (beforeEval >= -300)
        return 'mistake';

      return 'blunder';
    }
  }

  if (whiteToMove) {
    if (mateIsPositive) {
      // white moves, then white has mate --> technically not possible,
      // but may happen in a winning endgame (e.g. +40 to +M9) due to engine's search depth
      return 'best';
    }

    // white moves, then black has mate
    if (beforeEval >= -400)
      return 'blunder';
    if (beforeEval >= -600)
      return 'mistake';
    if (beforeEval >= -1200)
      return 'inaccuracy';

    // beforeEval < -1200
    return 'good';
  }
  else {
    if (!mateIsPositive) {
      // black moves, then black has mate --> technically not possible,
      // but may happen in a winning endgame (e.g. -40 to -M9) due to engine's search depth
      return 'best';
    }

    // black moves, then white has mate
    if (beforeEval <= 400)
      return 'blunder';
    if (beforeEval <= 600)
      return 'mistake';
    if (beforeEval <= 1200)
      return 'inaccuracy';

    // beforeEval > 1200
    return 'good';
  }
}

function stringToNumber(beforeEval: string, afterEval: number, whiteToMove: boolean): Classification {
  const mateIsPositive = beforeEval.startsWith('+');

  if (whiteToMove) {
    if (!mateIsPositive) {
      // black has mate, white moves, then black loses mate --> not possible
      throw new Error ('This should not happen');
    }

    // white has mate, white moves, then white loses mate
    if (afterEval <= 300)
      return 'blunder';
    if (afterEval <= 500)
      return 'mistake';

    return 'inaccuracy';
  }
  else {
    if (mateIsPositive) {
      // white has mate, black moves, then white loses mate --> not possible
      throw new Error ('This should not happen');
    }

    // black has mate, black moves, then black loses mate
    if (afterEval >= -300)
      return 'blunder';
    if (afterEval >= -500)
      return 'mistake';

    return 'inaccuracy';
  }
}

function classifyByEval(beforeEval: string | number, afterEval: string | number, i: number) {
  const whiteToMove = i % 2 === 0;

  if (typeof beforeEval === 'number') {
    if (typeof afterEval === 'number')
      return bothNumbers(beforeEval, afterEval, whiteToMove);

    return numberToString(beforeEval, afterEval, whiteToMove);
  }
  else {
    if (typeof afterEval === 'string')
      return bothStrings(beforeEval, afterEval, whiteToMove);

    return stringToNumber(beforeEval, afterEval, whiteToMove);
  }
}

function sniffBook(lan: string, history: Move[], i: number) {
  // must be able to sniff variants as well
  const fens = [DEFAULT_POSITION, ...history.map(move => move.after)];
  const fenBeforeMove = fens[i];
  const chess = new Chess(fenBeforeMove);
  chess.move(lanToSan(lan, i, fens));
  const fenAfterMove = chess.fen();
  const concanatedUci = history.slice(0, i + 1).map(move => move.lan).join(' ');
  const epdRegex = /[\w/]+\s[wb]\s(\w+|-)\s(\w+|-)/;

  const foundOpening = openings.find((opening) => {
    // match by moves
    if (opening.uci === concanatedUci)
      return true;

    // match by fen
    const fenMatches = fenAfterMove.match(epdRegex);

    if (fenMatches && opening.epd === fenMatches[0]) {
      return true;
    }

    return false;
  });

  return foundOpening ? 'book' : false;
}

function sniffForced(subArr: MoveEval[]) {
  return subArr.length === 1 ? 'forced' : false;
}

export default function classify({
  subArr,
  lan,
  history,
  i,
  beforeEval,
  afterEval,
}: {
  subArr: MoveEvalMerged[] | MoveEvalWithClass[];
  lan: string;
  history: Move[];
  i: number;
  beforeEval: string | number;
  afterEval: string | number;
}) {
  return sniffForced(subArr) || sniffBook(lan, history, i) || classifyByEval(beforeEval, afterEval, i);
}
