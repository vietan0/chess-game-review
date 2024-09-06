import { Chess, SQUARES, type Square } from 'chess.js';

import { useBoardStore } from '../../stores/useBoardStore';
import cn from '../../utils/cn';
import translatePiece from '../../utils/translatePiece';

function BoardSquare({ square }: { square: Square }) {
  const isFlipped = useBoardStore(state => state.isFlipped);
  const color = new Chess().squareColor(square);
  const [x, y] = translatePiece(square, isFlipped);

  return (
    <div
      className={cn(
        'absolute size-[12.5%]',
        color === 'dark' ? 'bg-darkSquare' : 'bg-lightSquare',
      )}
      style={{ transform: `translate(${x}%, ${y}%)` }}
    />
  );
}

export default function BoardSquares() {
  return (
    <div className="absolute size-full overflow-hidden rounded" id="background">
      {SQUARES.map(square => <BoardSquare key={square} square={square} />)}
    </div>
  );
}
