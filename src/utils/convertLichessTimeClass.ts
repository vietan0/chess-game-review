import type { LichessGame } from '../queries/useMonthlyArchives';

export default function convertLichessTimeClass(speed: LichessGame['speed']) {
  if (speed === 'correspondence')
    return 'daily';
  if (speed === 'ultraBullet')
    return 'bullet';
  if (speed === 'classical')
    return 'rapid';

  return speed;
}
