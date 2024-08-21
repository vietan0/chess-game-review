import { Icon } from '@iconify/react/dist/iconify.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useMemo } from 'react';

import { useBoardStore } from '../useBoardStore';
import cn from '../utils/cn';
import { mainTimeRegex } from '../utils/formatTimeControl';
import formatTimestamp from '../utils/formatTimestamp';
import getCaptured from '../utils/getCaptured';
import getDiff from '../utils/getDiff';
import useLoser from '../utils/useLoser';
import CapturedGroup from './CapturedGroup';

import type { Capturable } from '../utils/getCaptured';
import type { Chess, Color } from 'chess.js';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export default function PlayerBadge({ displayedGame, color }: {
  displayedGame: Chess;
  color: Color;
}) {
  const board = displayedGame.board();
  const currentGame = useBoardStore(state => state.currentGame);
  const currentMoveNum = useBoardStore(state => state.currentMoveNum);
  const timestamps = useBoardStore(state => state.timestamps);
  const history = currentGame.history({ verbose: true });
  const header = currentGame.header();

  const timeControl = useMemo(() => {
    if (!header.TimeControl)
      return null;
    const mainTimeMatches = header.TimeControl.match(mainTimeRegex);
    if (!mainTimeMatches)
      return null;

    const seconds = Number(mainTimeMatches[0]);
    const inPgnFormat = dayjs.duration(seconds, 's').format('H:mm:ss');

    return inPgnFormat;
  }, [header]);

  const name = useMemo(() => {
    if (color === 'w') {
      if (header.White && header.White !== '?')
        return header.White;

      return 'White';
    }

    if (header.Black && header.Black !== '?')
      return header.Black;

    return 'Black';
  }, [color, header]);

  const rating = color === 'w' ? header.WhiteElo : header.BlackElo;
  const title = color === 'w' ? header.WhiteTitle : header.BlackTitle;
  const turn = currentMoveNum === 0 ? null : currentMoveNum % 2 === 1 ? 'w' : 'b';
  const { loser, loseBy } = useLoser();

  const timeLeft = useMemo(() => {
    const oneSideTimestamps = timestamps
      ? color === 'w'
        ? timestamps.filter((_, i) => i % 2 === 0)
        : timestamps.filter((_, i) => i % 2 === 1)
      : null;

    // 1. if game is correspondant, display fixed incrementt
    if (header.TimeControl) {
      const incrementAfterSlashRegex = /(?<=\/)\d+$/;
      const incrementAfterSlash = header.TimeControl.match(incrementAfterSlashRegex);

      if (incrementAfterSlash) {
        // game is correspondant
        const increment = Number(incrementAfterSlash[0]);
        const humanized = dayjs.duration(increment, 'seconds').humanize();

        return humanized;
      }
    }

    // 2. no timestamps in PGN
    if (!oneSideTimestamps) {
      return null;
    }

    // 3. display timestamps normally
    else {
      // first move, display time control
      if (currentMoveNum === 0) {
        return timeControl ? formatTimestamp(timeControl) : null;
      }

      // final move, override with 0:00 if timeout
      if (
        currentMoveNum === history.length
        && loser === color
        && loseBy === 'timeout'
      ) {
        return '0:00';
      }

      if (color === 'w') {
        if (turn === 'w') {
        // currentMoveNum: 1 3 5 7 9
          return formatTimestamp(oneSideTimestamps[(currentMoveNum - 1) / 2]);
        }
        else {
        // currentMoveNum: 2 4 6 8 10
          return formatTimestamp(oneSideTimestamps[(currentMoveNum - 2) / 2]);
        }
      }
      else {
      // black
        if (turn === 'b') {
        // currentMoveNum: 2 4 6 8 10
          return formatTimestamp(oneSideTimestamps[(currentMoveNum - 2) / 2]);
        }
        else {
        // currentMoveNum: 1 3 5 7 9
          if (currentMoveNum === 1) {
            return timeControl ? formatTimestamp(timeControl) : null;
          }

          return formatTimestamp(oneSideTimestamps[(currentMoveNum - 3) / 2]);
        }
      }
    }
  }, [currentMoveNum, color, timeControl, header, loser, loseBy]);

  const captured = getCaptured(history, currentMoveNum, color);
  const diff = getDiff(board, color);

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-start gap-2">
        <Icon
          className={cn('text-[40px]', color === 'b' && 'bg-default-100 text-background')}
          icon="material-symbols:person"
        />
        <div>
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
          <div className="flex min-h-5 leading-none" id="captured-pieces">
            {Object.entries(captured).map(([piece, number]) => (
              <CapturedGroup
                color={color === 'w' ? 'b' : 'w'}
                key={piece}
                number={number}
                piece={piece as Capturable}
              />
            ))}
            {diff > 0 && <span className="ml-1 text-sm text-foreground-500">{`+${diff}`}</span>}
          </div>
        </div>
      </div>
      {timeLeft && (
        <div
          className={cn(
            'flex min-w-32 items-center justify-between gap-1 rounded px-2 py-1 text-right font-mono text-lg',
            color === 'w' ? 'bg-foreground text-foreground-50' : 'bg-default-100 text-foreground',
            color !== turn ? 'opacity-100' : 'opacity-40',
          )}
        >
          {color !== turn && <Icon icon="material-symbols:timer-outline-rounded" />}
          <span className="ml-auto">{timeLeft}</span>
        </div>
      )}
    </div>
  );
}
