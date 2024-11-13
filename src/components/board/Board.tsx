import { useEffect } from 'react';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { useShallow } from 'zustand/react/shallow';

import useSoundFx from '../../hooks/useSoundFx';
import { useBoardStore } from '../../stores/useBoardStore';
import { useEvalStore } from '../../stores/useEvalStore';
import { useManualHighlightStore } from '../../stores/useManualHighlightStore';
import { useSelectGameStore } from '../../stores/useSelectGameStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useStageStore } from '../../stores/useStageStore';
import { useStockfishOutputStore } from '../../stores/useStockfishOutputStore';
import Arrows from './Arrows';
import Coors from './Coors';
import EndgameBadges from './EndgameBadges';
import EvalBar from './EvalBar';
import Highlight from './Highlight';
import MoveClassificationBadges from './MoveClassificationBadges';
import Pieces from './Pieces';
import PlayerBadge from './PlayerBadge';

if (!import.meta.env.PROD) {
  mountStoreDevtool('selectGameStore', useSelectGameStore);
  mountStoreDevtool('boardStore', useBoardStore);
  mountStoreDevtool('stockfishOutputStore', useStockfishOutputStore);
  mountStoreDevtool('settingsStore', useSettingsStore);
  mountStoreDevtool('evalStore', useEvalStore);
  mountStoreDevtool('stageStore', useStageStore);
  mountStoreDevtool('manualHighlightStore', useManualHighlightStore);
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

  const isLoaded = useStageStore(state => state.computed.isLoaded);
  const username = useSelectGameStore(state => state.username);
  const { board } = useSettingsStore(state => state.settings);

  useEffect(() => {
    if (isLoaded && username) {
      // if game loaded through a site
      const white = currentGame.header().White;

      if (username.toLowerCase() === white.toLowerCase()) {
        flipBoard(false);
      }
      else {
        flipBoard(true);
      }
    }
  }, [isLoaded]);

  return (
    <div className="flex flex-col items-end gap-2" id="Board">
      <PlayerBadge color={isFlipped ? 'w' : 'b'} />
      <div className="flex gap-3" id="Board&Bar">
        <EvalBar />
        <div className="relative size-[600px]" id="actual-board">
          <img
            alt=""
            className="absolute"
            src={`./boards/${board}.png`}
          />
          <Highlight />
          <Coors />
          <Pieces />
          <Arrows />
          <MoveClassificationBadges />
          <EndgameBadges />
        </div>
      </div>
      <PlayerBadge color={isFlipped ? 'b' : 'w'} />
    </div>
  );
}
