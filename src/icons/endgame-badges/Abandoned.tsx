import type { SVGProps } from 'react';

export default function Abandoned(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      height="70%"
      viewBox="0 0 18 19"
      width="70%"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx={9}
        cy={9.5}
        r={9}
        style={{
          fill: '#e02828',
        }}
      />
      <g fill="#fff">
        <path
          d="M4.916 9.77h6.56a.365.365 0 0 0 .273-.12.393.393 0 0 0 .114-.268v-.764a.428.428 0 0 0-.12-.274.37.37 0 0 0-.268-.114H4.91l1.272-1.278a.33.33 0 0 0 .114-.268c0-.102-.041-.2-.114-.273l-.41-.405a.325.325 0 0 0-.257-.12.382.382 0 0 0-.262.12L2.92 8.32l-.405.405A.37.37 0 0 0 2.4 9a.33.33 0 0 0 .108.268l2.744 2.72a.377.377 0 0 0 .28.115.314.314 0 0 0 .256-.114l.41-.405a.37.37 0 0 0 0-.57z"
          style={{
            fill: '#ffffff, fillOpacity: 1',
          }}
          transform="translate(-.3 .5)"
        />
        <path
          d="M14.487 3.867H7.985a.513.513 0 0 0-.514.513V7.29h1.29V5.156h4.95v7.688h-4.95v-2.133H7.47v2.909a.513.513 0 0 0 .514.513h6.502A.513.513 0 0 0 15 13.62V4.38a.514.514 0 0 0-.513-.513z"
          style={{
            fill: '#ffffff, fillOpacity: 1',
          }}
          transform="translate(-.3 .5)"
        />
      </g>
    </svg>
  );
}
