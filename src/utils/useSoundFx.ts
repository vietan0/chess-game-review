import { Chess } from 'chess.js';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import capture from '../sound/capture.mp3';
import castle from '../sound/castle.mp3';
import moveCheck from '../sound/move-check.mp3';
import moveSelf from '../sound/move-self.mp3';
import promote from '../sound/promote.mp3';
import { useBoardStore } from '../useBoardStore';

const sound: Record<string, HTMLAudioElement> = {
  moveSelf: new Audio(moveSelf),
  moveCheck: new Audio(moveCheck),
  castle: new Audio(castle),
  capture: new Audio(capture),
  promote: new Audio(promote),
};

export default function useSoundFx() {
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
    function stopAll() {
      for (const key in sound) {
        sound[key].pause();
        sound[key].currentTime = 0;
      }
    }

    function playSound() {
      if (!currentMove) {
        // starting position
        stopAll();

        if (lastNav === -1) {
          sound.moveSelf.play();
        }
      }

      else {
        if (new Chess(currentMove.after).inCheck()) {
          stopAll();
          sound.moveCheck.play();

          return;
        }

        if (currentMove.flags.includes('p')) {
          stopAll();
          sound.promote.play();

          return;
        }

        if (currentMove.flags.includes('c') || currentMove.flags.includes('e')) {
          stopAll();
          sound.capture.play();

          return;
        }

        if (currentMove.flags.includes('k') || currentMove.flags.includes('q')) {
          stopAll();
          sound.castle.play();
        }

        else {
          stopAll();
          sound.moveSelf.play();
        }
      }
    }

    playSound();
  }, [currentMoveNum]);
}
