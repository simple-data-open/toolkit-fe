#!/usr/bin/env node
import { validateName } from '@simple-data-open/utils/node-extension';

import { program } from 'commander';
import inquirer from 'inquirer';
import kleur from 'kleur';
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
import { logger } from './logger';
import { publish } from './publish';
import { serve } from './serve';

const pkg = JSON.parse(
  readFileSync(path.join(import.meta.dirname, '../package.json'), 'utf-8'),
);

initializeConfig();

const activeEnv = getConfig().active;

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
  .option('-e, --env <env>', 'Environment name dev/test/prod', 'dev')
  .option('-u, --url <url>', 'Environment url', 'http://localhost:3000')
  .option(
    '-d, --dep <dep>',
    'Environment url',
    'http://192.168.50.171:94/dependencies',
  )
  .action(options => {
    const config = getConfig();

    if (options.env) {
      config.active = options.env;
    }

    if (options.url) {
      const _env = options.env || config.envs[options.env];
      config.envs[_env].url = options.url;
    }

    if (options.dep) {
      const _env = options.env || config.envs[options.env];
      config.envs[_env].dependencies_url = options.dep;
    }

    saveConfig(config);

    process.exit(0);
  });

program
  .command('info')
  .description('Get config info.')
  .option('-e, --env <env>', 'Environment name dev/test/prod')
  .option('-k, --key <key>', 'Environment url/dep/all', 'all')
  .action(options => {
    const config = getConfig();

    const _env = options.env || config.active;

    if (options.key === 'all') {
      logger(kleur.red('active'), kleur.blue(`[${_env}]`));

      Object.entries(config.envs).forEach(([key, value]) => {
        logger(kleur.green(`${key} api`), value.url);
        logger(kleur.green(`${key} dependencies`), value.dependencies_url);
      });
      process.exit(0);
    }

    if (options.key === 'url') {
      console.log(config.envs[_env].url);
      process.exit(0);
    }

    if (options.key === 'dep') {
      console.log(config.envs[_env].dependencies_url);
      process.exit(0);
    }

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

    const config = getConfig();

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
    storeToken(active, token);

    process.exit(0);
  });

program
  .command('publish')
  .description('Publish library to store.')
  .action(() => {
    logger('Publishing...');
    publish();
  });

program.parse();
