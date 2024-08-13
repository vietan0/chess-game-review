import type { Square } from 'chess.js';

export default function translatePiece(square: Square, isFlipped: boolean, isEndgameBadge: boolean = false) {
  const letterMap = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
    f: 6,
    g: 7,
    h: 8,
  } as const;

  const col = square[0] as keyof typeof letterMap;
  const row = Number(square[1]) as typeof letterMap[keyof typeof letterMap];
  let x = 0;
  let y = 0;
  x = (letterMap[col] - 1) * 100; // a -> 0, b -> 100, c -> 200
  y = (8 - row) * 100; // 8 -> 0, 7 -> 100, 6 -> 200

  if (isFlipped) {
    x = 700 - x;
    y = 700 - y;
  }

  if (isEndgameBadge) {
    x += 80;
    y -= 17.5;
  }

  return [x.toString(), y.toString()];
}
