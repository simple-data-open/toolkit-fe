import { transformManifest } from '@simple-data-open/utils';

import fs, { existsSync, writeFileSync } from 'fs';
import path, { resolve } from 'path';
import { Configuration } from 'webpack';

import {
  BUNDLE_DIR,
  BUNDLE_MANIFEST_NAME,
  CUSTOM_WEBPACK_CONFIG,
  ENTRY_DRAW_EDITOR,
} from './constants.js';

let manifest: SimpleExtSpace.Manifest | null = null;

export const getManifest = async (): Promise<SimpleExtSpace.Manifest> => {
  if (!manifest) {
    const pkg = JSON.parse(
      fs.readFileSync(resolve('package.json'), {
        encoding: 'utf8',
      }),
    );
    manifest = await transformManifest(pkg);
  }

  return manifest;
};

export const getOutputDir = async () => {
  const { version } = await getManifest();
  return resolve(BUNDLE_DIR, version);
};

export const writeBundleManifest = async () => {
  const { debug, ...manifest } = await getManifest();
  const bundleManifest: SimpleExtSpace.Manifest = manifest;
  const bundleDir = await getOutputDir();

  writeFileSync(
    path.join(bundleDir, BUNDLE_MANIFEST_NAME),
    JSON.stringify(bundleManifest, null, 2),
    { encoding: 'utf8' },
  );
};

export const getEntries = async (): Promise<Record<string, string>> => {
  const { docks } = await getManifest();

  const entries = {};
  if (docks.editor) {
    Object.assign(entries, { editor: resolve(ENTRY_DRAW_EDITOR) });
  }
  if (docks.reader) {
    Object.assign(entries, { reader: resolve(ENTRY_DRAW_EDITOR) });
  }
  return entries;
};

export const getExternals = async (): Promise<Record<string, string>> => {
  const { dependencies } = await getManifest();
  const externals: Record<string, string> = {};
  if (dependencies) {
    dependencies.forEach(({ name, version }) => {
      Object.assign(externals, {
        [name]: `${name}@${version}`,
      });
    });
  }
  return externals;
};

async function loadModule(moduleName: string) {
  try {
    const module = await import(moduleName);
    return module.default;
  } catch (error) {
    console.error(`Failed to load module: ${moduleName}`, error);
  }
}

export const getCustomWebpackConfig = async (): Promise<Configuration> => {
  const customConfigPath = resolve(CUSTOM_WEBPACK_CONFIG);
  const config = {};

  if (existsSync(customConfigPath)) {
    const webpackConfigCustom = await loadModule(
      resolve(CUSTOM_WEBPACK_CONFIG),
    );
    Object.assign(config, webpackConfigCustom);
  }
  return config;
};
