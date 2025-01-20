#!/usr/bin/env node
import { validateName } from '@simple-data-open/utils/extension';

import { program } from 'commander';
import inquirer from 'inquirer';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import {
  encrypt,
  getConfig,
  initializeConfig,
  saveConfig,
  storeToken,
} from './config';
import { create, getTemplateList } from './create';
import { serve } from './serve';

const pkg = JSON.parse(
  readFileSync(path.join(import.meta.dirname, '../package.json'), 'utf-8'),
);

initializeConfig(pkg.name);

const activeEnv = getConfig(pkg.name).active;

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
  .command('config')
  .description('Set config store.')
  .option('--env <env>', 'Environment name dev/test/prod', 'dev')
  .option('--url <url>', 'Environment url', 'http://localhost:3000')
  .option('--list -l', 'Config settings list')
  .action(options => {
    const config = getConfig(pkg.name);

    if (options.list) {
      console.log(JSON.stringify(config, null, 2));
      process.exit(0);
    }

    if (options.env) {
      config.active = options.env;
    }

    if (options.url) {
      const _env = options.env || config.envs[options.env];
      config.envs[_env].url = options.url;
    }

    saveConfig(pkg.name, config);

    console.log('Config saved.');
    console.log(JSON.stringify(config, null, 2));
    process.exit(0);
  });

program
  .command('login')
  .description('Login to use environment start development.')
  .option('--env <env>', 'Environment name dev/test/prod', activeEnv)
  .action(async options => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'username',
        message: 'username:',
        validate: function (_value) {
          if (!_value) {
            console.error('请输入用户名');
            return false;
          } else {
            return true;
          }
        },
      },
      {
        type: 'password',
        name: 'password',
        message: 'password:',
        mask: '*', // 显示掩码符号，比如 "*"
      },
    ]);

    const config = getConfig(pkg.name);

    const active = options.env || config.active;
    const url = `${config.envs[active].url}/api/auth/login`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: answers.username,
        password: encrypt(answers.password, active),
      }),
    });
    const result = await res.headers.get('set-cookie');

    const cookies = (result || '').split('; ');
    let token = '';

    for (const cookie of cookies) {
      const [key, value] = cookie.split('=');
      if (key === 'token') {
        token = value;
      }
    }

    if (!token) {
      console.error('登录失败');
      process.exit(1);
    }
    storeToken(pkg.name, active, token);

    process.exit(0);
  });

program
  .command('publish')
  .description('Publish library to store.')
  .action(() => {
    // 检查生成文件列表
  });

program.parse();
