import { MotionGlobalConfig } from 'framer-motion';
import { beforeAll } from 'vitest';

import '@testing-library/jest-dom/vitest';

beforeAll(() => {
  MotionGlobalConfig.skipAnimations = true;
});
