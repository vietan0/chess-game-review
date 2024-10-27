import Best from './Best';
import Blunder from './Blunder';
import Book from './Book';
import Excellent from './Excellent';
import Forced from './Forced';
import Good from './Good';
import Inaccuracy from './Inaccuracy';
import Mistake from './Mistake';

import type { Classification } from '../../utils/classify';
import type { SVGProps } from 'react';

interface MoveClassificationProps extends SVGProps<SVGSVGElement> {
  classification: Classification;
}

export default function MoveClassification({ classification, ...props }: MoveClassificationProps) {
  switch (classification) {
    case 'best':
      return <Best {...props} />;
    case 'excellent':
      return <Excellent {...props} />;
    case 'good':
      return <Good {...props} />;
    case 'inaccuracy':
      return <Inaccuracy {...props} />;
    case 'mistake':
      return <Mistake {...props} />;
    case 'blunder':
      return <Blunder {...props} />;
    case 'forced':
      return <Forced {...props} />;
    case 'book':
      return <Book {...props} />;
    default:
      return null;
  }
}
