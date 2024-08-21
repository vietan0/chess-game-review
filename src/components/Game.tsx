import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';

import type { ChessComGame } from '../queries/useMonthlyArchives';

export default function Game({ game }: { game: ChessComGame }) {
  return (
    <Card classNames={{
      base: 'text-sm',
    }}
    >
      <CardHeader className="flex gap-1">
        {game.time_class}
        {' '}
        -
        {' '}
        {game.white.username}
        {' '}
        <span className="text-xs font-bold text-foreground-500">
          {game.white.rating}
        </span>
        vs.
        {' '}
        {game.black.username}
        {' '}
        <span className="text-xs font-bold text-foreground-500">
          {game.black.rating}
        </span>
        <span className="ml-auto">
          {game.time_control}
        </span>
      </CardHeader>
      <CardBody>
      </CardBody>
      <CardFooter>
      </CardFooter>
    </Card>
  );
}
