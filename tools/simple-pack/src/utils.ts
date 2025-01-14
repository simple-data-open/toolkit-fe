import { getDepsRegistrationList } from '@simple-data-open/utils';

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
    manifest = pkg.simpleManifest as SimpleExtSpace.Manifest;
    manifest.name = pkg.name;
    manifest.version = pkg.version;

    if (!/^[a-z-]+$/.test(pkg.name)) {
      manifest.name = pkg.name.toLowerCase().replace(/[^a-z-]+/g, '-');
      console.log(
        `Extension name should be lowercase and only contain letters and hyphens. The name has been automatically modified like ${manifest.name}.`,
      );
    }
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
  const dependences = await getDepsRegistrationList({
    // TODO: 需要修改为变量
    baseUrl: 'http://192.168.50.41:94/dependences',
    deps: manifest.dependences || {},
  });
  writeFileSync(
    path.join(bundleDir, BUNDLE_MANIFEST_NAME),
    JSON.stringify(Object.assign({}, bundleManifest, { dependences }), null, 2),
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
  const { dependences } = await getManifest();
  const externals: Record<string, string> = {};
  if (dependences) {
    Object.entries(dependences).forEach(([name, version]) => {
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
