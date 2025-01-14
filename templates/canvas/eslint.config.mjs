// @ts-check
import * as tsParser from '@typescript-eslint/parser';

import solid from 'eslint-plugin-solid/configs/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import baseEslintConfig from '../../eslint.config.mjs';

export default tseslint.config(...baseEslintConfig, {
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
});
