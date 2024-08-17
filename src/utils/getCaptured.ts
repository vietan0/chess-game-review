import type { Color, Move } from 'chess.js';

// Because `PieceSymbol` includes 'k', which would never be captured
export type Capturable = 'p' | 'n' | 'b' | 'r' | 'q';
export type CaptureMove = Omit<Move, 'captured'> & { captured: Capturable };
export type Material = Record<Capturable, number>;

export default function getCaptured(history: Move[], currentMoveNum: number, color: Color) {
  // color means color of the *capturer*
  const historyTillCurrent = history.slice(0, currentMoveNum);
  const captured: Material = { p: 0, n: 0, b: 0, r: 0, q: 0 };

  for (const move of historyTillCurrent) {
    if (move.captured && move.color === color) {
      const captureMove = move as CaptureMove;
      captured[captureMove.captured]++;
    }
  }

  return captured;
}
