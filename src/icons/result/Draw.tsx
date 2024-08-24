import type { SVGProps } from 'react';

export default function Draw(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="-10 0 1034 1024" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M824 208q29 29 29 70v484q0 40-29 70-30 30-70 30H270q-40 0-70-30-29-30-29-70V278q0-40 29-69 30-30 70-30h484q41 0 70 29zM316 670q4 4 9 2l374 2q5 0 9-4t4-11v-77q0-6-4-10t-9-4H325q-5 0-9 4t-4 9v78q0 7 4 11zm0-201q4 4 9 4h374q5 0 9-4t4-9v-79q0-6-4-10t-9-3l-374-1q-5 0-9 4t-4 10v78q0 6 4 10z"
        fill="#939291"
      />
    </svg>
  );
}
