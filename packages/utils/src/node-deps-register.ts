import https from 'https';
import fetch from 'node-fetch';

const formatDepManifestUrl = ({
  baseUrl,
  name,
  version,
}: {
  baseUrl: string;
  name: string;
  version: string;
}) => {
  return `${baseUrl}/${name}/${version}/dep.manifest.json`;
};

const formatDepCssUrl = ({
  baseUrl,
  name,
  version,
}: {
  baseUrl: string;
  name: string;
  version: string;
}) => {
  return `${baseUrl}/${name}/${version}/main.css`;
};

/**
 * @description 通过 deps 的 name 和 version 获取对应的注册列表
 * @module tools/ext-builtin-builder/src/diff-end
 * @param {string} baseUrl - 基础 url
 * @param {Record<string, string>} deps - 依赖列表
 * @param {Record<string, string>} registry - 已有注册列表
 */
export async function getDepsRegistrationList({
  baseUrl,
  deps,
  registry = [],
}: {
  baseUrl: string;
  /** 格式: { [dep_name]: [dep_version] } */
  deps: Record<string, string>;
  registry?: SimpleDepSpace.DepModel[];
}): Promise<SimpleDepSpace.DepModel[]> {
  // 找出待注册的依赖项
  const registryList = Object.entries(deps).filter(
    ([name, version]) =>
      !registry.find(
        registeredDep =>
          registeredDep.name === name && registeredDep.version === version,
      ),
  );

  if (registryList.length === 0) {
    return registry; // 如果没有新依赖，直接返回已有注册列表
  }

  const agent = new https.Agent({
    rejectUnauthorized: false,
  });
  // 遍历注册列表并获取依赖数据
  const results = await Promise.allSettled(
    registryList.map(async ([name, version]) => {
      try {
        const response = await fetch(
          formatDepManifestUrl({ baseUrl, name, version }),
          { agent },
        );
        if (!response.ok) {
          console.error(`Fetch error: ${response.status} - ${response.url}`);
          return null; // 标记为失败
        }
        const data = await response.json();
        return data as SimpleDepSpace.DepModel;
      } catch (error) {
        console.error(`Fetch failed for ${name}@${version}:`, error);
        return null; // 标记为失败
      }
    }),
  );

  // 更新 registry 并收集新依赖项
  const nextDeps: Record<string, string> = {};
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value) {
      const dep = result.value;
      if (dep.name && dep.version) {
        registry.push(dep);
        if (dep.dependencies) {
          Object.assign(nextDeps, dep.dependencies);
        }
      }
    }
  }

  // 递归处理新的依赖
  return getDepsRegistrationList({ baseUrl, deps: nextDeps, registry });
}

export function getDepsCssUrl({
  baseUrl,
  deps,
  registry,
}: {
  baseUrl: string;
  deps: Record<string, string>;
  registry: SimpleDepSpace.DepModel[];
}): string[] {
  const links: string[] = [];

  Object.entries(deps).forEach(([name, version]) => {
    const info = registry.find(
      ({ name: _name, version: _version }) =>
        name === _name && version === _version,
    );

    if (!info) {
      return;
    }
    const { css, dependencies } = info;
    if (css) {
      links.push(formatDepCssUrl({ baseUrl, name, version }));
    }

    if (dependencies) {
      links.push(...getDepsCssUrl({ baseUrl, deps: dependencies, registry }));
    }
  });

  return links;
}
