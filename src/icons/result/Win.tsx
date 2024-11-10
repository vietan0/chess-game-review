import type { SVGProps } from 'react';

export default function Win(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-label="Win"
      role="img"
      viewBox="-10 0 1034 1024"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M824 208q29 29 29 70v484q0 40-29 70-30 30-70 30H270q-40 0-70-30-29-30-29-70V278q0-40 29-69 30-30 70-30h484q41 0 70 29zM316 569q4 4 9 4h134v134q0 5 4 9t10 4h78q6 0 10-4t4-9V573h134q5 0 9-4t4-10v-77q0-7-4-11-4-3-9-3H565V334q0-6-4-9-4-4-10-4h-78q-6 0-10 4-4 3-4 9v134H325q-5 0-9 3-4 4-4 11v77q0 6 4 10z"
        fill="#81b64c"
      />
    </svg>
  );
}
