import { useBoardStore } from '../../stores/useBoardStore';
import getArrow from '../../utils/getArrow';
import tableToPoints from '../../utils/tableToPoints';

import type { Square } from 'chess.js';

export default function Arrow({ from, to }: { from: Square; to: Square }) {
  const isFlipped = useBoardStore(state => state.isFlipped);
  const arrow = getArrow(from, to);
  if (!arrow)
    return null;

  function offset(from: Square) {
    const [file, rank] = from;
    let x = 0;
    let y = 0;

    switch (file) {
      case 'a':
        x = 0;
        break;
      case 'b':
        x = 75;
        break;
      case 'c':
        x = 150;
        break;
      case 'd':
        x = 225;
        break;
      case 'e':
        x = 300;
        break;
      case 'f':
        x = 375;
        break;
      case 'g':
        x = 450;
        break;
      case 'h':
        x = 525;
        break;
      default:
        break;
    }

    switch (rank) {
      case '1':
        y = 525;
        break;
      case '2':
        y = 450;
        break;
      case '3':
        y = 375;
        break;
      case '4':
        y = 300;
        break;
      case '5':
        y = 225;
        break;
      case '6':
        y = 150;
        break;
      case '7':
        y = 75;
        break;
      case '8':
        y = 0;
        break;
      default:
        break;
    }

    return [x, y];
  }

  if (arrow.shape === 'horizontal' || arrow.shape === 'vertical') {
    let d = 0;
    let b = 0;
    const q = 9;
    let l = 0;
    let baseX = 0;
    let baseY = 0;
    let table: number[][] = [];

    if (arrow.shape === 'horizontal') {
      d = (arrow.distance - 1) * 75;
      b = arrow.direction === 'right' ? d + 25 : -d - 25;
      l = arrow.direction === 'right' ? b + 2.5 * q : b - 2.5 * q;
      baseX = arrow.direction === 'right' ? 65 : 10;
      baseY = ((75 - 4 * q) / 2) + 10;

      table = [
        [0, 0],
        [b, 0],
        [b, -q],
        [0 + l, q],
        [b, 3 * q],
        [b, 2 * q],
        [0, 2 * q],
      ];
    }
    else {
      d = (arrow.distance - 1) * 75;
      b = arrow.direction === 'down' ? d + 25 : -d - 25;
      l = arrow.direction === 'down' ? b + 2.5 * q : b - 2.5 * q;
      baseX = (75 - 4 * q) / 2 + 3 * q;
      baseY = arrow.direction === 'down' ? 65 : 10;

      table = [
        [0, 0],
        [0, b],
        [q, b],
        [-q, l],
        [-3 * q, b],
        [-2 * q, b],
        [-2 * q, 0],
      ];
    }

    const points = tableToPoints(table);
    const [offsetX, offsetY] = offset(from);
    const transX = baseX + offsetX;
    const transY = baseY + offsetY;
    const translate = `translate(${transX}, ${transY})`;

    const flipOrigin = {
      x: -transX + 300,
      y: -transY + 300,
    }; // center of board relative to starting point

    const rotate = `rotate(${isFlipped ? 180 : 0}, ${flipOrigin.x}, ${flipOrigin.y})`;

    return (
      <polygon
        fill="rgba(255, 170, 0, 0.8)"
        opacity="0.8"
        points={points}
        transform={`${translate} ${rotate}`}
      />
    );
  }
}
