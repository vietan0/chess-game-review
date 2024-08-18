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
  const currentMove = history[currentMoveNum - 1];
  const nextMove = history[currentMoveNum];
  const board = displayedGame.board();

  const boardSquares = SQUARES.map(square => (
    <BoardSquare
      isHighlight={currentMove?.from === square || currentMove?.to === square}
      key={square}
      square={square}
    />
  ));

  // console.log('currentMove', currentMove);
  // console.log('nextMove', nextMove);

  /**
   * Generate initial x,y for piece animation.
   * - Animation always go from `initial` --> `animate` (I'm using Framer Motion's terms here)
   * - Current square is always `animate`.
   * - When moving forward (X --> Y), `initial` is `currentMove.from` / `Y.from`.
   * - When moving backward (Y --> X), `initial` is `nextMove.to` / `Y.to`.
   */
  function getInitSquare(piece: { square: Square; type: PieceSymbol; color: Color }) {
    if (lastNav === 0) {
      // lastNav === 0 happens when you flip the board.
      // By doing this, when you flip the board, the piece is not animated again.
      return piece.square;
    }

    else if (lastNav > 0) {
      // nav-ing forward
      if (!currentMove)
        return piece.square;

      if (piece.type !== currentMove.piece || piece.color !== currentMove.color || piece.square !== currentMove.to) {
        // not the same piece
        return piece.square;
      }

      return currentMove.from;
    }
    else {
      // nav-ing backward
      console.info('nav-ing backward');
      console.log(`animate from ${nextMove.to} to ${nextMove.from}`);

      if (piece.type !== nextMove.piece || piece.color !== nextMove.color || piece.square !== nextMove.from) {
        // not the same piece
        return piece.square;
      }

      return nextMove.to;
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
      <PlayerBadge color={isFlipped ? 'w' : 'b'} displayedGame={displayedGame} />
      <div className="relative size-[600px]" id="actual-board">
        <div className="absolute size-full overflow-hidden rounded" id="background">
          {boardSquares}
        </div>
        <div className="absolute size-full" id="pieces">
          {pieces}
        </div>
        <EndgameBadges />
      </div>
      <PlayerBadge color={isFlipped ? 'b' : 'w'} displayedGame={displayedGame} />
    </div>
  );
}
