/* eslint-disable unused-imports/no-unused-vars */
export type Classification = 'best' | 'excellent' | 'good' | 'inaccuracy' | 'mistake' | 'blunder' | 'forced';

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
  const thresholds = chooseThresholds(beforeEval, wasLosing);
  const classification = getClassFromThresholds(delta, thresholds);

  return classification;
}

function bothStrings(beforeEval: string, afterEval: string, whiteToMove: boolean): Classification {
  // 1. checkmate case
  if (afterEval === '1-0' || afterEval === '0-1') {
    return 'best';
  }

  // 2. switch sign means blunder
  if (
    (beforeEval[0] === '-' && afterEval[0] === '+')
    || (beforeEval[0] === '+' && afterEval[0] === '-')) {
    return 'blunder';
  }

  // 3. same sign -> compare mate values
  const beforeM = Number(beforeEval.slice(2));
  const afterM = Number(afterEval.slice(2));
  const deltaM = whiteToMove ? afterM - beforeM : beforeM - afterM;

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
  const mateIsPositive = afterEval.startsWith('+');

  if (whiteToMove) {
    if (mateIsPositive) {
      // white moves, then white has mate --> not possible
      throw new Error ('This should not happen');
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
      // black moves, then black has mate --> not possible
      throw new Error ('This should not happen');
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

export default function classify(beforeEval: string | number, afterEval: string | number, i: number, forced = false) {
  if (forced)
    return 'forced';
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

const before = [
  [
    {
      pv: 'e2e4',
      nodes: 148919,
      multiPv: 1,
      eval: 25,
    },
    {
      pv: 'd2d4',
      nodes: 148919,
      multiPv: 2,
      eval: 20,
    },
    {
      pv: 'c2c4',
      nodes: 148919,
      multiPv: 3,
      eval: 16,
    },
  ],
  [
    {
      pv: 'e7e6',
      nodes: 88070,
      multiPv: 3,
      eval: 22,
    },
    {
      pv: 'e7e5',
      nodes: 88070,
      multiPv: 2,
      eval: 22,
    },
    {
      pv: 'c7c5',
      nodes: 88070,
      multiPv: 1,
      eval: 25,
    },
  ],
  [
    {
      pv: 'g1f3',
      nodes: 129021,
      multiPv: 1,
      eval: 21,
    },
    {
      pv: 'd2d4',
      nodes: 129021,
      multiPv: 2,
      eval: 20,
    },
    {
      pv: 'b1c3',
      nodes: 129021,
      multiPv: 3,
      eval: 16,
    },
  ],
  [
    {
      pv: 'd7d5',
      nodes: 92279,
      multiPv: 1,
      eval: 21,
    },
    {
      pv: 'a7a6',
      nodes: 92279,
      multiPv: 2,
      eval: 57,
    },
    {
      pv: 'c6c5',
      nodes: 92279,
      multiPv: 3,
      eval: 61,
    },
  ],
  [
    {
      pv: 'b1c3',
      nodes: 81586,
      multiPv: 1,
      eval: 21,
    },
    {
      pv: 'e4d5',
      nodes: 81586,
      multiPv: 2,
      eval: 19,
    },
    {
      pv: 'e4e5',
      nodes: 81586,
      multiPv: 3,
      eval: -4,
    },
  ],
  [
    {
      pv: 'c8g4',
      nodes: 79489,
      multiPv: 1,
      eval: 21,
    },
    {
      pv: 'd5e4',
      nodes: 79489,
      multiPv: 2,
      eval: 30,
    },
    {
      pv: 'g8f6',
      nodes: 79489,
      multiPv: 3,
      eval: 39,
    },
  ],
  [
    {
      pv: 'c3e4',
      nodes: 94534,
      multiPv: 1,
      eval: 30,
    },
    {
      pv: 'f3g5',
      nodes: 94534,
      multiPv: 2,
      eval: -47,
    },
    {
      pv: 'f3e5',
      nodes: 94534,
      multiPv: 3,
      eval: -47,
    },
  ],
  [
    {
      pv: 'c8f5',
      nodes: 62220,
      multiPv: 2,
      eval: 28,
    },
    {
      pv: 'g8f6',
      nodes: 62220,
      multiPv: 1,
      eval: 30,
    },
    {
      pv: 'b8d7',
      nodes: 62220,
      multiPv: 3,
      eval: 41,
    },
  ],
  [
    {
      pv: 'e4g3',
      nodes: 86096,
      multiPv: 1,
      eval: 143,
    },
    {
      pv: 'e4c3',
      nodes: 86096,
      multiPv: 2,
      eval: 124,
    },
    {
      pv: 'e4g5',
      nodes: 86096,
      multiPv: 3,
      eval: 78,
    },
  ],
  [
    {
      pv: 'e7e6',
      nodes: 79523,
      multiPv: 1,
      eval: 124,
    },
    {
      pv: 'g8f6',
      nodes: 79523,
      multiPv: 2,
      eval: 139,
    },
    {
      pv: 'b7b5',
      nodes: 79523,
      multiPv: 3,
      eval: 149,
    },
  ],
  [
    {
      pv: 'f1c4',
      nodes: 87044,
      multiPv: 1,
      eval: 139,
    },
    {
      pv: 'd2d4',
      nodes: 87044,
      multiPv: 2,
      eval: 139,
    },
    {
      pv: 'f1d3',
      nodes: 87044,
      multiPv: 3,
      eval: 121,
    },
  ],
  [
    {
      pv: 'a7a5',
      nodes: 109791,
      multiPv: 2,
      eval: 137,
    },
    {
      pv: 'e7e6',
      nodes: 109791,
      multiPv: 1,
      eval: 139,
    },
    {
      pv: 'c8e6',
      nodes: 109791,
      multiPv: 3,
      eval: 159,
    },
  ],
  [
    {
      pv: 'f1b5',
      nodes: 142544,
      multiPv: 1,
      eval: 215,
    },
    {
      pv: 'd4d5',
      nodes: 142544,
      multiPv: 2,
      eval: 197,
    },
    {
      pv: 'c1f4',
      nodes: 142544,
      multiPv: 3,
      eval: 187,
    },
  ],
  [
    {
      pv: 'a7a6',
      nodes: 76049,
      multiPv: 1,
      eval: 197,
    },
    {
      pv: 'g7g6',
      nodes: 76049,
      multiPv: 2,
      eval: 218,
    },
    {
      pv: 'b8d7',
      nodes: 76049,
      multiPv: 3,
      eval: 235,
    },
  ],
  [
    {
      pv: 'f1b5',
      nodes: 113459,
      multiPv: 1,
      eval: 245,
    },
    {
      pv: 'f1c4',
      nodes: 113459,
      multiPv: 2,
      eval: 198,
    },
    {
      pv: 'c1g5',
      nodes: 113459,
      multiPv: 3,
      eval: 148,
    },
  ],
  [
    {
      pv: 'c8d7',
      nodes: 57784,
      multiPv: 1,
      eval: 245,
    },
    {
      pv: 'e8e7',
      nodes: 57784,
      multiPv: 2,
      eval: 314,
    },
    {
      pv: 'e8f7',
      nodes: 57784,
      multiPv: 3,
      eval: 409,
    },
  ],
  [
    {
      pv: 'd1e2',
      nodes: 93516,
      multiPv: 2,
      eval: 335,
    },
    {
      pv: 'c1g5',
      nodes: 93516,
      multiPv: 3,
      eval: 326,
    },
    {
      pv: 'b5c4',
      nodes: 93516,
      multiPv: 1,
      eval: 314,
    },
  ],
  [
    {
      pv: 'a7a6',
      nodes: 121029,
      multiPv: 1,
      eval: 326,
    },
    {
      pv: 'd8d6',
      nodes: 121029,
      multiPv: 2,
      eval: 332,
    },
    {
      pv: 'd8b6',
      nodes: 121029,
      multiPv: 3,
      eval: 344,
    },
  ],
  [
    {
      pv: 'b5c4',
      nodes: 178956,
      multiPv: 1,
      eval: 326,
    },
    {
      pv: 'b5e2',
      nodes: 178956,
      multiPv: 2,
      eval: 221,
    },
    {
      pv: 'b5a4',
      nodes: 178956,
      multiPv: 3,
      eval: 190,
    },
  ],
  [
    {
      pv: 'b7b5',
      nodes: 89699,
      multiPv: 2,
      eval: 262,
    },
    {
      pv: 'h7h6',
      nodes: 89699,
      multiPv: 1,
      eval: 326,
    },
    {
      pv: 'e7e8',
      nodes: 89699,
      multiPv: 3,
      eval: 352,
    },
  ],
  [
    {
      pv: 'c3d5',
      nodes: 270664,
      multiPv: 1,
      eval: 671,
    },
    {
      pv: 'e1g1',
      nodes: 270664,
      multiPv: 2,
      eval: 605,
    },
    {
      pv: 'd1d5',
      nodes: 270664,
      multiPv: 3,
      eval: 543,
    },
  ],
  [
    {
      pv: 'e7e8',
      nodes: 106406,
      multiPv: 1,
      eval: 671,
    },
    {
      pv: 'e7d7',
      nodes: 106406,
      multiPv: 2,
      eval: 791,
    },
    {
      pv: 'd8d5',
      nodes: 106406,
      multiPv: 3,
      eval: 902,
    },
  ],
  [
    {
      pv: 'd1e2',
      nodes: 157599,
      multiPv: 1,
      eval: 671,
    },
    {
      pv: 'e1g1',
      nodes: 157599,
      multiPv: 2,
      eval: 621,
    },
    {
      pv: 'd5f6',
      nodes: 157599,
      multiPv: 3,
      eval: 543,
    },
  ],
  [
    {
      pv: 'g7f6',
      nodes: 55573,
      multiPv: 1,
      eval: 543,
    },
    {
      pv: 'd8f6',
      nodes: 55573,
      multiPv: 2,
      eval: 733,
    },
    {
      pv: 'e8e7',
      nodes: 55573,
      multiPv: 3,
      eval: '+M2',
    },
  ],
  [
    {
      pv: 'c4f7',
      nodes: 176385,
      multiPv: 1,
      eval: 543,
    },
    {
      pv: 'd1d8',
      nodes: 176385,
      multiPv: 2,
      eval: 530,
    },
    {
      pv: 'd1e2',
      nodes: 176385,
      multiPv: 3,
      eval: 502,
    },
  ],
  [
    {
      pv: 'e8d8',
      nodes: 22849,
      multiPv: 1,
      eval: 530,
    },
  ],
];

// const beforeShort = before.slice(0, 24);

// const best3MovesMod = beforeShort.map((subArr, i) => {
//   const beforeEval = subArr[0].eval;

//   const addedClass = subArr.map((moveEval) => {
//     const afterEval = moveEval.eval;
//     const classification = classify(beforeEval, afterEval, i);

//     return { ...moveEval, classification };
//   });

//   return addedClass;
// });
