import { Icon } from '@iconify/react/dist/iconify.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useMemo } from 'react';

import { useStore } from './store';
import cn from './utils/cn';
import formatTimestamp from './utils/formatTimestamp';

import type { Color } from 'chess.js';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export default function PlayerBadge({ color }: { color: Color }) {
  const currentGame = useStore(state => state.currentGame);
  const currentMove = useStore(state => state.currentMove);
  const timestamps = useStore(state => state.timestamps);

  const oneSideTimestamps = timestamps
    ? color === 'w'
      ? timestamps.filter((_, i) => i % 2 === 0)
      : timestamps.filter((_, i) => i % 2 === 1)
    : null;

  const header = currentGame.header();

  const timeControl = useMemo(() => {
    if (!header.TimeControl)
      return null;
    const mainTimeRegex = /\d+(?=\+)|^\d+$/;
    const mainTimeMatches = header.TimeControl.match(mainTimeRegex);
    if (!mainTimeMatches)
      return null;

    const seconds = Number(mainTimeMatches[0]);
    const inPgnFormat = dayjs.duration(seconds, 's').format('H:mm:ss');

    return inPgnFormat;
  }, [header]);

  const name = color === 'w' ? header.White || 'White' : header.Black || 'Black';
  const rating = color === 'w' ? header.WhiteElo : header.BlackElo;
  const title = color === 'w' ? header.WhiteTitle : header.BlackTitle;
  const turn = currentMove === 0 ? null : currentMove % 2 === 1 ? 'w' : 'b';

  const timeLeft = useMemo(() => {
    // 1. check if game is correspondant
    if (header.TimeControl) {
      const incrementAfterSlashRegex = /(?<=\/)\d+$/;
      const incrementAfterSlash = header.TimeControl.match(incrementAfterSlashRegex);

      if (incrementAfterSlash) {
        // confirmed game is correspondant, display fixed increment
        const increment = Number(incrementAfterSlash[0]);
        const humanized = dayjs.duration(increment, 'seconds').humanize();

        return humanized;
      }
    }

    // 2. no timestamps in PGN
    if (!oneSideTimestamps)
      return null;

    // 3. display timestamps normally
    if (currentMove === 0) {
      return timeControl ? formatTimestamp(timeControl) : null;
    }

    if (color === 'w') {
      if (turn === 'w') {
        // currentMove: 1 3 5 7 9
        return formatTimestamp(oneSideTimestamps[(currentMove - 1) / 2]);
      }
      else {
        // currentMove: 2 4 6 8 10
        return formatTimestamp(oneSideTimestamps[(currentMove - 2) / 2]);
      }
    }
    else {
      // black
      if (turn === 'b') {
        // currentMove: 2 4 6 8 10
        return formatTimestamp(oneSideTimestamps[(currentMove - 2) / 2]);
      }
      else {
        // currentMove: 1 3 5 7 9
        if (currentMove === 1) {
          return timeControl ? formatTimestamp(timeControl) : null;
        }

        return formatTimestamp(oneSideTimestamps[(currentMove - 3) / 2]);
      }
    }
  }, [currentMove, color, timeControl, header]);

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-start gap-2">
        <Icon
          className={cn('text-4xl', color === 'b' && 'bg-default-100 text-background')}
          icon="material-symbols:person"
        />
        <div className="flex items-center gap-1">
          {title && (
            <span className="rounded-sm bg-red-900 px-0.5 text-xs font-bold">
              {title}
            </span>
          )}
          <span className="text-sm">{name}</span>
          {rating && (
            <span className="ml-1 text-xs font-bold text-foreground-500">
              {rating}
            </span>
          )}
        </div>
      </div>
      {timeLeft && (
        <div
          className={cn(
            'flex min-w-32 items-center justify-between gap-1 rounded px-2 py-1 text-right font-mono text-lg',
            color === turn ? 'bg-foreground text-foreground-50' : 'bg-default-100 text-foreground',
          )}
        >
          {color === turn && <Icon icon="material-symbols:timer-outline-rounded" />}
          <span className="ml-auto">{timeLeft}</span>
        </div>
      ) }
    </div>
  );
}
