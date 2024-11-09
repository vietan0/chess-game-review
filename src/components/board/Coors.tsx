import { SQUARES } from 'chess.js';
import { Chess, type Square } from 'chess.js';

import { useBoardStore } from '../../stores/useBoardStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import cn from '../../utils/cn';
import translatePiece from '../../utils/translatePiece';

function Coor({ square }: { square: Square }) {
  const color = new Chess().squareColor(square)!;
  const isFlipped = useBoardStore(state => state.isFlipped);
  const isFirstCol = square.includes(isFlipped ? 'h' : 'a');
  const isFirstRow = square.includes(isFlipped ? '8' : '1');
  const cornerSquare = isFlipped ? 'h8' : 'a1';
  const isCorner = square === cornerSquare;
  const [x, y] = translatePiece(square, isFlipped);
  const board = useSettingsStore(state => state.settings.board);

  function chooseTextColorFromTheme(color: 'light' | 'dark') {
    if (board === 'green') {
      return color === 'light' ? 'text-darkGreen' : 'text-lightGreen';
    }
    else if (board === 'brown') {
      return color === 'light' ? 'text-darkBrown' : 'text-lightBrown';
    }
    else {
      return color === 'light' ? 'text-darkIce' : 'text-lightIce';
    }
  }

  const file = (
    <span
      className={cn(
        'absolute bottom-0.5 right-1 select-none text-sm font-semibold',
        chooseTextColorFromTheme(color),
      )}
    >
      {square[0]}
    </span>
  );

  const rank = (
    <span
      className={cn(
        'absolute left-1 top-1 select-none text-sm font-semibold',
        chooseTextColorFromTheme(color),
      )}
    >
      {square[1]}
    </span>
  );

  if (isCorner || isFirstCol || isFirstRow) {
    return (
      <div
        className="absolute size-[12.5%]"
        style={{ transform: `translate(${x}%, ${y}%)` }}
      >
        {isCorner
          ? (
              <>
                {file}
                {rank}
              </>
            )
          : isFirstRow ? file : isFirstCol ? rank : null}
      </div>
    );
  }
}

export default function Coors() {
  return (
    <div id="coors">
      {SQUARES.map(square => <Coor key={square} square={square} />)}
    </div>
  );
}
