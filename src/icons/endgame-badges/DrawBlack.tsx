import type { SVGProps } from 'react';

export default function DrawBlack(props: SVGProps<SVGSVGElement>) {
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
      <path d="M2.92 7V5.84c.81 0 1.75-.28 1.8-1.22h1.42v5.5h-1.8V7Zm8.87-2.39L7 13.88H5l4.8-9.26Zm-1.94 9.27c-.08-1.54 1.38-2.19 2.57-2.89.33-.17.78-.4.78-.78a.66.66 0 0 0-.68-.7c-.69 0-.94.58-.92 1.16H10a2.17 2.17 0 0 1 .64-1.79 2.74 2.74 0 0 1 1.91-.62C14.1 8.26 15 8.78 15 10c0 1.82-2.66 2.18-2.66 2.5h2.73v1.38Z" />
      <path
        d="M2.92 6.51V5.34c.81 0 1.75-.28 1.8-1.22h1.42v5.5h-1.8V6.51Zm8.87-2.39L7 13.38H5l4.8-9.26Zm-1.94 9.26c-.08-1.54 1.38-2.19 2.57-2.89.33-.17.78-.4.78-.78a.66.66 0 0 0-.68-.7c-.69 0-.94.58-.92 1.16H10a2.17 2.17 0 0 1 .64-1.79 2.74 2.74 0 0 1 1.91-.62c1.55 0 2.45.52 2.45 1.74 0 1.82-2.66 2.18-2.66 2.5h2.73v1.38Z"
        fill="#fff"
      />
    </svg>
  );
}