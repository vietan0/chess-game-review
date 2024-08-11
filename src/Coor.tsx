import { Chess, type Square } from 'chess.js';

import cn from './utils/cn';

export default function Coor({ square }: { square: Square }) {
  const chess = new Chess();
  const color = chess.squareColor(square);

  const file = (
    <span
      className={cn(
        'absolute bottom-1 right-1 select-none text-xs font-semibold',
        color === 'light' ? 'text-darkSquare' : 'text-lightSquare',
      )}
    >
      {square[0]}
    </span>
  );

  const rank = (
    <span
      className={cn(
        'absolute left-1 top-1 select-none text-xs font-semibold',
        color === 'light' ? 'text-darkSquare' : 'text-lightSquare',
      )}
    >
      {square[1]}
    </span>
  );

  if (square === 'a1') {
    return (
      <>
        {file}
        {rank}
      </>
    );
  }

  else if (square.includes('1')) {
    return file;
  }

  else if (square.includes('a')) {
    return rank;
  }
}
