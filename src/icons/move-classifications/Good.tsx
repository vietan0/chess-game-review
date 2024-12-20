import type { SVGProps } from 'react';

export default function Good(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-label="Good"
      height={24}
      role="img"
      viewBox="0 0 18 19"
      width={24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9 .5a9 9 0 1 0 9 9 9 9 0 0 0-9-9Z"
        opacity={0.3}
      />
      <path
        d="M9 0a9 9 0 1 0 9 9 9 9 0 0 0-9-9Z"
        fill="#95b776"
      />
      <path
        d="m15.11 6.81-5.66 5.66-1.66 1.66a.39.39 0 0 1-.28.11.39.39 0 0 1-.27-.11L2.89 9.78a.39.39 0 0 1-.11-.28.39.39 0 0 1 .11-.27l1.39-1.38a.34.34 0 0 1 .12-.09h.15a.37.37 0 0 1 .15 0 .38.38 0 0 1 .13.09l2.69 2.68 5.65-5.65a.38.38 0 0 1 .13-.09.37.37 0 0 1 .15 0 .4.4 0 0 1 .15 0 .34.34 0 0 1 .12.09l1.39 1.38a.41.41 0 0 1 .08.13.33.33 0 0 1 0 .15.4.4 0 0 1 0 .15.5.5 0 0 1-.08.12Z"
        opacity={0.2}
      />
      <path
        d="M15.11 6.31 9.45 12l-1.66 1.63a.39.39 0 0 1-.28.11.39.39 0 0 1-.27-.11L2.89 9.28A.39.39 0 0 1 2.78 9a.39.39 0 0 1 .11-.27l1.39-1.38a.34.34 0 0 1 .12-.09h.15a.37.37 0 0 1 .15 0 .38.38 0 0 1 .13.09L7.52 10l5.65-5.65a.38.38 0 0 1 .13-.09.37.37 0 0 1 .15 0 .4.4 0 0 1 .15 0 .34.34 0 0 1 .12.09l1.39 1.38a.41.41 0 0 1 .08.13.33.33 0 0 1 0 .15.4.4 0 0 1 0 .15.5.5 0 0 1-.08.15Z"
        fill="#fff"
      />
    </svg>
  );
}
