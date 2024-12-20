import type { SVGProps } from 'react';

export default function Book(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-label="Book"
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
        fill="#D5A47D"
      />
      <path
        d="M8.45 5.9c-1-.75-2.51-1.09-4.83-1.09H2.54v8.71h1.08a8.16 8.16 0 0 1 4.83 1.17ZM9.54 14.69a8.14 8.14 0 0 1 4.84-1.17h1.08V4.81h-1.08c-2.31 0-3.81.34-4.84 1.09Z"
        opacity={0.3}
      />
      <path
        d="M8.45 5.4c-1-.75-2.51-1.09-4.83-1.09H3V13h.58a8.09 8.09 0 0 1 4.83 1.17ZM9.54 14.19A8.14 8.14 0 0 1 14.38 13H15V4.31h-.58c-2.31 0-3.81.34-4.84 1.09Z"
        fill="#fff"
      />
    </svg>
  );
}
