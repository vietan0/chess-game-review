import type { SVGProps } from 'react';

export default function TimeoutBlack(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 19" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M9 .5a9 9 0 1 0 9 9 9 9 0 0 0-9-9Z"
        opacity={0.3}
      />
      <path
        d="M9 0a9 9 0 1 0 9 9 9 9 0 0 0-9-9Z"
        fill="#312e2b"
      />
      <path d="M8.57 7.26 8.11 10l.89.86.89-.86-.44-2.74Zm.43 5.6a3.35 3.35 0 1 1 3.36-3.36A3.34 3.34 0 0 1 9 12.86Zm.7-8.29v-.45h.82V2.79h-3v1.33h.78v.45a5 5 0 1 0 1.4 0Z" />
      <path
        d="m8.57 6.76-.46 2.72.89.86.89-.86-.44-2.72Zm.43 5.6A3.35 3.35 0 1 1 12.36 9 3.34 3.34 0 0 1 9 12.36Zm.7-8.29v-.45h.82V2.29h-3v1.33h.78v.45a5 5 0 1 0 1.4 0Z"
        fill="#fff"
      />
    </svg>
  );
}
