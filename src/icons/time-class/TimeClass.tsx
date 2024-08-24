import Blitz from './Blitz';
import Bullet from './Bullet';
import Daily from './Daily';
import Rapid from './Rapid';

import type { SVGProps } from 'react';

interface TimeClassProps extends SVGProps<SVGSVGElement> {
  timeClass: 'bullet' | 'blitz' | 'rapid' | 'daily';
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

  return <Daily {...props} />;
}
