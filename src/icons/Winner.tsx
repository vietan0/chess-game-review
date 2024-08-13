import cn from '../utils/cn';

export default function Winner({ className = '' }: { className?: string }) {
  return (
    <svg className={cn('size-7', className)} height="70%" viewBox="0 0 18 19" width="70%" xmlns="http://www.w3.org/2000/svg">
      <defs />
      <circle cx="9" cy="9.5" r="9" style={{ fill: 'rgb(131, 184, 79)', transformBox: 'fill-box', transformOrigin: '50% 50%' }} />
      <g id="winner" transform="matrix(1, 0, 0, 1, 0, 1.3)">
        <path d="m 24.4334,39.6517 c 15.9034,0 22.8584,-4.7017 22.8584,-4.7017 l 0.975,-23.6167 c 0,-2.16663 -1.495,-2.79497 -3.25,-1.4083 L 34.1834,17.53 26.6868,2.66667 C 26.0151,0.911667 25.1484,0.5 24.5201,0.5 23.8918,0.5 22.9384,0.955 22.3534,2.66667 L 14.6834,17.53 3.85008,9.925 C 2.09508,8.53833 0.513416,9.16667 0.600083,11.3333 L 1.57508,34.95 c 0,0 6.955,4.55 22.85832,4.7017 z" fill="white" id="path1" style={{ fill: '#ffffff', fillOpacity: 1 }}transform="matrix(0.25173118,0,0,0.25173118,2.8497971,2.8741344)" />
      </g>
    </svg>
  );
}
