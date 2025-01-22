#!/usr/bin/env node
import chokidar from 'chokidar';
import { Command } from 'commander';
import fs from 'fs';
import kleur from 'kleur';
import ora from 'ora';
import path from 'path';
import ts from 'typescript';

import { suffixs } from './suffix.js';

const spinner = ora();

/**
 * 为导入语句添加 .js 后缀
 * @param filePath 文件路径
 */
function addJsExtensionToImports(filePath: string): void {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    filePath,
    fileContent,
    ts.ScriptTarget.Latest,
    true,
  );

  let result = '';
  let lastPos = 0;

  function visit(node: ts.Node): void {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      const moduleSpecifier = node.moduleSpecifier;
      if (moduleSpecifier && ts.isStringLiteral(moduleSpecifier)) {
        const modulePath = moduleSpecifier.text;

        // 判断是否内部模块
        const isInternal = modulePath.startsWith('.');
        // 如果模块路径已经包含后缀，跳过
        const hasSuffix = suffixs.some(suffix => modulePath.endsWith(suffix));
        if (!isInternal || hasSuffix) {
          return;
        }

        // 在模块路径后添加 .js
        const start = moduleSpecifier.getStart(sourceFile) + 1; // 跳过引号
        const end = moduleSpecifier.getEnd() - 1; // 跳过引号

        // 将修改后的内容拼接到结果中
        result += fileContent.slice(lastPos, start);
        result += `${modulePath}.js`;
        lastPos = end;
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  result += fileContent.slice(lastPos);
  fs.writeFileSync(filePath, result, 'utf8');
  spinner.text = `Added .js extension to imports in ${filePath}`;
}

/**
 * 处理目录中的所有 .js 文件
 * @param outDir 输出目录
 */
function processDirectory(outDir: string): void {
  const files = fs.readdirSync(outDir);

  files.forEach(file => {
    const filePath = path.join(outDir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      processDirectory(filePath); // 递归处理子目录
    } else if (file.endsWith('.js')) {
      addJsExtensionToImports(filePath); // 处理 .js 文件
    }
  });
}

/**
 * 监听目录并处理新生成的 .js 文件
 * @param outDir 输出目录
 */
function watchDirectory(outDir: string): void {
  const watcher = chokidar.watch(outDir, {
    persistent: true,
    ignoreInitial: false, // 处理已经存在的文件
  });

  watcher.on('add', filePath => {
    if (filePath.endsWith('.js')) {
      addJsExtensionToImports(filePath);
    }
  });

  watcher.on('change', filePath => {
    if (filePath.endsWith('.js')) {
      addJsExtensionToImports(filePath);
    }
  });

  console.log(kleur.green(`Watching for changes in ${outDir}...`));
}

/**
 * 从 tsconfig.json 中读取 outDir
 */
function getOutDirFromTsConfig(): string {
  const tsConfigPath = path.resolve('tsconfig.json');
  if (!fs.existsSync(tsConfigPath)) {
    throw new Error('tsconfig.json not found');
  }

  const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
  return tsConfig.compilerOptions?.outDir || 'dist';
}

// 初始化 commander
const program = new Command();

program
  .name('easy-tsc')
  .description('Automatically add .js extension to imports in tsc output');

// append 命令
program
  .command('append')
  .description('Process the entire project and add .js extension to imports')
  .action(() => {
    const outDir = getOutDirFromTsConfig();
    spinner.start(`Processing ${outDir}...`);
    processDirectory(outDir);
    spinner.succeed('Append .js extension to imports in all files');
  });

// watch 命令
program
  .command('watch')
  .description(
    'Watch for changes in tsc --watch output and add .js extension to imports',
  )
  .action(() => {
    const outDir = getOutDirFromTsConfig();
    watchDirectory(outDir);
  });

// 解析命令行参数
program.parse(process.argv);
