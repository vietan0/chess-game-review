import { useEffect } from 'react';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { useShallow } from 'zustand/react/shallow';

import { useBoardStore } from '../useBoardStore';
import { useEvalStore } from '../useEvalStore';
import { useSelectGameStore } from '../useSelectGameStore';
import useSoundFx from '../utils/useSoundFx';
import BoardSquares from './BoardSquares';
import Coors from './Coors';
import EndgameBadges from './EndgameBadges';
import Highlight from './Highlight';
import Pieces from './Pieces';
import PlayerBadge from './PlayerBadge';

if (import.meta.env.DEV) {
  mountStoreDevtool('selectGameStore', useSelectGameStore);
  mountStoreDevtool('boardStore', useBoardStore);
  mountStoreDevtool('EvalStore', useEvalStore);
}

export default function Board() {
  useSoundFx();

  const {
    currentGame,
    isFlipped,
    flipBoard,
  } = useBoardStore(useShallow(state => ({
    currentGame: state.currentGame,
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

  return (
    <div className="flex flex-col gap-2" id="Board">
      <PlayerBadge color={isFlipped ? 'w' : 'b'} />
      <div className="relative size-[600px]" id="actual-board">
        <BoardSquares />
        <Highlight />
        <Coors />
        <Pieces />
        <EndgameBadges />
      </div>
      <PlayerBadge color={isFlipped ? 'b' : 'w'} />
    </div>
  );
}
