#!/usr/bin/env node
import { program } from 'commander';
import fs from 'fs';
import path from 'path';

import { build, dev } from './utils.js';

const pkg = JSON.parse(
  fs.readFileSync(path.resolve('./package.json'), {
    encoding: 'utf8',
  }),
);

program.name('Library Bundler').description(pkg.name).version(pkg.version);

program
  .command('build')
  .description('Build library package for production.')
  .option('--cjs', 'Ouput width cjs')
  .action(options => {
    process.env.NODE_ENV = 'production';
    build(options);
  });

program
  .command('dev')
  .description('Start an library develop.')
  .option('--cjs', 'Ouput width cjs')
  .action(options => {
    process.env.NODE_ENV = 'development';
    dev(options);
  });

program.parse();
