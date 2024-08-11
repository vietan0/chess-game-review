import { SQUARES } from 'chess.js';
import { nanoid } from 'nanoid';
import { useMemo } from 'react';

import BoardSquare from './BoardSquare';
import PlayerBadge from './PlayerBadge';
import { useStore } from './store';

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
      if (!piece) {
        return (
          <div className="size-[1/8]" key={nanoid()} />
        );
      }

      return (
        <img
          className="size-[1/8] select-none"
          key={nanoid()}
          src={`/img/pieces/${piece.color}${piece.type}.png`}
        />
      );
    });

    return piecesRow;
  });

  return (
    <div className="flex flex-col gap-2" id="Board">
      <PlayerBadge color={isFlipped ? 'w' : 'b'} />
      <div className="relative size-[600px] overflow-hidden rounded" id="actual-board">
        <div className="absolute grid size-full grid-cols-8 grid-rows-8" id="background">
          {boardSquares}
        </div>
        <div className="absolute grid size-full grid-cols-8 grid-rows-8" id="pieces">
          {pieces}
        </div>
      </div>
      <PlayerBadge color={isFlipped ? 'b' : 'w'} />
    </div>
  );
}
