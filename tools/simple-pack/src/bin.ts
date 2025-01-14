#!/usr/bin/env node
import { program } from 'commander';
import kleur from 'kleur';

import { build, debug } from './pack.js';

program
  .command('build')
  .description('Build Extension.')
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
  .command('serve')
  .description('Publish library to store.')
  .action(() => {
    process.env.NODE_ENV = 'development';
    debug();
  });

program.parse();
