/* eslint-disable unused-imports/no-unused-vars */
import { useMemo, useState } from 'react';

import { useBoardStore } from '../../stores/useBoardStore';
import Arrow from './Arrow';

import type { Square } from 'chess.js';

type Ordinal = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface Pos {
  x: number | null;
  y: number | null;
}

export default function Arrows() {
  const isFlipped = useBoardStore(state => state.isFlipped);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState<Pos>({ x: null, y: null });
  const [dragEndPos, setDragEndPos] = useState<Pos>({ x: null, y: null });

  const startSquare = useMemo(() => {
    if (dragStartPos.x === null || dragStartPos.y === null)
      return null;

    return getSquare(ordinalSquare(dragStartPos.x), ordinalSquare(dragStartPos.y), isFlipped);
  }, [dragStartPos]);

  const endSquare = useMemo(() => {
    if (dragEndPos.x === null || dragEndPos.y === null)
      return null;

    return getSquare(ordinalSquare(dragEndPos.x), ordinalSquare(dragEndPos.y), isFlipped);
  }, [dragEndPos]);

  function ordinalSquare(num: number): Ordinal {
    if (num >= 0 && num < 75) {
      return 1;
    }

    if (num >= 75 && num < 150) {
      return 2;
    }

    if (num >= 150 && num < 225) {
      return 3;
    }

    if (num >= 225 && num < 300) {
      return 4;
    }

    if (num >= 300 && num < 375) {
      return 5;
    }

    if (num >= 375 && num < 450) {
      return 6;
    }

    if (num >= 450 && num < 525) {
      return 7;
    }

    return 8;
  }

  function getSquare(ordX: Ordinal, ordY: Ordinal, isFlipped: boolean): Square {
    let rank = '';
    let file = '';

    switch (ordX) {
      case 1:
        file = isFlipped ? 'h' : 'a';
        break;
      case 2:
        file = isFlipped ? 'g' : 'b';
        break;
      case 3:
        file = isFlipped ? 'f' : 'c';
        break;
      case 4:
        file = isFlipped ? 'e' : 'd';
        break;
      case 5:
        file = isFlipped ? 'd' : 'e';
        break;
      case 6:
        file = isFlipped ? 'c' : 'f';
        break;
      case 7:
        file = isFlipped ? 'b' : 'g';
        break;
      case 8:
        file = isFlipped ? 'a' : 'h';
        break;
      default:
        throw new Error('ordX invalid');
    }

    switch (ordY) {
      case 1:
        rank = isFlipped ? '1' : '8';
        break;
      case 2:
        rank = isFlipped ? '2' : '7';
        break;
      case 3:
        rank = isFlipped ? '3' : '6';
        break;
      case 4:
        rank = isFlipped ? '4' : '5';
        break;
      case 5:
        rank = isFlipped ? '5' : '4';
        break;
      case 6:
        rank = isFlipped ? '6' : '3';
        break;
      case 7:
        rank = isFlipped ? '7' : '2';
        break;
      case 8:
        rank = isFlipped ? '8' : '1';
        break;
      default:
        throw new Error('ordX invalid');
    }

    return `${file}${rank}` as Square;
  }

  function centerACoor(num: number) {
    if (num >= 0 && num < 75) {
      return 75 / 2;
    }

    if (num >= 75 && num < 150) {
      return (75 + 150) / 2;
    }

    if (num >= 150 && num < 225) {
      return (150 + 225) / 2;
    }

    if (num >= 225 && num < 300) {
      return (225 + 300) / 2;
    }

    if (num >= 300 && num < 375) {
      return (300 + 375) / 2;
    }

    if (num >= 375 && num < 450) {
      return (375 + 450) / 2;
    }

    if (num >= 450 && num < 525) {
      return (450 + 525) / 2;
    }

    return (525 + 600) / 2;
  }

  function getSquareCenter(square: Square) {
    const [file, rank] = square;
    const center = { x: 0, y: 0 };

    const centers = [
      (0 + 75) / 2,
      (75 + 150) / 2,
      (150 + 225) / 2,
      (225 + 300) / 2,
      (300 + 375) / 2,
      (375 + 450) / 2,
      (450 + 525) / 2,
      (525 + 600) / 2,
    ];

    switch (file) {
      case 'a':
        center.x = centers[0];
        break;
      case 'b':
        center.x = centers[1];
        break;
      case 'c':
        center.x = centers[2];
        break;
      case 'd':
        center.x = centers[3];
        break;
      case 'e':
        center.x = centers[4];
        break;
      case 'f':
        center.x = centers[5];
        break;
      case 'g':
        center.x = centers[6];
        break;
      case 'h':
        center.x = centers[7];
        break;
      default:
        break;
    }

    switch (rank) {
      case '1':
        center.y = centers[7];
        break;
      case '2':
        center.y = centers[6];
        break;
      case '3':
        center.y = centers[5];
        break;
      case '4':
        center.y = centers[4];
        break;
      case '5':
        center.y = centers[3];
        break;
      case '6':
        center.y = centers[2];
        break;
      case '7':
        center.y = centers[1];
        break;
      case '8':
        center.y = centers[0];
        break;
      default:
        break;
    }

    return center;
  }

  function handleClick(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    setDragStartPos({ x: null, y: null });
    setDragEndPos({ x: null, y: null });
  }

  function handleRClick(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    e.preventDefault();
  }

  function handleMouseDown(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    if (e.button === 2) {
      // right click confirmed
      setIsDragging(true);
      const svg = e.currentTarget as SVGElement;
      const rect = svg.getBoundingClientRect();

      setDragStartPos({
        x: e.pageX - rect.x,
        y: e.pageY - rect.y,
      });

      setDragEndPos({ x: null, y: null });
    }
  }

  function handleMouseUp(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    if (e.button === 2) {
      // right click confirmed
      if (isDragging) {
        setIsDragging(false);
        const svg = e.currentTarget as SVGElement;
        const rect = svg.getBoundingClientRect();

        setDragEndPos({
          x: e.pageX - rect.x,
          y: e.pageY - rect.y,
        });
      }
    }
  }

  return (
    <svg
      className="relative z-10"
      height={600}
      id="arrows"
      onClick={handleClick}
      onContextMenu={handleRClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      transform={`rotate(${isFlipped ? 180 : 0})`}
      width={600}
    >
      {startSquare && endSquare && startSquare !== endSquare
      && (
        <>
          <ellipse
            cx={getSquareCenter(startSquare).x}
            cy={getSquareCenter(startSquare).y}
            fill="rgba(255, 170, 0, 0.8)"
            rx="5"
            ry="5"
          />
          <ellipse
            cx={getSquareCenter(endSquare).x}
            cy={getSquareCenter(endSquare).y}
            fill="rgba(255, 170, 0, 0.8)"
            rx="5"
            ry="5"
          />
        </>
      )}
      <Arrow from="h1" to="c1" />
    </svg>
  );
}
