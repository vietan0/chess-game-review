import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';

import formatTimeControl from '../utils/formatTimeControl';
import getIconPath from '../utils/getIconPath';

import type { ChessComGame } from '../queries/useMonthlyArchives';

export default function Game({ game }: { game: ChessComGame }) {
  return (
    <Card classNames={{
      base: 'text-sm mb-1',
    }}
    >
      <CardHeader className="flex gap-2">
        <div className="flex flex-col items-center gap-1">
          <img
            alt=""
            className="size-5"
            src={getIconPath(game.time_class, 'time-controls', 'svg')}
          />
          <span className="text-xs text-foreground-500">
            {formatTimeControl(game.time_control)}
          </span>
        </div>
        {' '}
        {game.white.username}
        {' '}
        <span className="text-xs font-bold text-foreground-500">
          {game.white.rating}
        </span>
        -
        {' '}
        {game.black.username}
        {' '}
        <span className="text-xs font-bold text-foreground-500">
          {game.black.rating}
        </span>
      </CardHeader>
      <CardBody>
      </CardBody>
      <CardFooter>
      </CardFooter>
    </Card>
  );
}
