declare global {
  namespace SimpleExtSpace {
    interface Manifest {
      name: string;
      version: string;
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
          css: boolean;
          views: 'canvas'[];
        };
        reader?: {
          css: boolean;
          views: 'canvas'[];
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
      };
    }
  }
}

export {};
