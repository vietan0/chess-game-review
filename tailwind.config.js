/** @type {import('tailwindcss').Config} */
import { heroui } from '@heroui/theme';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: ['Chivo Mono', ...defaultTheme.fontFamily.mono],
      },
      screens: {
        xs: '400px',
        ...defaultTheme.screens,
      },
      colors: {
        lightGreen: '#ebecd0',
        darkGreen: '#739552',
        lightBrown: '#edd6b0',
        darkBrown: '#b88762',
        lightIce: '#c5d5dc',
        darkIce: '#7a9db2',
        highlight: 'hsl(60 100% 60% / 50%)',
        best: '#81B64C',
        excellent: '#81B64C',
        good: '#95b776',
        inaccuracy: '#F7C631',
        mistake: '#FFA459',
        blunder: '#FA412D',
        book: '#D5A47D',
        forced: '#96AF8B',
        miss: '#FF7769',
        great: '#749BBF',
        brilliant: '#26C2A3',
      },
    },
  },
  darkMode: 'class',
  plugins: [heroui()],
};
