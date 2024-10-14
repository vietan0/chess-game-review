import { Chess } from 'chess.js';
import { useEffect } from 'react';
import useSound from 'use-sound';
import { useShallow } from 'zustand/react/shallow';

import capture from '../sounds/capture.mp3';
import castle from '../sounds/castle.mp3';
import moveCheck from '../sounds/move-check.mp3';
import moveSelf from '../sounds/move-self.mp3';
import promote from '../sounds/promote.mp3';
import { useBoardStore } from '../stores/useBoardStore';

import type { Move } from 'chess.js';

export default function useSoundFx() {
  const [playMoveSelf] = useSound(moveSelf);
  const [playMoveCheck] = useSound(moveCheck);
  const [playCastle] = useSound(castle);
  const [playCapture] = useSound(capture);
  const [playPromote] = useSound(promote);

  const {
    currentGame,
    currentMoveNum,
    lastNav,
  } = useBoardStore(useShallow(state => ({
    currentGame: state.currentGame,
    currentMoveNum: state.currentMoveNum,
    lastNav: state.lastNav,
    randomState: state.randomState, // unused, but included to trigger re-render
  })));

  const history = currentGame.history({ verbose: true });
  const currentMove = history[currentMoveNum - 1];

  function chooseSound(move: Move) {
    if (new Chess(move.after).inCheck()) {
      playMoveCheck();

      return;
    }

    if (move.flags.includes('p')) {
      playPromote();

      return;
    }

    if (move.flags.includes('c') || move.flags.includes('e')) {
      playCapture();

      return;
    }

    if (move.flags.includes('k') || move.flags.includes('q')) {
      playCastle();
    }

    else {
      playMoveSelf();
    }
  }

  useEffect(() => {
    if (!currentMove) {
      if (lastNav === -1) {
        playMoveSelf();
      }
    }

    else {
      const nextMove = history[currentMoveNum];
      chooseSound(lastNav === -1 ? nextMove : currentMove);
    }
  }, [currentMoveNum]);
}
