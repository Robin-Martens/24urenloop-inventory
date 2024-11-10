import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import simplesort from 'eslint-plugin-simple-import-sort';
import reactLint from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import { fixupPluginRules } from '@eslint/compat';

export default [
  {
    ignores: [
      '**/*.workspace.ts',
      '**/*.config.ts',
      '**/dist/**',
      '**/scenarios/**',
      '**/*.js',
      '**/*.d.ts',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      'simple-import-sort': simplesort,
    },
    rules: {
      '@typescript-eslint/no-empty-object-type': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'error',
      '@typescript-eslint/no-wrapper-object-types': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/consistent-indexed-object-style': 'error',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      'eol-last': 'error',
      'spaced-comment': 'error',
      'comma-spacing': [
        'error',
        {
          before: false,
          after: true,
        },
      ],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'no-var': 'error',
      'object-shorthand': ['error', 'always'],
      'no-prototype-builtins': 'error',
      'prefer-template': 'error',
      'prefer-arrow-callback': [
        'error',
        {
          allowUnboundThis: false,
        },
      ],
      'arrow-body-style': ['error', 'as-needed'],
      eqeqeq: ['error', 'smart'],
      // 'no-nested-ternary': 'error',
      'no-else-return': 'error',
      curly: 'error',
      'no-unused-expressions': 'error',
      'no-console': ['error', { allow: ['error'] }],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportDefaultDeclaration',
          message: 'Prefer named exports',
        },
      ],
    },
  },
  {
    files: ['**/*.tsx'],
    ...reactLint.configs.flat.recommended,
    ...eslintPluginReactHooks.configs.recommended,
    rules: {
      // suppress errors for missing 'import React' in files
      'react/react-in-jsx-scope': 'off',
      'react-hooks/exhaustive-deps': 'error',
    },
    plugins: {
      react: reactLint,
      'react-hooks': fixupPluginRules(eslintPluginReactHooks),
    },
  },
];
