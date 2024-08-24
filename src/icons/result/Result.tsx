import Draw from './Draw';
import Lose from './Lose';
import Win from './Win';

import type { SVGProps } from 'react';

interface ResultProps extends SVGProps<SVGSVGElement> {
  result: 'win' | 'lose' | 'draw';
}

export default function Result({ result, ...props }: ResultProps) {
  if (result === 'win')
    return <Win {...props} />;
  if (result === 'lose')
    return <Lose {...props} />;

  return <Draw {...props} />;
}
