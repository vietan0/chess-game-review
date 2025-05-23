import type { SVGProps } from 'react';

export default function Bullet(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-label="Bullet"
      role="img"
      viewBox="-10 0 1034 1024"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M390 549 90 904l26 26 328-328-54-53zm-52-62-26-80-156 212 11 37 171-169zm587-367q-23-5-49-7.5t-53-2.5q-54 0-105 11-51 10-98 29.5T531 198t-78 63l-90 91q-14 14-7 41t25.5 59 43.5 64q26 31 49 55 15 15 31.5 29t34.5 27l1 1 154-176 29 29-366 427 22 20 248-248q22 9 39 10.5t27-8.5l91-90q34-36 62-78 28-43 47.5-90t29.5-98 10-105q0-27-2.5-53t-7.5-51l1 3zM512 395q-8-16-19.5-27.5T483 341q63-62 114-96 52-35 95.5-52.5T773 170t71-9q-49 21-94 47-45 25-86.5 54T584 325q-37 33-71 69z"
        fill="#e3aa24"
      />
    </svg>
  );
}

;
