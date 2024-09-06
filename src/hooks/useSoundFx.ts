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

  useEffect(() => {
    function playSound() {
      if (!currentMove) {
        // starting position

        if (lastNav === -1) {
          playMoveSelf();
        }
      }

      else {
        if (new Chess(currentMove.after).inCheck()) {
          playMoveCheck();

          return;
        }

        if (currentMove.flags.includes('p')) {
          playPromote();

          return;
        }

        if (currentMove.flags.includes('c') || currentMove.flags.includes('e')) {
          playCapture();

          return;
        }

        if (currentMove.flags.includes('k') || currentMove.flags.includes('q')) {
          playCastle();
        }

        else {
          playMoveSelf();
        }
      }
    }

    playSound();
  }, [currentMoveNum]);
}
