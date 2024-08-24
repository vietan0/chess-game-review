import { Chess } from 'chess.js';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useBoardStore } from '../useBoardStore';
import { useSelectGameStore } from '../useSelectGameStore';
import getIconPath from '../utils/getIconPath';
import translatePiece from '../utils/translatePiece';
import useSoundFx from '../utils/useSoundFx';
import BoardSquares from './BoardSquares';
import Coors from './Coors';
import EndgameBadges from './EndgameBadges';
import Highlight from './Highlight';
import PlayerBadge from './PlayerBadge';

import type { Color, PieceSymbol, Square } from 'chess.js';

export default function Board() {
  useSoundFx();

  const {
    currentGame,
    currentMoveNum,
    lastNav,
    isFlipped,
    flipBoard,
  } = useBoardStore(useShallow(state => ({
    currentGame: state.currentGame,
    currentMoveNum: state.currentMoveNum,
    lastNav: state.lastNav,
    isFlipped: state.isFlipped,
    flipBoard: state.flipBoard,
  })));

  const stage = useSelectGameStore(state => state.stage);
  const username = useSelectGameStore(state => state.username);

  useEffect(() => {
    if (stage === 'loaded' && username) {
      // if game loaded through a site
      const white = currentGame.header().White;

      if (username.toLowerCase() === white.toLowerCase()) {
        flipBoard(false);
      }
      else {
        flipBoard(true);
      }
    }
  }, [stage]);

  const history = currentGame.history({ verbose: true });
  const displayedGame = new Chess(currentMoveNum > 0 ? history[currentMoveNum - 1].after : undefined);
  const currentMove = history[currentMoveNum - 1];
  const nextMove = history[currentMoveNum];
  const board = displayedGame.board();

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
          src={getIconPath(`${piece.color}${piece.type}`, 'pieces', 'png')}
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
        <BoardSquares />
        <Highlight />
        <Coors />
        <div className="absolute size-full" id="pieces">
          {pieces}
        </div>
        <EndgameBadges />
      </div>
      <PlayerBadge color={isFlipped ? 'b' : 'w'} displayedGame={displayedGame} />
    </div>
  );
}
