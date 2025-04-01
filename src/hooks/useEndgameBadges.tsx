import Badge from '../icons/endgame-badges/Badge';
import { useBoardStore } from '../stores/useBoardStore';
import badgeStyle from '../utils/badgeStyle';
import useLoser from './useLoser';

type WhiteBadge = 'abandoned' | 'checkmate-white' | 'draw-white' | 'resign-white' | 'timeout-white' | 'winner' | null;
type BlackBadge = 'abandoned' | 'checkmate-black' | 'draw-black' | 'resign-black' | 'timeout-black' | 'winner' | null;

export type BadgeType = 'abandoned' | 'checkmate-black' | 'checkmate-white' | 'draw-black' | 'draw-white' | 'resign-black' | 'resign-white' | 'timeout-black' | 'timeout-white' | 'winner' | null;

export default function useEndgameBadges() {
  const currentGame = useBoardStore(state => state.currentGame);
  const header = currentGame.header();
  const result = header.Result;
  const isGameOver = ['1-0', '0-1', '1/2-1/2'].includes(result);
  let wResult: WhiteBadge = null;
  let bResult: BlackBadge = null;
  const { loseBy } = useLoser();

  if (!isGameOver) {
    wResult = null;
    bResult = null;
  }
  else if (result === '1-0') {
    wResult = 'winner';
    bResult = (loseBy === null || loseBy === 'abandoned') ? loseBy : `${loseBy}-black`;
  }
  else if (result === '0-1') {
    wResult = (loseBy === null || loseBy === 'abandoned') ? loseBy : `${loseBy!}-white`;
    bResult = 'winner';
  }
  else {
    // result must be '1/2-1/2'
    wResult = 'draw-white';
    bResult = 'draw-black';
  }

  const wkBadge = (
    <Badge
      badge={wResult}
      style={badgeStyle}
    />
  );

  const bkBadge = (
    <Badge
      badge={bResult}
      style={badgeStyle}
    />
  );

  return [wkBadge, bkBadge];
}
