import type { SVGProps } from 'react';

export default function CheckmateWhite(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 19" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M9 .5a9 9 0 1 0 9 9 9 9 0 0 0-9-9Z"
        opacity={0.3}
      />
      <circle cx={9} cy={9} fill="#f8f8f8" r={8.5} />
      <path
        d="M9 1a8 8 0 1 1-8 8 8 8 0 0 1 8-8m0-1a9 9 0 1 0 9 9 9 9 0 0 0-9-9Z"
        fill="#e8e8e8"
      />
      <path d="M11.44 8.11h1.74l.1-1.55h-1.74l.18-2.78h-1.55L10 6.56H8.31l.18-2.78H6.94l-.18 2.78H5l-.1 1.55h1.76l-.11 1.68H4.82l-.1 1.55h1.74l-.18 2.78h1.55L8 11.34h1.69l-.18 2.78h1.55l.18-2.78H13l.1-1.55h-1.76ZM8.11 9.79l.1-1.68h1.68l-.1 1.68Z" />
    </svg>
  );
}
