import getArrow from '../../utils/getArrow';
import tableToPoints from '../../utils/tableToPoints';

import type { Square } from 'chess.js';

export default function Arrow({ from, to }: { from: Square; to: Square }) {
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

  // How to draw an arrow polygon from points:
  // https://www.desmos.com/calculator/2asvkl9yyq

  const q = 9;
  let d = 0;
  let b = 0;
  let l = 0;
  const baseX = 65;
  const baseY = ((75 - 4 * q) / 2) + 10;
  let table: number[][] = [];
  let rotate = '';

  if (arrow.shape === 'horizontal' || arrow.shape === 'vertical') {
    d = (arrow.distance - 1) * 75;
    b = d + 25;
    l = b + 2.5 * q;

    rotate = `rotate(${
      arrow.direction === 'right'
      ? 0
      : arrow.direction === 'down'
      ? 90
      : arrow.direction === 'left'
      ? 180
      : 270}, ${-baseX + 37.5}, ${-baseY + 37.5})`;

    table = [
      [0, 0],
      [b, 0],
      [b, -q],
      [l, q],
      [b, 3 * q],
      [b, 2 * q],
      [0, 2 * q],
    ];
  }

  else if (arrow.shape === 'diagonal') {
    d = (arrow.distance - 1) * 75;
    b = (d + 25) * Math.sqrt(2) + 6 * (Math.sqrt(2) - 1) * q;
    l = b + 2.5 * q;

    rotate = `rotate(${
      arrow.direction === 'downright'
      ? 45
      : arrow.direction === 'downleft'
      ? 135
      : arrow.direction === 'upleft'
      ? 225
      : 315}, ${-baseX + 37.5}, ${-baseY + 37.5})`;

    table = [
      [0, 0],
      [b, 0],
      [b, -q],
      [l, q],
      [b, 3 * q],
      [b, 2 * q],
      [0, 2 * q],
    ];
  }

  else {
    // knight shaped
    if (arrow.direction === 'rightdown'
      || arrow.direction === 'downleft'
      || arrow.direction === 'leftup'
      || arrow.direction === 'upright'
    ) {
      table = [
        [0, 0],
        [10 + 112.5 + q, 0],
        [10 + 112.5 + q, 37.5 + 2.5 * q],
        [10 + 112.5 + 2 * q, 37.5 + 2.5 * q],
        [10 + 112.5, 75 + q],
        [10 + 112.5 - 2 * q, 37.5 + 2.5 * q],
        [10 + 112.5 - q, 37.5 + 2.5 * q],
        [10 + 112.5 - q, 2 * q],
        [0, 2 * q],
      ];

      rotate = `rotate(${
        arrow.direction === 'rightdown'
        ? 0
        : arrow.direction === 'downleft'
        ? 90
        : arrow.direction === 'leftup'
        ? 180
        : 270}, ${-baseX + 37.5}, ${-baseY + 37.5})`;
    }
    else {
      table = [
        [0, 0],
        [10 + 112.5 - q, 0],
        [10 + 112.5 - q, -25 - 10 - q],
        [10 + 112.5 - 2 * q, -25 - 10 - q],
        [10 + 112.5, -75 + q],
        [10 + 112.5 + 2 * q, -25 - 10 - q],
        [10 + 112.5 + q, -25 - 10 - q],
        [10 + 112.5 + q, 2 * q],
        [0, 2 * q],
      ];

      rotate = `rotate(${
        arrow.direction === 'rightup'
        ? 0
        : arrow.direction === 'upleft'
        ? -90
        : arrow.direction === 'leftdown'
        ? -180
        : -270}, ${-baseX + 37.5}, ${-baseY + 37.5})`;
    }
  }

  const points = tableToPoints(table);
  const [offsetX, offsetY] = offset(from);
  const transX = baseX + offsetX;
  const transY = baseY + offsetY;
  const translate = `translate(${transX}, ${transY})`;

  return (
    <polygon
      fill="rgba(255, 170, 0, 0.8)"
      opacity="0.8"
      points={points}
      transform={`${translate} ${rotate}`}
    />
  );
}
