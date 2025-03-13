import Blitz from './Blitz';
import Bot from './Bot';
import Bullet from './Bullet';
import Daily from './Daily';
import Rapid from './Rapid';

import type { SVGProps } from 'react';

export type TimeClassType = 'bullet' | 'blitz' | 'rapid' | 'daily' | 'bot';

interface TimeClassProps extends SVGProps<SVGSVGElement> {
  timeClass: TimeClassType;
}

export default function TimeClass({ timeClass, ...props }: TimeClassProps) {
  if (timeClass === 'bullet') {
    return <Bullet {...props} />;
  }

  if (timeClass === 'blitz') {
    return <Blitz {...props} />;
  }

  if (timeClass === 'rapid') {
    return <Rapid {...props} />;
  }

  if (timeClass === 'daily') {
    return <Daily {...props} />;
  }

  return <Bot {...props} />;
}
