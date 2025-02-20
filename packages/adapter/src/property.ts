/************* BLOCK: PropertyAdapter start *************/

export interface PropertyAdapterOptions {
  /**
   * 适配器的实例名称
   */
  instance: string;
  /**
   * 适配器的名称
   */
  name: string;
  /**
   * 适配器的容器元素
   */
  container: HTMLDivElement;
  /**
   * 可选的重新渲染函数，当适配器需要重新渲染时调用
   */
  rerender?: () => void;
}

export interface PropertyAdapterInterface<T = any> {
  /**
   * 挂载适配器到其容器元素中
   */
  mount: () => void;
  /**
   * 卸载适配器，清理其容器元素中的内容
   */
  unmount: () => void;
  /**
   * 可选的重新渲染函数，当适配器需要重新渲染时调用
   */
  rerender?: () => void;
  /**
   * 可选的语言变化回调函数，当语言变化时调用
   * @param lang - 新的语言代码
   */
  onLangChange?: (lang: string) => void;
  /**
   * 渲染适配器的属性组
   * @param widget - 部件实例数据
   *
   * @return {PropertyGroupModel[]} 属性组模型数组
   */
  render(widget: T): PropertyGroupModel[];
}

export class PropertyAdapter implements PropertyAdapterInterface {
  public instance: string;
  public name: string;
  public container: HTMLDivElement;
  public rerender?: () => void;
  /**
   * 创建 PropertyAdapter 的实例
   * @param {PropertyAdapterOptions} options - 适配器的配置选项
   * @prop {string} instance - 适配器的实例名称
   * @prop {string} name - 适配器的名称
   * @prop {HTMLDivElement} container - 适配器的容器元素
   */
  constructor(options: PropertyAdapterOptions) {
    this.instance = options.instance;
    this.name = options.name;
    this.container = options.container;
    this.rerender = options.rerender;
  }

  public mount = () => {};
  public unmount = () => {};

  public onLangChange?: (_lang: string) => void;

  public render = (_widget: any): PropertyGroupModel[] => [];
}

/************* BLOCK: PropertyAdapter end *************/

/************* BLOCK: PropertyRenderer start *************/

/**
 * 属性值类型，可以是字符串、数字、布尔值、空值、属性值类型的数组或对象
 */
export type PropertyValueType =
  | string
  | number
  | boolean
  | null
  | PropertyValueType[]
  | { [key: string | number]: PropertyValueType };

/**
 * 链类型，表示嵌套路径的字符串数组数组
 */
export type ChainType = string[][];

/**
 * 属性基础模型接口，包含名称、链和跨度
 */
export interface PropertyRendererModel {
  chain: ChainType;
  name?: string;
  span?: 1 | 2 | 3 | 4;
  placeholder?: string;
  defaultValue?: PropertyValueType;
  /** 暂时仅支持 min/max/minLength/maxLength */
  restrict?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    includePatterns?: RegExp[];
    excludePatterns?: RegExp[];
  };
}

/**
 * 属性渲染器选项接口，继承自属性基础模型，包含容器、值和更新函数
 */
export interface PropertyRendererOptions extends PropertyRendererModel {
  container: HTMLElement;
  value: PropertyValueType;
  update: (chain: string[], value: PropertyValueType) => boolean;
}

/**
 * 渲染类型，可以是 'axis'、'size' 或 PropertyRenderer 类型
 */
export type Render = 'position' | 'layout' | 'color' | typeof PropertyRenderer;

/**
 * 属性组模型接口，包含名称和属性数组
 */
export interface PropertyGroupModel {
  name?: string;
  unfold?: boolean;
  renderers: (PropertyRendererModel & { render: Render })[];
}

/**
 * 属性渲染器类，用于渲染属性
 */
export class PropertyRenderer<T = any> {
  public container: HTMLElement;
  public name?: string;
  public chain: ChainType;
  public span: 1 | 2 | 3 | 4;
  public value: T;
  public update: (chain: string[], value: PropertyValueType) => boolean;

  /**
   * 构造函数，初始化属性渲染器
   *
   * @param options - 属性渲染器选项
   */
  constructor(options: PropertyRendererOptions) {
    this.container = options.container;
    this.name = options.name;
    this.chain = options.chain;
    this.span = options.span || 4;
    this.value = options.value as T;
    this.update = options.update;
  }

  /**
   * 挂载渲染器
   */
  public mount = () => {};

  /**
   * 卸载渲染器
   */
  public unmount = () => {};

  /**
   * 通用 value 修改
   *
   * @param param0 - 包含链和值的对象
   * @return 是否有变化
   */
  public changeValue = ({
    chain,
    value,
  }: {
    chain: string[];
    value: any;
  }): boolean => {
    let hasChange = false;
    this.chain.forEach((_chain, index) => {
      if (_chain.join(',') === chain.join(',')) {
        this.value[index] = value;
        hasChange = true;
      }
    });
    return hasChange;
  };

  /**
   * 指定单一链修改 value
   *
   * @param data - 包含链和值的对象
   */
  public onValueChange = (data: { chain: string[]; value: any }) => {
    this.changeValue(data);
  };
}

/************* BLOCK: PropertyRenderer start *************/
