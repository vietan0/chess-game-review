import { SQUARES } from 'chess.js';

import BoardSquare from './BoardSquare';

import type { Chess } from 'chess.js';

export default function Board({ chessInstance }: { chessInstance: Chess }) {
  const board = chessInstance.board();
  const fen = chessInstance.fen();
  const history = chessInstance.history({ verbose: true });
  const lastMove = history.at(-1);
  console.log('lastMove', lastMove);

  const boardSquares = SQUARES.map(square => (
    <BoardSquare
      isLastMove={lastMove?.from === square || lastMove?.to === square}
      key={square}
      square={square}
    />
  ));

  const pieces = board.flatMap((row) => {
    const piecesRow = row.map((piece) => {
      if (!piece)
        return <div className="size-[1/8]"></div>;

      return (
        <img
          className="size-[1/8]"
          src={`/img/pieces/${piece.color}${piece.type}.png`}
        />
      );
    });

    return piecesRow;
  });

  return (
    <>
      <pre>{fen}</pre>
      <div className="relative size-[600px]" id="Board">
        <div className="absolute grid size-full grid-cols-8 grid-rows-8" id="background">
          {boardSquares}
        </div>
        <div className="absolute grid size-full grid-cols-8 grid-rows-8" id="pieces">
          {pieces}
        </div>
      </div>
    </>
  );
}
