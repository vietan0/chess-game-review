import { Chess, type Square } from 'chess.js';

import { useBoardStore } from '../useBoardStore';
import cn from '../utils/cn';

export default function Coor({ square }: { square: Square }) {
  const color = new Chess().squareColor(square);
  const isFlipped = useBoardStore(state => state.isFlipped);
  const isFirstCol = square.includes(isFlipped ? 'h' : 'a');
  const isFirstRow = square.includes(isFlipped ? '8' : '1');
  const cornerSquare = isFlipped ? 'h8' : 'a1';

  const file = (
    <span
      className={cn(
        'absolute bottom-0.5 right-1 select-none text-sm font-semibold',
        color === 'light' ? 'text-darkSquare' : 'text-lightSquare',
      )}
    >
      {square[0]}
    </span>
  );

  const rank = (
    <span
      className={cn(
        'absolute left-1 top-1 select-none text-sm font-semibold',
        color === 'light' ? 'text-darkSquare' : 'text-lightSquare',
      )}
    >
      {square[1]}
    </span>
  );

  if (square === cornerSquare) {
    return (
      <>
        {file}
        {rank}
      </>
    );
  }

  else if (isFirstRow) {
    return file;
  }

  else if (isFirstCol) {
    return rank;
  }
}
