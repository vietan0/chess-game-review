import { SQUARES } from 'chess.js';
import { nanoid } from 'nanoid';
import { useMemo } from 'react';

import BoardSquare from './BoardSquare';
import EndgameBadges from './EndgameBadges';
import PlayerBadge from './PlayerBadge';
import { useStore } from './store';
import translatePiece from './utils/translatePiece';

import type { Chess, Move } from 'chess.js';

export default function Board({
  displayedGame,
  lastMove,
}: {
  displayedGame: Chess;
  lastMove: Move | undefined;
}) {
  const isFlipped = useStore(state => state.isFlipped);
  const board = displayedGame.board();
  const reverseBoard = [...board].reverse().map(row => [...row].reverse());
  const finalBoard = useMemo(() => isFlipped ? reverseBoard : board, [isFlipped, reverseBoard, board]);
  const finalSquares = useMemo(() => isFlipped ? [...SQUARES].reverse() : SQUARES, [isFlipped]);

  const boardSquares = finalSquares.map(square => (
    <BoardSquare
      isLastMove={lastMove?.from === square || lastMove?.to === square}
      key={square}
      square={square}
    />
  ));

  const pieces = finalBoard.flatMap((row) => {
    const piecesRow = row.map((piece) => {
      if (!piece)
        return null;

      const [x, y] = translatePiece(piece.square, isFlipped);

      return (
        <img
          className="absolute w-[12.5%] select-none transition-transform"
          key={nanoid()}
          src={`/img/pieces/${piece.color}${piece.type}.png`}
          style={{ transform: `translate(${x}%, ${y}%)` }}
        />
      );
    });

    return piecesRow;
  });

  return (
    <div className="flex flex-col gap-2" id="Board">
      <PlayerBadge color={isFlipped ? 'w' : 'b'} />
      <div className="relative size-[600px] overflow-hidden rounded" id="actual-board">
        <div className="absolute size-full" id="background">
          {boardSquares}
        </div>
        <div className="absolute size-full" id="pieces">
          {pieces}
        </div>
        <EndgameBadges />
      </div>
      <PlayerBadge color={isFlipped ? 'b' : 'w'} />
    </div>
  );
}
