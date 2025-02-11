import './dep.d.ts';

declare global {
  namespace SimpleExtSpace {
    type Slot = 'widget';

    interface ManifestOriginal {
      icon?: string;
      engines: {
        connector: '0.0.0';
      };
      locales: {
        [key: string]: {
          title: string;
          description: string;
        };
      };
      dependencies?: {
        [key: string]: string;
      };
      docks: {
        editor?: {
          css?: boolean;
          slots?: Slot[];
        };
        reader?: {
          css?: boolean;
          slots?: Slot[];
        };
      };
      debug?: {
        /** 开发环境协议： https:\/\/, http:\/\/ */
        protocol: string;
        /** 开发环境主机名 localhost, 127.0.0.1 */
        hostname: string;
        /** 插件运行端口 */
        port: number;
        /** 调试服务地址: simple-cli ws 服务地址 */
        serve: string;
        /** 插件更新标识 */
        stamp?: string;
      };
    }

    type Debug = ManifestOriginal['debug'];

    type Manifest = Omit<ManifestOriginal, 'dependencies'> & {
      name: string;
      version: string;
      dependencies: SimpleDepSpace.DepModel[];
    };
  }
}

export {};
