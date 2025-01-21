#!/usr/bin/env node
import babel from '@babel/core';

import chokidar from 'chokidar';
import { Command } from 'commander';
import kleur from 'kleur';
import childProcess from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const program = new Command();

function isCommandInPath(command) {
  const pathValue = process.env.PATH || '';
  const paths = pathValue.split(path.delimiter);
  return paths.some(p => fs.existsSync(path.join(p, command)));
}

// 读取 tsconfig.json 的 outDir 配置
const loadOutDirFromTsconfig = () => {
  const tsconfigPath = path.resolve('tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    return tsconfig?.compilerOptions?.outDir || 'lib';
  }
  return 'lib';
};

const OUT_DIR = path.resolve(loadOutDirFromTsconfig());
const SRC_DIR = path.resolve('src');

// 删除目标目录
const removeOutDir = () => {
  if (fs.existsSync(OUT_DIR)) {
    fs.rmSync(OUT_DIR, { recursive: true, force: true });
    console.log(kleur.strikethrough().red(`Removed directory: ${OUT_DIR}`));
  }
};

const printPath = dir => {
  const color = new RegExp(SRC_DIR).test(dir) ? kleur.green : kleur.blue;
  return color(dir.replace(path.resolve() + '/', ''));
};

// 自定义 Babel 插件
const addJsExtensionPlugin = () => ({
  visitor: {
    ImportDeclaration(path) {
      const source = path.node.source.value;
      if (source.startsWith('.') && !source.endsWith('.js')) {
        path.node.source.value += '.js';
      }
    },
    ExportDeclaration(path) {
      if (!path.node.source) return;

      const source = path.node.source.value;
      if (source.startsWith('.') && !source.endsWith('.js')) {
        path.node.source.value += '.js';
      }
    },
  },
});

// 编译单个文件
const compileFile = srcPath => {
  const relativePath = path.relative(SRC_DIR, srcPath);
  const esmDestPath = path.resolve(
    OUT_DIR,
    relativePath.replace(/\.ts$/, '.js'),
  );
  return new Promise((resolve, reject) => {
    babel.transformFile(
      srcPath,
      {
        presets: [
          [
            '@babel/preset-env',
            { targets: { node: 'current' }, modules: false },
          ],
          '@babel/preset-typescript',
        ],
        plugins: [
          addJsExtensionPlugin(),
          ['@babel/plugin-proposal-decorators', { legacy: true }], // 启用装饰器支持
          '@babel/plugin-proposal-class-properties', // 支持类属性
        ],
      },
      (err, result) => {
        if (err) {
          console.error(`Error compiling ${printPath(srcPath)} (ESM):`, err);
          reject(err);
        } else {
          fs.mkdirSync(path.dirname(esmDestPath), { recursive: true });
          fs.writeFileSync(esmDestPath, result?.code || '', 'utf8');
          console.log(
            `Compiled (ESM): ${printPath(srcPath)} -> ${printPath(esmDestPath)}`,
          );
          resolve(null);
        }
      },
    );
  });
};

// 使用 tsc 生成 .d.ts 文件
const generateTypeDefinitions = () => {
  console.log(kleur.yellow('Generating .d.ts files...'));
  try {
    const command = isCommandInPath('bunx') ? 'bunx' : 'npx';
    childProcess.execSync(`${command} tsc --emitDeclarationOnly`, {
      stdio: 'inherit',
    });
    console.log(kleur.green('Type declarations generated.'));
  } catch (error) {
    console.error(kleur.red('Error generating type declarations:'), error);
  }
};

// 删除目标文件
const removeFile = srcPath => {
  const relativePath = path.relative(SRC_DIR, srcPath);
  const esmDestPath = path.resolve(
    OUT_DIR,
    relativePath.replace(/\.ts$/, '.js'),
  );
  const dtsDestPath = esmDestPath.replace(/\.js$/, '.d.ts');

  if (fs.existsSync(esmDestPath)) {
    fs.unlinkSync(esmDestPath);
    console.log(`Removed (ESM): ${printPath(esmDestPath)}`);
  }
  if (fs.existsSync(dtsDestPath)) {
    fs.unlinkSync(dtsDestPath);
    console.log(`Removed (DTS): ${printPath(dtsDestPath)}`);
  }
};

// 初始化编译 src 中的所有文件
const initializeCompile = async () => {
  const compileDir = async dir => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        await compileDir(filePath);
      } else if (filePath.endsWith('.ts')) {
        await compileFile(filePath);
      }
    }
  };

  console.log(kleur.green('Initializing compilation of all files in src...'));
  await compileDir(SRC_DIR);
  generateTypeDefinitions();
};

// 监听文件变化
const watchFiles = () => {
  const watcher = chokidar.watch(SRC_DIR, {
    persistent: true,
    ignoreInitial: true,
    ignored: /node_modules/,
  });

  watcher
    .on('add', async filePath => {
      if (filePath.endsWith('.ts')) {
        await compileFile(filePath);
        generateTypeDefinitions();
      }
    })
    .on('change', async filePath => {
      if (filePath.endsWith('.ts')) {
        await compileFile(filePath);
        generateTypeDefinitions();
      }
    })
    .on('unlink', async filePath => {
      if (filePath.endsWith('.ts')) {
        removeFile(filePath);
      }
    });

  console.log(kleur.gray(`Watching for changes in ${SRC_DIR}...`));
};

// 命令行处理
program
  .command('build')
  .description('Compile TypeScript files')
  .action(() => {
    removeOutDir();
    initializeCompile();
  });

program
  .command('watch')
  .description('Watch and compile TypeScript files')
  .action(() => {
    removeOutDir();
    initializeCompile();
    watchFiles();
  });

program.parse(process.argv);
