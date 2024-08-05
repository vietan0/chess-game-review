import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { ClassValue } from 'clsx';

export default function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
