/** @type {import('tailwindcss').Config} */
import { nextui } from '@nextui-org/theme';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      screens: {
        xs: '400px',
        ...defaultTheme.screens,
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
