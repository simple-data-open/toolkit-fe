#!/usr/bin/env node
import { program } from 'commander';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { create } from './create.js';
import { serve } from './serve.js';

const pkg = JSON.parse(
  readFileSync(path.join(import.meta.dirname, '../package.json'), 'utf-8'),
);

program
  .name(pkg.name)
  .description(pkg.description)
  .version(pkg.version, '-v, --vers');

program
  .command('create')
  .description('Create simple data extension project.')
  .option('-n, --name <name>', 'Project name')
  .action(async function (options) {
    if (!options.name) {
      throw new Error('Project name is required.');
    }
    await create(options);
  });

program
  .command('serve')
  .description('Simple extension debug center server.')
  .option(
    '--port <port>',
    'Start debug center server width this port or default 9999',
    '9999',
  )
  .action(async function (options) {
    await serve(options);
  });

program
  .command('publish')
  .description('Publish library to store.')
  .action(() => {
    // 检查生成文件列表
  });

program.parse();
