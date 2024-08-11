import { Icon } from '@iconify/react/dist/iconify.js';

import { useStore } from './store';
import cn from './utils/cn';

import type { Color } from 'chess.js';

export default function PlayerBadge({ color }: { color: Color }) {
  const currentGame = useStore(state => state.currentGame);
  const header = currentGame.header();
  const name = color === 'w' ? header.White || 'White' : header.Black || 'Black';
  const rating = color === 'w' ? header.WhiteElo : header.BlackElo;
  const title = color === 'w' ? header.WhiteTitle : header.BlackTitle;

  return (
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
  );
}
