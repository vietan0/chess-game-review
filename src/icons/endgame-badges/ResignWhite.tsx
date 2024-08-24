import type { SVGProps } from 'react';

export default function ResignWhite(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 19" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M9 .5a9 9 0 1 0 9 9 9 9 0 0 0-9-9Z"
        opacity={0.3}
      />
      <circle cx={9} cy={9} fill="#f8f8f8" r={8.5} />
      <path d="M4.94 5.74h-.05a.63.63 0 0 0-.44.77l2.16 8.09a.63.63 0 0 0 .77.45.62.62 0 0 0 .44-.76L5.7 6.18a.62.62 0 0 0-.76-.44ZM12.33 3.88c-2 2.29-3.83-.41-6 1.52a.54.54 0 0 0-.15.25.48.48 0 0 0 0 .29c.22.89.87 3.3 1.12 4.15a.15.15 0 0 0 .26.07c1.92-2.65 4 .27 6.11-1.69a.46.46 0 0 0 .09-.47c-.21-.78-.8-3-1.1-4-.04-.16-.24-.24-.33-.12Z" />
      <path
        d="M9 1a8 8 0 1 1-8 8 8 8 0 0 1 8-8m0-1a9 9 0 1 0 9 9 9 9 0 0 0-9-9Z"
        fill="#e8e8e8"
      />
    </svg>
  );
}
