import { babel } from '@rollup/plugin-babel';
import cjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

import kleur from 'kleur';
import ora from 'ora';
import path from 'path';
import { InputOptions, OutputOptions, rollup, watch } from 'rollup';
import cleaner from 'rollup-plugin-cleaner';

interface BundleOptions {
  cjs: boolean;
}

const extensions = ['.js', '.ts', '.json', '.tsx', '.jsx'];

const external = ['@babel/core', '@babel/preset-typescript', 'merge-anything'];

const getInputOptions = (options: BundleOptions): InputOptions => {
  const res = {
    cache: true,
    input: path.resolve('src/index.ts'),
    external,
    plugins: [
      typescript({ tsconfig: path.resolve('./tsconfig.json') }),
      cleaner({ targets: [path.resolve('./lib/')] }),
      babel({
        extensions,
        babelHelpers: 'bundled',
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          '@babel/preset-typescript',
        ],
      }),
      nodeResolve({ extensions, preferBuiltins: true, browser: false }),
    ],
  };

  if (options.cjs) {
    res.plugins.push(cjs({ extensions }));
  }

  return res;
};

const getOutputOptionsList = (
  options: BundleOptions,
): (OutputOptions & { file: string })[] => {
  const isDev = process.env.NODE_ENV === 'development';

  const res: (OutputOptions & { file: string })[] = [
    {
      format: 'esm',
      file: path.resolve('lib/index.mjs'),
      sourcemap: isDev,
    },
  ];

  if (options.cjs) {
    res.push({
      format: 'cjs',
      file: path.resolve('lib/index.cjs'),
      sourcemap: isDev,
    });
  }

  return res;
};

export async function build(options: BundleOptions) {
  let bundle;
  let buildFailed = false;
  const outputOptionsList = getOutputOptionsList(options);

  async function generateOutputs(bundle) {
    for (const outputOptions of outputOptionsList) {
      await bundle.write(outputOptions);
    }
  }

  try {
    // 启动一次打包
    bundle = await rollup(getInputOptions(options));

    // 一个文件名数组，表示此产物所依赖的文件

    await generateOutputs(bundle);

    console.log(
      `${kleur.blue('Success!')}\n${formatOutputFileLog(outputOptionsList.map(output => output.file))}`,
    );
  } catch (error) {
    buildFailed = true;
    // 进行一些错误报告
    console.error(error);
  }
  if (bundle) {
    // 关闭打包过程
    await bundle.close();
  }
  process.exit(buildFailed ? 1 : 0);
}

function formatOutputFileLog(files: readonly string[]) {
  return files
    .map(
      file =>
        `  ${kleur
          .underline()
          .bold()
          .green(file.replace(path.resolve() + '/', ''))}`,
    )
    .join('\n');
}

export function dev(options: BundleOptions) {
  const outputOptionsList = getOutputOptionsList(options);

  const watcher = watch({
    ...getInputOptions(options),
    output: outputOptionsList,
    watch: {
      chokidar: { alwaysStat: true, cwd: '.' },
      include: [path.resolve('src/**/*')],
      buildDelay: 400,
    },
  });

  const spinner = ora(kleur.blue('Building'));

  // 监听事件
  watcher.on('event', event => {
    switch (event.code) {
      case 'START':
        spinner.start();
        break;
      case 'BUNDLE_START':
        break;
      case 'BUNDLE_END':
        spinner.text = `${kleur.green('Success! ')} ${kleur.yellow(event.duration + 'ms')} \n${formatOutputFileLog(event.output)}`;
        spinner.succeed();
        break;
      case 'END':
        break;
      case 'ERROR':
        spinner.text = `${kleur.red('[Error]:')}` + JSON.stringify(event.error);
        spinner.fail();
        break;
      default:
        spinner.text = `${kleur.red('[Unknow]:')}` + JSON.stringify(event);
        spinner.warn();
        break;
    }
    if ('result' in event && event.result) {
      event.result.close().catch(error => console.error(error, true));
    }
  });
}
