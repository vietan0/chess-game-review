import type { LichessAI, LichessPlayer } from '../queries/useMonthlyArchives';

export default function isLichessAI(player: LichessPlayer | LichessAI): player is LichessAI {
  return (player as LichessAI).aiLevel !== undefined;
}
