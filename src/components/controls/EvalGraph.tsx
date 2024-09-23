/* eslint-disable unused-imports/no-unused-vars */
import { curveMonotoneX } from '@visx/curve';
import { localPoint } from '@visx/event';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { scaleLinear, scaleThreshold } from '@visx/scale';
import { AreaClosed, Bar, Line } from '@visx/shape';
import { TooltipWithBounds, defaultStyles, withTooltip } from '@visx/tooltip';
import { bisector } from '@visx/vendor/d3-array';
import { useCallback, useMemo } from 'react';

import { useBoardStore } from '../../stores/useBoardStore';
import { useEvalStore } from '../../stores/useEvalStore';

import type { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';

const cps = [
  25,
  12,
  28,
  38,
  37,
  9,
  51,
  20,
  165,
  86,
  301,
  138,
  286,
  33,
  34,
  -89,
  -41,
  -49,
  -26,
  -42,
  -16,
  -164,
  -87,
  -281,
  -94,
  -98,
  -71,
  -76,
  -85,
  -411,
  -401,
  -560,
  -475,
  -489,
  -344,
  -337,
  -161,
  -230,
  -257,
  -314,
  -279,
  -844,
  -886,
  '-M2',
  '-M1',
  '-M1',
];

function cpToAdv(cp: string | number) {
  if (typeof cp === 'string') {
    // mate in y
    return cp;
  }

  return (cp / 100).toFixed(1);
}

interface TooltipData {
  val: string | number;
  i: number;
}

interface AreaProps {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

const EvalGraphNotResponsive = withTooltip<AreaProps, TooltipData>(
  ({
    width,
    margin = { top: 0, right: 0, bottom: 0, left: 0 },
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
  }: AreaProps & WithTooltipProvidedProps<TooltipData>) => {
    const cps = useEvalStore(state => state.computed.cps); // turn this on when put in Review page
    const cpObj = cps.map((val, i) => ({ val, i }));
    const advs = useEvalStore(state => state.computed.advs);
    const currentMoveNum = useBoardStore(state => state.currentMoveNum);
    const toMove = useBoardStore(state => state.toMove);
    const graphH = 80;

    const getNumericValue = (item: { val: string | number; i: number }) => {
      if (typeof item.val === 'number') {
        return item.val;
      }

      else if (item.val.startsWith('-')) {
        return -2000;
      }
      else {
        return 2000;
      }
    };

    const getIndex = (item: { val: string | number; i: number }) => {
      return item.i;
    };

    const xScale = useMemo(() =>
      scaleLinear({
        domain: [0, cpObj.length - 1],
        range: [0, width],
      }), [width]);

    const yLinear = scaleLinear({
      domain: [-570, 570], // cp
      range: [graphH, 0], // px
    });

    const yThreshold = scaleThreshold<number, number>({
      domain: [-1999, -499, 499, 1999], // cp
      range: [graphH, graphH - 5, graphH / 2, 5, 0], // px
    });

    const yScale = scaleLinear<number>().interpolate((_a: number, _b: number) => {
      return cp => Math.abs(cp) >= 500 ? yThreshold(cp) : yLinear(cp);
    });

    const bisectIndex = bisector<TooltipData, number>(d => d.i).left;

    function handleClick() {
      toMove(tooltipData!.i);
    }

    const handleTooltip = useCallback((event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
      const { x } = localPoint(event) || { x: 0 };
      const x0 = xScale.invert(x);
      const index = bisectIndex(cpObj, x0, 1);
      const d0 = cpObj[index - 1];
      const d1 = cpObj[index];
      let d = d0;

      if (d1 && getIndex(d1)) {
        d = x0.valueOf() - getIndex(d0).valueOf() > getIndex(d1).valueOf() - x0.valueOf()
          ? d1
          : d0;
      }

      showTooltip({
        tooltipData: d,
        tooltipLeft: x,
        tooltipTop: yScale(getNumericValue(d)),
      });
    }, [showTooltip, xScale, yScale]);

    return (
      <>
        <svg
          className="overflow-hidden rounded-md"
          height={graphH}
          width="100%"
        >
          <rect
            fill="white"
            height={graphH}
            width={width}
            x={0}
            y={0}
          />
          <AreaClosed<{ val: string | number; i: number }>
            className="fill-default-100"
            curve={curveMonotoneX}
            data={cpObj}
            id="area"
            x={d => xScale(getIndex(d))}
            y={d => yScale(getNumericValue(d))}
            yScale={yScale}
          />
          <line className="stroke-default-500/50" id="x-axis" strokeWidth={2} x1="0" x2={width} y1="40" y2="40" />
          <Bar
            className="cursor-pointer"
            fill="transparent"
            height={graphH}
            onClick={handleClick}
            onMouseLeave={() => hideTooltip()}
            onMouseMove={handleTooltip}
            onTouchMove={handleTooltip}
            onTouchStart={handleTooltip}
            rx={14}
            width={width}
            x={margin.left}
            y={margin.top}
          />
          <Line
            className="stroke-danger-500"
            from={{ x: xScale(currentMoveNum), y: margin.top }}
            pointerEvents="none"
            strokeWidth={3}
            to={{ x: xScale(currentMoveNum), y: graphH + margin.top }}
          />
          {tooltipData && (
            <g>
              <Line
                className="stroke-primary-500/50"
                from={{ x: tooltipLeft, y: margin.top }}
                pointerEvents="none"
                strokeWidth={2}
                to={{ x: tooltipLeft, y: graphH + margin.top }}
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop + 1}
                fill="black"
                fillOpacity={0.1}
                pointerEvents="none"
                r={4}
                stroke="black"
                strokeOpacity={0.1}
                strokeWidth={2}
              />
              <circle
                className="fill-primary-500"
                cx={tooltipLeft}
                cy={tooltipTop}
                pointerEvents="none"
                r={4}
                stroke="white"
                strokeWidth={2}
              />
            </g>
          )}
        </svg>
        {tooltipData
        && (
          <TooltipWithBounds
            key={Math.random()}
            left={tooltipLeft}
            style={{
              ...defaultStyles,
              fontSize: '0.75rem',
              lineHeight: '1rem',
              padding: '0.25rem 0.4rem',
              outline: '1px solid #71717a', // default-400
              color: '#3f3f46', // default-200
              backgroundColor: 'hsla(255, 100%, 100%, 90%)',
            }}
            top={tooltipTop}
          >
            {advs[getIndex(tooltipData)]}
          </TooltipWithBounds>
        )}
      </>
    );
  },
);

export default function EvalGraph() {
  return (
    <ParentSize style={{ width: 'auto', height: 'auto' }}>
      {({ width, height }) => <EvalGraphNotResponsive height={height} width={width} />}
    </ParentSize>
  );
}
