import type { Capturable, Material } from './getCaptured';
import type { Color, PieceSymbol, Square } from 'chess.js';

function getRemainingPieces(
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][],
  color: Color,
) {
  const pieces = board.flat().filter(piece => piece !== null && piece.type !== 'k' && piece.color === color) as ({
    square: Square;
    type: Capturable;
    color: Color;
  })[];

  const remaining: Material = { p: 0, n: 0, b: 0, r: 0, q: 0 };

  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    remaining[piece.type as Capturable]++;
  }

  return remaining;
}

function calcMaterial(remainingPieces: Material) {
  let total = 0;

  for (const [piece, number] of Object.entries(remainingPieces) as [Capturable, number][]) {
    if (piece === 'p') {
      total += number;
    }

    if (piece === 'n' || piece === 'b') {
      total += number * 3;
    }

    if (piece === 'r') {
      total += number * 5;
    }

    if (piece === 'q') {
      total += number * 9;
    }
  }

  return total;
}

export default function getDiff(board: ({
  square: Square;
  type: PieceSymbol;
  color: Color;
} | null)[][], color: Color) {
  const wRemaining = getRemainingPieces(board, 'w');
  const bRemaining = getRemainingPieces(board, 'b');
  const wTotal = calcMaterial(wRemaining);
  const bTotal = calcMaterial(bRemaining);
  const diff = color === 'w' ? wTotal - bTotal : bTotal - wTotal;

  return diff;
}
