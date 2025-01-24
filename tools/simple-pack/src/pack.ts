import CompressionPlugin from 'compression-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import debounce from 'debounce';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { createRequire } from 'module';
import { nanoid } from 'nanoid';
import * as path from 'path';
import { Socket, io } from 'socket.io-client';
import webpack, { Configuration } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import WebpackDevServer from 'webpack-dev-server';
import { merge } from 'webpack-merge';
import WebpackBar from 'webpackbar';

import { ASSETS_DIR } from './constants.js';
import {
  getCustomWebpackConfig,
  getEntries,
  getExternals,
  getManifest,
  getOutputDir,
  writeBundleManifest,
} from './utils.js';

interface ConfigOptions {
  analysis?: boolean;
}

const require = createRequire(import.meta.url);

export const formatWebpackConfig = async (
  options: ConfigOptions = { analysis: false },
): Promise<Configuration> => {
  const isProd = process.env.NODE_ENV === 'production';
  const manifest = await getManifest();
  const entry = await getEntries();
  const outputDir = await getOutputDir();
  const externals = await getExternals();

  const plugins = [
    new MiniCssExtractPlugin(),
    new CssMinimizerPlugin(),
    new WebpackBar({
      color: '#9ff552',
    }),
    new CompressionPlugin({
      threshold: 6400, // 对大于 64kb 的文件进行压缩
    }),
  ];

  if (options?.analysis) {
    plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static', // 'static' 可生成 HTML 文件
        openAnalyzer: true, // 构建完成后自动打开
      }),
    );
  }

  if (isProd) {
    plugins.push(
      // @ts-expect-error: 插件类型错误
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(ASSETS_DIR),
            to: path.resolve(outputDir, ASSETS_DIR),
          },
        ],
      }),
    );
  }

  return {
    stats: {
      all: false,
      errors: true,
      warnings: false,
      modules: false,
      assets: true,
    },
    mode: process.env.NODE_ENV as 'development' | 'production',
    devtool: isProd ? false : 'eval-cheap-source-map',
    entry,
    output: {
      filename: '[name].js',
      path: outputDir,
      libraryTarget: 'system',
      clean: true,
      publicPath: `/${manifest.name}/${manifest.version}/`,
    },
    devServer: {
      hot: false,
      liveReload: false,
      compress: false,
      allowedHosts: 'all',
      webSocketServer: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        // 'Access-Control-Allow-Headers':
        //   'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild',
      },
      static: {
        publicPath: `/${manifest.name}/${manifest.version}/${ASSETS_DIR}`,
        directory: path.resolve(ASSETS_DIR),
      },
    },
    optimization: {
      minimize: true,
    },
    plugins,
    performance: {
      maxEntrypointSize: 2000000,
      maxAssetSize: 2000000,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.mjs', '.json'],
    },
    externals,
    module: {
      rules: [
        {
          test: /\.m?js$/,
          resolve: {
            fullySpecified: false, // 禁止对 ESM 模块强制要求完整路径
          },
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                cacheDirectory: true,
                cacheCompression: false,
                compact: false,
                presets: [
                  [
                    require.resolve('@babel/preset-env'),
                    {
                      targets: {
                        safari: '12', // 指定最低支持的 Safari 版本
                      },
                      // useBuiltIns: 'entry', // 使用 polyfill
                    },
                  ],
                ],
              },
            },
            {
              loader: require.resolve('source-map-loader'),
            },
          ],
        },
        {
          test: /\.ts?$/,
          use: [
            require.resolve('babel-loader'),
            require.resolve('ts-loader'),
            {
              loader: require.resolve('source-map-loader'),
            },
          ],
          parser: {
            system: false,
          },
        },
        {
          test: /\.(css)$/,
          // sideEffects: true,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: require.resolve('css-loader'),
              options: {
                url: false,
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                postcssOptions: {
                  plugins: [require.resolve('postcss-preset-env')],
                },
              },
            },
          ],
        },
      ],
    },
  };
};

async function getWebpackConfig(
  options?: ConfigOptions,
): Promise<Configuration> {
  const baseWebpackConfig = await formatWebpackConfig(options);
  const customWebpackConfig = await getCustomWebpackConfig();

  return merge(baseWebpackConfig, customWebpackConfig);
}

async function execTask(options?: ConfigOptions): Promise<string> {
  const webpackConfig = await getWebpackConfig(options);

  return new Promise((resolve, reject) => {
    const compiler = webpack(webpackConfig);

    compiler.run((error: any, stats: any) => {
      if (error) {
        reject(new Error(error.message));
        return;
      }
      const info = stats.toJson();
      if (stats?.hasErrors()) {
        reject(info.errors);
        return;
      }
      // if (stats.hasWarnings()) {
      //   console.warn(info.warnings);
      // }
      // 导出 library.manifest 文件

      compiler.close(closeErr => {
        if (closeErr) {
          reject(closeErr);
        } else {
          resolve('complete');
        }
      });
    });
  });
}

export async function debug() {
  const webpackConfig = await getWebpackConfig();
  const manifest = await getManifest();

  return new Promise((resolve, reject) => {
    const compiler = webpack(webpackConfig);
    const port = manifest.debug?.port;
    const server = new WebpackDevServer(
      {
        ...webpackConfig.devServer,
        port,
      },
      compiler,
    );

    let ws: Socket | undefined;
    let hasRegisted = false;

    const reload = debounce(() => {
      ws?.emit('extension-reload', manifest);
    }, 100);

    compiler.watch({}, err => {
      if (err) {
        console.error('编译错误:', err);
      } else if (!hasRegisted) {
        hasRegisted = true;
        ws = io(`${manifest.debug?.serve}`);
        ws.on('connect', () => {
          if (manifest.debug) {
            manifest.debug.stamp = nanoid(4);
          }
          ws?.emit('extension-connect', manifest);
        });
      } else {
        reload();
      }
    });

    try {
      server.start();
      resolve('watching');
    } catch (error) {
      reject(error);
    }
  });
}

export async function build() {
  try {
    await execTask();
    await writeBundleManifest();

    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

export async function analyze() {
  try {
    await execTask({ analysis: true });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
