import Badge from '../icons/endgame-badges/Badge';
import badgeStyle from '../utils/badgeStyle';
import useLoser from './useLoser';
import useResult from './useResult';

import type { BlackBadge, WhiteBadge } from '../utils/endgameBadges';

export default function useEndgameBadges() {
  const result = useResult();
  const isGameOver = result && ['1-0', '0-1', '1/2-1/2'].includes(result);
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
