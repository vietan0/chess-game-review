import { Chess, type Square } from 'chess.js';

import Coor from './Coor';
import cn from './utils/cn';

export default function BoardSquare({
  isLastMove,
  square,
}: { isLastMove: boolean; square: Square }) {
  const chess = new Chess();
  const color = chess.squareColor(square);

  return (
    <div
      className={cn(
        'relative',
        color === 'dark' ? 'bg-darkSquare' : 'bg-lightSquare',
      )}
      id={square}
    >
      {isLastMove && <div className="size-full bg-lastMove"></div>}
      <Coor square={square} />
    </div>
  );
}
