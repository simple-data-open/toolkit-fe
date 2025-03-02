import './dep.d.ts';

declare global {
  namespace SimpleExtSpace {
    type Slot = 'widget' | 'property';

    interface ManifestOriginal {
      icon?: string;
      engines: {
        connector: 'v1';
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

    interface WidgetBorder {
      width: number;
      color: string;
      style:
        | 'none'
        | 'solid'
        | 'dashed'
        | 'dotted'
        | 'double'
        | 'groove'
        | 'ridge'
        | 'inset'
        | 'outset';
    }

    type DatasourceType = 'custom' | 'locale' | 'api' | 'database';

    type DatasourceColumn = {
      field: string;
      type:
        | 'text'
        | 'numeric'
        | 'date'
        | 'checkbox'
        | 'dropdown'
        | 'autocomplete'
        | 'password'
        | 'time'
        | 'color'
        | 'custom';
      width: number;
    };

    interface Widget<T = any> {
      schema: string;
      extension: {
        name: string;
        version: string;
      };
      id: string;
      name: string;
      rotation: number;
      hide: boolean;
      background: string;
      position: {
        /** 固定定位 */
        fixed: boolean;
        axis: [number, number];
      };
      layout: {
        /** 固定宽高比例 */
        fixed: boolean;
        size: [number, number];
      };
      appearance: {
        opacity: number;
        radius: number | number[];
      };
      border: WidgetBorder | WidgetBorder[];
      custom_data: T;
      datasource: {
        // 暂时仅支持 custom | locale 数据源
        source: DatasourceType;
        columns: DatasourceColumn[];
        data: Record<string, any>[];
      };
    }
    type WidgetCover = Partial<
      Pick<
        Widget,
        | 'name'
        | 'rotation'
        | 'hide'
        | 'background'
        | 'position'
        | 'layout'
        | 'appearance'
        | 'border'
        | 'datasource'
      >
    >;
  }
}

export {};
