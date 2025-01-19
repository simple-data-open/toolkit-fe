// @ts-check
import pluginJs from '@eslint/js';
import * as tsParser from '@typescript-eslint/parser';

import solid from 'eslint-plugin-solid/configs/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import baseEslintConfig from '../../eslint.config.mjs';

export default tseslint.config(
  {
    files: ['**/*.{ts,tsx}'],
    ...solid,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        // @ts-ignore
        projectService: 'tsconfig.json',
      },
      globals: globals.browser,
    },
  },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      '**/node_modules/**/*',
      '**/dist/**/*',
      '**/lib/**/*',
      'eslint.config.mjs',
    ],
  },
  {
    rules: {
      quotes: ['error', 'single'],
      semi: 'off',
      // 关闭无用变量检查
      'no-unused-vars': 'off',
      // 允许使用 any
      '@typescript-eslint/no-explicit-any': 'off',
      // 允许使用 _ 声明未使用变量
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      // 类 public method 必须使用箭头函数
      'no-restricted-syntax': [
        'error',
        {
          selector: "MethodDefinition[kind='method'][accessibility='public']",
          message: 'Public class methods must use arrow functions.',
        },
      ],
    },
  },
);
