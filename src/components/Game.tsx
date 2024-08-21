import { Card, CardBody } from '@nextui-org/card';

import { useSelectGameStore } from '../useSelectGameStore';
import formatTimeControl from '../utils/formatTimeControl';
import getIconPath from '../utils/getIconPath';

import type { ChessComGame } from '../queries/useMonthlyArchives';

export default function Game({ game }: { game: ChessComGame }) {
  const username = useSelectGameStore(state => state.username)!;

  function getResult() {
    // if daily game, winner's result is still 'timeout', so use pgn to determine
    const userColor = username.toLowerCase() === game.white.username.toLowerCase() ? 'w' : 'b';

    if (game.pgn.endsWith('1-0\n'))
      return userColor === 'w' ? 'win' : 'lose';
    else if (game.pgn.endsWith('0-1\n'))
      return userColor === 'w' ? 'lose' : 'win';
    else return 'draw';
  }

  const result = getResult();

  return (
    <Card
      classNames={{
        base: 'text-sm outline outline-1 outline-default-100',
        body: 'flex-row gap-3 items-center pl-2 pr-4 py-3',
      }}
      disableAnimation
      fullWidth
      isHoverable
      isPressable
      radius="none"
      shadow="none"
    >
      <CardBody>
        <div className="flex w-10 min-w-10 flex-col items-center gap-1" id="time-control">
          <img
            alt=""
            className="size-5"
            src={getIconPath(game.time_class, 'time-controls', 'svg')}
          />
          <span className="text-nowrap text-xs text-foreground-500">
            {formatTimeControl(game.time_control)}
          </span>
        </div>
        <div className="flex flex-col gap-0.5" id="players-info">
          <div className="flex items-center gap-2">
            <span className="max-w-40 overflow-hidden truncate">{game.white.username}</span>
            <span className="text-xs font-bold leading-4 text-foreground-500">
              {game.white.rating}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="max-w-40 overflow-hidden truncate">{game.black.username}</span>
            <span className="text-xs font-bold leading-4 text-foreground-500">
              {game.black.rating}
            </span>
          </div>
        </div>
        <img alt="" className="ml-auto size-5" src={getIconPath(result, 'game-result', 'svg')} />
      </CardBody>
    </Card>
  );
}
