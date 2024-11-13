import { nanoid } from 'nanoid';

import type { Capturable } from '../../utils/getCaptured';
import type { Color } from 'chess.js';

export default function CapturedGroup({ color, number, piece }: {
  color: Color;
  number: number;
  piece: Capturable;
}) {
  return (
    <div id={`captured-${color}${piece}`}>
      {Array.from({ length: number }).map((_, i) => (
        <img
          alt=""
          className="inline-block size-[18px] object-cover"
          key={nanoid()}
          src={`./pieces/neo/${color}${piece}.png`}
          style={{
            marginLeft: i === 0 ? '-2px' : '-11px',
          }}
        />
      ))}
    </div>
  );
}
