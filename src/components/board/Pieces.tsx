import { Chess } from 'chess.js';
import { motion } from 'framer-motion';
import { useShallow } from 'zustand/react/shallow';

import { useBoardStore } from '../../stores/useBoardStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { getPiecePath } from '../../utils/getPath';
import translatePiece from '../../utils/translatePiece';

import type { Color, PieceSymbol, Square } from 'chess.js';

export default function Pieces() {
  const {
    currentGame,
    currentMoveNum,
    lastNav,
    isFlipped,
  } = useBoardStore(useShallow(state => ({
    currentGame: state.currentGame,
    currentMoveNum: state.currentMoveNum,
    lastNav: state.lastNav,
    isFlipped: state.isFlipped,
  })));

  const history = currentGame.history({ verbose: true });
  const currentMove = history[currentMoveNum - 1];
  const nextMove = history[currentMoveNum];
  const displayedGame = new Chess(currentMoveNum > 0 ? history[currentMoveNum - 1].after : undefined);
  const board = displayedGame.board();
  const { pieces: piecesTheme } = useSettingsStore(state => state.settings);

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
          alt={`${piece.color}${piece.type}`}
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
          src={getPiecePath(`${piece.color}${piece.type}`, `pieces/${piecesTheme}`, 'png')}
          transition={{ duration: 0.075, bounce: 0 }}
        />
      );
    });

    return piecesRow;
  });

  return (
    <div className="absolute size-full" id="pieces">
      {pieces}
    </div>
  );
}
