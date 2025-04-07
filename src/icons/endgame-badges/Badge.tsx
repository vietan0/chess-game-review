import Abandoned from './Abandoned';
import CheckmateBlack from './CheckmateBlack';
import CheckmateWhite from './CheckmateWhite';
import DrawBlack from './DrawBlack';
import DrawWhite from './DrawWhite';
import ResignBlack from './ResignBlack';
import ResignWhite from './ResignWhite';
import TimeoutBlack from './TimeoutBlack';
import TimeoutWhite from './TimeoutWhite';
import Winner from './Winner';

import type { BadgeType } from '../../utils/endgameBadges';
import type { SVGProps } from 'react';

interface BadgeProps extends SVGProps<SVGSVGElement> {
  badge: BadgeType;
}

export default function Badge({ badge, ...props }: BadgeProps) {
  switch (badge) {
    case 'abandoned':
      return <Abandoned {...props} />;
    case 'checkmate-black':
      return <CheckmateBlack {...props} />;
    case 'checkmate-white':
      return <CheckmateWhite {...props} />;
    case 'draw-black':
      return <DrawBlack {...props} />;
    case 'draw-white':
      return <DrawWhite {...props} />;
    case 'resign-black':
      return <ResignBlack {...props} />;
    case 'resign-white':
      return <ResignWhite {...props} />;
    case 'timeout-black':
      return <TimeoutBlack {...props} />;
    case 'timeout-white':
      return <TimeoutWhite {...props} />;
    case 'winner':
      return <Winner {...props} />;
    default:
      return null;
  }
}
