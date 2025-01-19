#!/usr/bin/env node
import { validateName } from '@simple-data-open/utils/extension';

import { program } from 'commander';
import inquirer from 'inquirer';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { create, getTemplateList } from './create.js';
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
    if (!options.name || validateName(options.name).code === 1) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Project name',
          validate: function (_value) {
            const value = _value.trim();
            const status = validateName(value);
            if (status.code === 1) {
              console.error(status.message);
              return false;
            } else {
              return true;
            }
          },
        },
      ]);
      options.name = answers.name;
    }

    const templates = await getTemplateList();

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'template',
        message: 'Template name',
        default: templates[0],
        choices: templates,
      },
    ]);
    options.template = answers.template;

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
