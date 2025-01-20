import pluginJs from '@eslint/js';

import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { files: ['**/*.{ts}'] },
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
