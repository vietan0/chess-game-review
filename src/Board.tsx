import { SQUARES } from 'chess.js';
import { motion } from 'framer-motion';
import { useShallow } from 'zustand/react/shallow';

import BoardSquare from './BoardSquare';
import EndgameBadges from './EndgameBadges';
import PlayerBadge from './PlayerBadge';
import { useStore } from './store';
import translatePiece from './utils/translatePiece';

import type { Chess, Color, PieceSymbol, Square } from 'chess.js';

export default function Board({ displayedGame }: { displayedGame: Chess }) {
  const {
    currentGame,
    currentMoveNum,
    lastNav,
    isFlipped,
  } = useStore(useShallow(state => ({
    currentGame: state.currentGame,
    currentMoveNum: state.currentMoveNum,
    lastNav: state.lastNav,
    isFlipped: state.isFlipped,
  })));

  const history = currentGame.history({ verbose: true });
  const prevMove = currentMoveNum === 0 ? undefined : history[currentMoveNum - 1];
  const currentMove = currentMoveNum === history.length ? undefined : history[currentMoveNum];
  const board = displayedGame.board();

  const boardSquares = SQUARES.map(square => (
    <BoardSquare
      isLastMove={prevMove?.from === square || prevMove?.to === square}
      key={square}
      square={square}
    />
  ));

  /**
   * Generate initial x,y for piece animation.
   * - Animation always go from `initial` --> `animate` (I'm using Framer Motion's terms here)
   * - Current square is always `animate`.
   * - When moving forward, `initial` is `prevMove.from`.
   * - When moving backward, `initial` is `currentMove.to`
   */
  function getInitSquare(piece: { square: Square; type: PieceSymbol; color: Color }) {
    if (lastNav > 0) {
      if (!prevMove)
        return piece.square;

      if (piece.type !== prevMove.piece || piece.color !== prevMove.color || piece.square !== prevMove.to) {
        // not the same piece
        return piece.square;
      }

      return prevMove.from;
    }
    else {
      if (!currentMove)
        return piece.square;

      if (piece.type !== currentMove.piece || piece.color !== currentMove.color || piece.square !== currentMove.from) {
        // not the same piece
        return piece.square;
      }

      return currentMove.to;
    }
  }

  const pieces = board.flatMap((row) => {
    const piecesRow = row.map((piece) => {
      if (!piece)
        return null;

      const [initX, initY] = translatePiece(getInitSquare(piece), isFlipped);
      const [x, y] = translatePiece(piece.square, isFlipped);
      const key = `${piece.color}${piece.type}-${piece.square}-${String(isFlipped)}`;

      return (
        <motion.img
          animate={{
            x: `${x}%`,
            y: `${y}%`,
          }}
          className="absolute w-[12.5%] select-none"
          initial={{
            x: `${initX}%`,
            y: `${initY}%`,
          }}
          key={key}
          src={`/img/pieces/${piece.color}${piece.type}.png`}
          transition={{ duration: 0.1, bounce: 0 }}
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
