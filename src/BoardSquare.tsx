import { Chess, type Square } from 'chess.js';

import Coor from './Coor';
import { useStore } from './store';
import cn from './utils/cn';
import translatePiece from './utils/translatePiece';

export default function BoardSquare({
  isLastMove,
  square,
}: { isLastMove: boolean; square: Square }) {
  const chess = new Chess();
  const isFlipped = useStore(state => state.isFlipped);
  const color = chess.squareColor(square);
  const [x, y] = translatePiece(square, isFlipped);

  return (
    <div
      className={cn(
        'absolute size-[12.5%]',
        color === 'dark' ? 'bg-darkSquare' : 'bg-lightSquare',
      )}
      id={square}
      style={{ transform: `translate(${x}%, ${y}%)` }}
    >
      {isLastMove && <div className="size-full bg-lastMove"></div>}
      <Coor square={square} />
    </div>
  );
}
