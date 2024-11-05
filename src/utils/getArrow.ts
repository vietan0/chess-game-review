import type { Square } from 'chess.js';

interface HoriArrow {
  shape: 'horizontal';
  direction: 'left' | 'right';
  distance: number;
}

interface VertArrow {
  shape: 'vertical';
  direction: 'up' | 'down';
  distance: number;
}

interface DiagonalArrow {
  shape: 'diagonal';
  direction: 'upleft' | 'upright' | 'downleft' | 'downright';
  distance: number;
}

interface KnightArrow {
  shape: 'knight';
  direction: 'upleft' | 'upright' | 'downleft' | 'downright' | 'rightup' | 'rightdown' | 'leftup' | 'leftdown';
}

type Arrow = HoriArrow | VertArrow | DiagonalArrow | KnightArrow;

export default function getArrow(startSquare: Square, endSquare: Square): Arrow | null {
  // Assuming isFlipped is false. Deal with it later
  const [startFile, startRank] = startSquare;
  const [endFile, endRank] = endSquare;

  const fileVal: Record<string, number> = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
    f: 6,
    g: 7,
    h: 8,
  };

  const deltaRank = Number(endRank) - Number(startRank);
  const vertDist = Math.abs(deltaRank);
  const deltaFile = fileVal[endFile] - fileVal[startFile];
  const horiDist = Math.abs(deltaFile);

  if (startFile === endFile) {
    // vertical
    const vertArrow: VertArrow = {
      shape: 'vertical',
      distance: vertDist,
      direction: deltaRank > 0 ? 'up' : 'down',
    };

    return vertArrow;
  }

  if (startRank === endRank) {
    // horizontal
    const horiArrow: HoriArrow = {
      shape: 'horizontal',
      distance: horiDist,
      direction: deltaFile > 0 ? 'right' : 'left',
    };

    return horiArrow;
  }

  if (horiDist === vertDist) {
    // diagonal
    let direction: DiagonalArrow['direction'] | null = null;

    if (deltaRank > 0) {
      // up
      if (deltaFile > 0)
        direction = 'upright';
      else direction = 'upleft';
    }
    else {
      // down
      if (deltaFile > 0)
        direction = 'downright';
      else direction = 'downleft';
    }

    const diagonalArrow: DiagonalArrow = {
      shape: 'diagonal',
      distance: horiDist,
      direction,
    };

    return diagonalArrow;
  }

  if ((horiDist === 2 && vertDist === 1) || (horiDist === 1 && vertDist === 2)) {
    // knight
    let direction: KnightArrow['direction'] | null = null;
    console.log(deltaFile);
    console.log(horiDist);
    console.log(deltaRank);
    console.log(vertDist);

    if (horiDist === 2) {
      // right/left first
      if (deltaFile > 0) {
        // right
        direction = deltaRank > 0 ? 'rightup' : 'rightdown';
      }
      else {
        // left
        direction = deltaRank > 0 ? 'leftup' : 'leftdown';
      }
    }
    else {
      // up/down first
      if (deltaRank > 0) {
        // up
        direction = deltaFile > 0 ? 'upright' : 'upleft';
      }
      else {
        // down
        direction = deltaFile > 0 ? 'downright' : 'downleft';
      }
    }

    const knightArrow: KnightArrow = {
      shape: 'knight',
      direction,
    };

    console.log(knightArrow.direction);

    return knightArrow;
  }

  return null;
}
