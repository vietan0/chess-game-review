import { Icon } from '@iconify/react/dist/iconify.js';
import { Chess } from 'chess.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useMemo } from 'react';

import useLoser from '../../hooks/useLoser';
import { useBoardStore } from '../../stores/useBoardStore';
import { useSelectGameStore } from '../../stores/useSelectGameStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import cn from '../../utils/cn';
import { dailyIncrementRegex, mainTimeRegex } from '../../utils/formatTimeControl';
import formatTimestamp from '../../utils/formatTimestamp';
import getCaptured from '../../utils/getCaptured';
import getDiff from '../../utils/getDiff';
import isChessCom from '../../utils/isChessCom';
import useNames from '../../utils/useNames';
import CapturedGroup from './CapturedGroup';

import type { Capturable } from '../../utils/getCaptured';
import type { Color } from 'chess.js';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export default function PlayerBadge({ color }: {
  color: Color;
}) {
  const currentGame = useBoardStore(state => state.currentGame);
  const currentMoveNum = useBoardStore(state => state.currentMoveNum);
  const timestamps = useBoardStore(state => state.timestamps);
  const history = currentGame.history({ verbose: true });
  const header = currentGame.header();
  const displayedGame = new Chess(currentMoveNum > 0 ? history[currentMoveNum - 1].after : undefined);
  const board = displayedGame.board();
  const showRatings = useSettingsStore(state => state.settings.showRatings);

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

  const [wName, bName] = useNames();
  const name = color === 'w' ? wName : bName;
  const rating = color === 'w' ? header.WhiteElo : header.BlackElo;
  const title = color === 'w' ? header.WhiteTitle : header.BlackTitle;
  const turn = currentMoveNum === 0 ? null : currentMoveNum % 2 === 1 ? 'w' : 'b';
  const { loser, loseBy } = useLoser();
  const game = useSelectGameStore(state => state.game);
  const captured = getCaptured(history, currentMoveNum, color);
  const diff = getDiff(board, color);

  const timeLeft = useMemo(() => {
    const oneSideTimestamps = timestamps
      ? color === 'w'
        ? timestamps.filter((_, i) => i % 2 === 0)
        : timestamps.filter((_, i) => i % 2 === 1)
      : null;

    // 1.a. if chess.com game is correspondant, display fixed increment
    if (game && isChessCom(game) && game.time_class === 'daily') {
      if (Object.entries(header).length === 0) {
        return null;
      }

      if (header.Event === 'vs Computer') {
        // if game vs bot, no time control
        return null;
      }

      const incrementAfterSlash = header.TimeControl.match(dailyIncrementRegex)!;
      const increment = Number(incrementAfterSlash[0]);
      const days = dayjs.duration(increment, 'seconds').days();

      return days > 1 ? `${days} days` : `${days} day`;
    }

    // 1.b. if lichess game is correspondant, display fixed increment
    if (game && !isChessCom(game) && game.speed === 'correspondence') {
      const days = game.daysPerTurn!;

      return days > 1 ? `${days} days` : `${days} day`;
    }

    // 1.c. if game from PGN is correspondant, display fixed increment
    else if (header.TimeControl && header.TimeControl.match(dailyIncrementRegex)) {
      // this would only work if the PGN comes from chess.com
      // other than that, there's no way of determining if it's correspondant
      const incrementAfterSlash = header.TimeControl.match(dailyIncrementRegex)!;
      const increment = Number(incrementAfterSlash[0]);
      const days = dayjs.duration(increment, 'seconds').days();

      return days > 1 ? `${days} days` : `${days} day`;
    }

    // 2. no timestamps in PGN
    else if (!oneSideTimestamps) {
      return null;
    }

    // 3. display timestamps normally
    else {
      // first move, display time control
      if (currentMoveNum === 0) {
        return timeControl ? formatTimestamp(timeControl) : null;
      }

      // final move
      if (currentMoveNum === history.length) {
        // override with 0:00 if lose by timeout
        if (loser === color && loseBy === 'timeout')
          return '0:00';

        // override with 0:00 if draw by insufficient vs timeout
        if (header.Result === '1/2-1/2'
          && (header.Termination === 'Game drawn by timeout vs insufficient material' /* chess.com */
          || header.Termination === 'Time forfeit' /* lichess */
          )) {
          if (captured.p === 8
            && captured.n === 2
            && captured.b === 2
            && captured.r === 2
            && captured.q === 1
          ) {
            // this side is the one who timeouts
            return '0:00';
          }
        }
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

  return (
    <div className="flex w-[600px] items-center justify-between gap-2">
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
            {rating && showRatings && (
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
            'flex min-w-32 items-center justify-between gap-1 rounded px-2 py-1 text-right font-mono text-xl',
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
