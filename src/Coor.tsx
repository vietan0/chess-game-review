import { Chess, type Square } from 'chess.js';

import cn from './utils/cn';

export default function Coor({ square }: { square: Square }) {
  const chess = new Chess();
  const color = chess.squareColor(square);

  if (square.includes('1')) {
    return (
      <span
        className={cn(
          'absolute text-sm font-semibold right-1 bottom-1',
          color === 'light' ? 'text-darkSquare' : 'text-lightSquare',
        )}
      >
        {square[0]}
      </span>
    );
  }

  if (square.includes('a') && square !== 'a1') {
    return (
      <span
        className={cn(
          'absolute text-sm font-semibold left-1 top-1',
          color === 'light' ? 'text-darkSquare' : 'text-lightSquare',
        )}
      >
        {square[1]}
      </span>
    );
  }
}
