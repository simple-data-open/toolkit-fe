#!/usr/bin/env node
import { program } from 'commander';
import kleur from 'kleur';

import { analyze, build, debug } from './pack';

program
  .command('build')
  .description('Build library for systemjs.')
  .action(async () => {
    process.env.NODE_ENV = 'production';
    try {
      await build();
    } catch (error) {
      console.log(
        kleur.red(
          error instanceof Error
            ? error.message
            : JSON.stringify(error, null, 2),
        ),
      );
      process.exit(1);
    }
  });

program
  .command('analyze')
  .description('Analyze bundle')
  .action(() => {
    process.env.NODE_ENV = 'production';
    analyze();
  });

program
  .command('serve')
  .description('Publish library to store.')
  .action(() => {
    process.env.NODE_ENV = 'development';
    debug();
  });

program.parse();
