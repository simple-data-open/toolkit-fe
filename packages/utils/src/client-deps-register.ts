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
