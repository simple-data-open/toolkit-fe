#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join, resolve } from 'path';

const FILE_EXTENSIONS = ['.ts', '.tsx']; // 支持的文件扩展名

const workspaceDirectory = join(import.meta.dirname, '..');

const isExistConfigFile = existsSync(resolve('eslint.config.mjs'));

// 获取 Git 中变更的文件列表（已暂存和未暂存）
function getChangedFiles() {
  try {
    const unstagedFiles = execSync('git diff --name-only --diff-filter=ACM', {
      encoding: 'utf-8',
    });
    const stagedFiles = execSync(
      'git diff --name-only --cached --diff-filter=ACM',
      { encoding: 'utf-8' },
    );
    const files = [
      ...new Set([...unstagedFiles.split('\n'), ...stagedFiles.split('\n')]),
    ];
    return files
      .filter(
        file =>
          file &&
          FILE_EXTENSIONS.some(
            ext =>
              // 过滤后缀名
              file.endsWith(ext) &&
              // 过滤非当前运行命令路径
              join(workspaceDirectory, file).startsWith(resolve()),
          ),
      )
      .map(file => {
        return join(workspaceDirectory, file).replace(`${resolve()}/`, '');
      });
  } catch (error) {
    console.error('Error fetching changed files:', error.message);
    process.exit(1);
  }
}

// 运行 ESLint 对文件进行检查
function runESLint(_files) {
  const files = _files.filter(file => existsSync(file));
  if (files.length === 0) {
    // console.log('No changed files to lint.');
    process.exit(0);
  }

  // 看项目决定使用, 当前使用 workspace 下的 eslint
  // const eslintPath = resolve('node_modules', '.bin', 'eslint');
  // if (!existsSync(eslintPath)) {
  //   console.error(
  //     'ESLint is not installed. Please install it using npm or yarn.',
  //   );
  //   process.exit(1);
  // }

  const command = `bunx eslint${isExistConfigFile ? ' --config ./eslint.config.mjs' : ''} ${files.join(' ')} --cache --quiet --fix`;
  // const printWorkspacePath = files.map(
  //   file => '[changed]: ' + resolve(file).replace(`${workspaceDirectory}/`, ''),
  // );

  // console.log('Running ESLint on the following files:\n');
  // console.log(printWorkspacePath.join('\n'));
  try {
    execSync(command, { encoding: 'utf-8', stdio: 'inherit' });
  } catch (error) {
    console.error('Error running ESLint:', error.message);
    process.exit(1);
  }
}

// 主函数
function main() {
  const changedFiles = getChangedFiles();
  runESLint(changedFiles);
}

main();
