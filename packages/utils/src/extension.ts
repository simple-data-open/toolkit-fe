import { getDepsRegistrationList } from './deps-register.js';

export const transformManifest = async (
  pkg: any,
): Promise<SimpleExtSpace.Manifest> => {
  const manifestOriginal =
    pkg.simpleManifest as SimpleExtSpace.ManifestOriginal;

  const dependences = await getDepsRegistrationList({
    // TODO: 需要修改为变量
    baseUrl: 'http://192.168.50.41:94/dependences',
    deps: manifestOriginal.dependences || {},
  });
  const manifest: SimpleExtSpace.Manifest = Object.assign(
    {},
    manifestOriginal,
    {
      name: pkg.name,
      version: pkg.version,
      dependences,
    },
  );

  if (!/^[a-z-]+$/.test(pkg.name)) {
    manifest.name = pkg.name.toLowerCase().replace(/[^a-z-]+/g, '-');
    console.log(
      `Extension name should be lowercase and only contain letters and hyphens. The name has been automatically modified like ${manifest.name}.`,
    );
  }
  return manifest;
};
