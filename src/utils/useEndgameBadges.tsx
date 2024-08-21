import { useBoardStore } from '../useBoardStore';
import useLoser from './useLoser';

export default function useEndgameBadges() {
  const currentGame = useBoardStore(state => state.currentGame);
  const header = currentGame.header();
  const result = header.Result;
  const isGameOver = ['1-0', '0-1', '1/2-1/2'].includes(result);
  let wkBadgePath;
  let bkBadgePath;
  const { loseBy } = useLoser();

  if (!isGameOver) {
    return ['', ''];
  }

  if (result === '1-0') {
    wkBadgePath = 'winner';
    bkBadgePath = `${loseBy!}-black`;
  }
  else if (result === '0-1') {
    wkBadgePath = `${loseBy!}-white`;
    bkBadgePath = 'winner';
  }
  else {
    // result must be '1/2-1/2'
    wkBadgePath = 'draw-white';
    bkBadgePath = 'draw-black';
  }

  return [wkBadgePath, bkBadgePath];
}
