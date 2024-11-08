import { useEffect, useMemo, useState } from 'react';

import { useBoardStore } from '../../stores/useBoardStore';
import { useEvalStore } from '../../stores/useEvalStore';
import { useManualHighlightStore } from '../../stores/useManualHighlightStore';
import { useStageStore } from '../../stores/useStageStore';
import getArrow from '../../utils/getArrow';
import Arrow from './Arrow';

import type { Square } from 'chess.js';

type Ordinal = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface Pos {
  x: number | null;
  y: number | null;
}

export default function Arrows() {
  const currentMoveNum = useBoardStore(state => state.currentMoveNum);
  const isFlipped = useBoardStore(state => state.isFlipped);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState<Pos>({ x: null, y: null });
  const [dragEndPos, setDragEndPos] = useState<Pos>({ x: null, y: null });
  const [arrows, setArrows] = useState<string[]>([]);
  const toggleHighlight = useManualHighlightStore(state => state.toggleHighlight);
  const resetHighlight = useManualHighlightStore(state => state.resetHighlight);
  // bestMove arrow
  const reviewFinished = useStageStore(state => state.computed.reviewFinished);
  const best3MovesWithClass = useEvalStore(state => state.best3MovesWithClass);

  const bestMoveArrow = useMemo(() => {
    if (!reviewFinished) {
      return null;
    }

    if (currentMoveNum === 0) {
      return null;
    }

    const bestMove = best3MovesWithClass[currentMoveNum - 1][0];

    return bestMove.pv;
  }, [reviewFinished, currentMoveNum, best3MovesWithClass]);

  useEffect(() => {
    if (dragStartPos.x !== null && dragStartPos.y !== null && dragEndPos.x !== null && dragEndPos.y !== null) {
      const from = getSquare(ordinalSquare(dragStartPos.x), ordinalSquare(dragStartPos.y), isFlipped);
      const to = getSquare(ordinalSquare(dragEndPos.x), ordinalSquare(dragEndPos.y), isFlipped);

      if (from === to) {
        toggleHighlight(from);
      }

      if (from !== to && getArrow(from, to)) {
        const arrow = `${from}${to}`;

        setArrows((prev) => {
          if (prev.includes(arrow)) {
            return prev.filter(a => a !== arrow);
          }
          else {
            return [...prev, arrow];
          }
        });
      }
    }
  }, [dragStartPos, dragEndPos]);

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

  function handleClick() {
    setDragStartPos({ x: null, y: null });
    setDragEndPos({ x: null, y: null });
    setArrows([]);
    resetHighlight();
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
        x: e.pageX - rect.x - window.scrollX,
        y: e.pageY - rect.y - window.scrollY,
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
          x: e.pageX - rect.x - window.scrollX,
          y: e.pageY - rect.y - window.scrollY,
        });
      }
    }
  }

  return (
    <svg
      className="absolute"
      height={600}
      id="arrows"
      onClick={handleClick}
      onContextMenu={handleRClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      transform={`rotate(${isFlipped ? 180 : 0})`}
      width={600}
    >
      {arrows.map(a => (
        <Arrow
          from={a.substring(0, 2) as Square}
          key={a}
          to={a.substring(2, 4) as Square}
        />
      ))}
      {bestMoveArrow
      && (
        <Arrow
          color="green"
          from={bestMoveArrow.substring(0, 2) as Square}
          to={bestMoveArrow.substring(2, 4) as Square}
        />
      )}
    </svg>
  );
}
