import type { SVGProps } from 'react';

export default function CheckmateBlack(props: SVGProps<SVGSVGElement>) {
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
      <path d="M11.44 8.41h1.74l.1-1.55h-1.74l.18-2.78h-1.55L10 6.86H8.31l.18-2.78H6.94l-.18 2.78H5l-.1 1.55h1.76l-.11 1.68H4.82l-.1 1.55h1.74l-.18 2.78h1.55L8 11.64h1.69l-.18 2.78h1.55l.18-2.78H13l.1-1.55h-1.76Zm-3.33 1.68.1-1.68h1.68l-.1 1.68Z" />
      <path
        d="M11.44 7.91h1.74l.1-1.55h-1.74l.18-2.78h-1.55L10 6.36H8.31l.18-2.78H6.94l-.18 2.78H5l-.1 1.55h1.76l-.11 1.68H4.82l-.1 1.55h1.74l-.18 2.78h1.55L8 11.14h1.69l-.18 2.78h1.55l.18-2.78H13l.1-1.55h-1.76ZM8.11 9.59l.1-1.68h1.68l-.1 1.68Z"
        fill="#fff"
      />
    </svg>
  );
}
