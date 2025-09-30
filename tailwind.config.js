/** @type {import('tailwindcss').Config} */
import { heroui } from '@heroui/react';
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
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          primary: {
            DEFAULT: '#81B64C',
            50: '#EEFAE4',
            100: '#D7EAC5',
            200: '#BEDAA2',
            300: '#A5CB7F',
            400: '#8CBD5C',
            500: '#81B64C',
            600: '#587F33',
            700: '#3F5B23',
            800: '#243712',
            900: '#091400',
          },
        },
      },
      dark: {
        colors: {
          primary: {
            DEFAULT: '#81B64C',
            50: '#EEFAE4',
            100: '#D7EAC5',
            200: '#BEDAA2',
            300: '#A5CB7F',
            400: '#8CBD5C',
            500: '#81B64C',
            600: '#587F33',
            700: '#3F5B23',
            800: '#243712',
            900: '#091400',
          },
        },
      },
    },
    layout: {
      radius: {
        small: '6px',
        medium: '9px',
        large: '12px',
      },
    },
  })],
};
