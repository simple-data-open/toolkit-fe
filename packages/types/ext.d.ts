declare global {
  namespace SimpleExtSpace {
    interface SlotCanvas {
      view: 'canvas';
      slot: 'widget' | 'foreground' | 'background';
    }
    interface SlotShare {
      view: 'share';
      slot: 'general';
    }
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
      dependences?: {
        [key: string]: string;
      };
      docks: {
        editor?: {
          css?: boolean;
          slots?: {
            canvas?: SlotCanvas['slot'][];
            share?: SlotShare['slot'][];
          };
        };
        reader?: {
          css?: boolean;
          slots?: {
            canvas?: SlotCanvas['slot'][];
          };
        };
      };
      debug?: Debug;
    }
    interface Debug {
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
    }
    type Manifest = Omit<ManifestOriginal, 'dependences'> & {
      name: string;
      version: string;
      dependences: SimpleDepSpace.DepModel[];
    };
  }
}

export {};
