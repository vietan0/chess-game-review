import type { SVGProps } from 'react';

export default function Pgn(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      height={32}
      viewBox="0 0 24 24"
      width={32}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M21 2H3a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1m-1 6h-4v4h4v4h-4v4h-4v-4H8v4H4v-4h4v-4H4V8h4V4h4v4h4V4h4z"
        fill="#888"
      />
      <path d="M8 8h4v4H8zm4 4h4v4h-4z" fill="#888" />
    </svg>
  );
}
