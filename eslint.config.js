import antfu from '@antfu/eslint-config';
import { FlatCompat } from '@eslint/eslintrc';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tailwind from 'eslint-plugin-tailwindcss';

const compat = new FlatCompat();

export default antfu(
  {
    stylistic: {
      semi: true,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'no-console': 'off',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': 'warn',
      'style/padding-line-between-statements': [
        'warn',
        { blankLine: 'always', prev: '*', next: ['return', 'export'] },
        { blankLine: 'never', prev: 'export', next: 'export' },
        {
          blankLine: 'always',
          prev: 'import',
          next: ['const', 'let', 'function', 'block-like', 'interface'],
        },
        {
          blankLine: 'always',
          prev: [
            'multiline-expression',
            'multiline-block-like',
            'multiline-const',
            'interface',
          ],
          next: '*',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: [
            'multiline-expression',
            'multiline-block-like',
            'multiline-const',
            'interface',
          ],
        },
        {
          blankLine: 'never',
          prev: ['singleline-const', 'singleline-let', 'singleline-var'],
          next: ['singleline-const', 'singleline-let', 'singleline-var'],
        },
      ],
      'import/order': 'off',
      'perfectionist/sort-jsx-props': 'error',
      'perfectionist/sort-imports': [
        'error',
        {
          groups: [
            'builtin',
            ['external', 'internal'],
            ['parent', 'sibling', 'index'],
            [
              'internal-type',
              'type',
              'parent-type',
              'sibling-type',
              'index-type',
            ],
            ['side-effect', 'side-effect-style'],
          ],
        },
      ],
      'test/consistent-test-it': ['error', { fn: 'test' }],
      'jsonc/sort-keys': [
        'error',
        {
          pathPattern: '^(scripts|(d|(devD))ependencies)$',
          order: { type: 'asc' },
        },
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-refresh/only-export-components': 'warn',
    },
    formatters: {
      css: true,
      html: true,
      markdown: true,
    },
  },
  ...tailwind.configs['flat/recommended'],
  ...compat.config({
    overrides: [
      {
        files: ['**/?(*.)+(spec|test).[jt]s?(x)'],
        extends: ['plugin:testing-library/react'],
        rules: {
          'testing-library/no-debugging-utils': 'off',
          'testing-library/no-manual-cleanup': 'off',
          'testing-library/no-render-in-lifecycle': 'off',
        },
      },
    ],
  }),
);
