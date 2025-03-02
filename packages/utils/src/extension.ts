import { execSync } from 'node:child_process';

import { getDepsRegistrationList } from './deps-register.js';

/** 校验名称是否符合规则 */
export const validateName = (
  name: string,
): { code: 0 | 1; message: string } => {
  const isValid = /^[a-z-]+$/.test(name);
  if (!isValid || !name) {
    return {
      code: 1,
      message: `Extension name "${name}" is invalid. It should only contain lowercase letters and hyphens.`,
    };
  }
  return {
    code: 0,
    message: 'Success',
  };
};

/** 转换名称 */
export const transformName = (name: string) => {
  return name.toLowerCase().replace(/[^a-z-]+/g, '-');
};

// TODO: version 校验
/**
 * 转换 manifest
 * @param pkg -  package.json
 * @returns SimpleExtSpace.Manifest
 * @description
 * 1. 依赖项 name 转换小写
 * 2. 依赖项 version 转换小写
 * 3.  name 转换小写,并且
 *    -  name 不能包含大写字母
 *    -  name 不能包含特殊字符
 * 4.  version 不能包含大写字母
 * 5.  version 不能包含特殊字符
 */
export const transformManifest = async (
  pkg: any,
): Promise<SimpleExtSpace.Manifest> => {
  const manifestOriginal =
    pkg.simpleManifest as SimpleExtSpace.ManifestOriginal;

  const baseUrl = execSync('simple-cli info -k baseUrl').toString();

  const dependencies = await getDepsRegistrationList({
    // TODO: 需要修改为变量
    baseUrl,
    deps: manifestOriginal.dependencies || {},
  });
  const manifest: SimpleExtSpace.Manifest = Object.assign(
    {},
    manifestOriginal,
    {
      name: pkg.name,
      version: pkg.version,
      dependencies,
    },
  );

  const status = validateName(manifest.name);

  if (status.code !== 0) {
    console.error(status.message);
    manifest.name = transformName(manifest.name);
  }
  return manifest;
};
