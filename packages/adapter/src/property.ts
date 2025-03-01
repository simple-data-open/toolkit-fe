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
  container: HTMLElement;
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

  /**
   * 可选的属性值变化回调函数，当属性值变化时调用
   * @param chain - 属性链
   * @param value - 新的属性值
   *
   * @return {boolean} 是否阻止默认 property renderer 重新渲染
   */
  onValueChange?: (
    chain: SimpleModifier.ChainType,
    value: any,
  ) => boolean | undefined;
}

export class PropertyAdapter implements PropertyAdapterInterface {
  public instance: string;
  public name: string;
  public container: HTMLElement;
  public rerender?: () => void;
  /**
   * 创建 PropertyAdapter 的实例
   * @param {PropertyAdapterOptions} options - 适配器的配置选项
   * @prop {string} instance - 适配器的实例名称
   * @prop {string} name - 适配器的名称
   * @prop {HTMLElement} container - 适配器的容器元素
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

  public onValueChange = (_chain: SimpleModifier.ChainType, _value: any) => {
    return false;
  };
}

/************* BLOCK: PropertyAdapter end *************/

/************* BLOCK: PropertyRenderer start *************/

interface InherentRenderPosition {
  name: 'position';
}
interface InherentRenderLayout {
  name: 'layout';
}
interface InherentRenderColor {
  name: 'color';
}
interface InherentRenderText {
  name: 'text';
  options?: {
    minlength?: number;
    maxlength?: number;
  };
}
interface InherentRenderNumber {
  name: 'number';
  options?: {
    min?: number;
    max?: number;
    step?: number;
    decimal?: number;
  };
}
interface InherentRenderOpacity {
  name: 'opacity';
}
interface InherentRenderBorder {
  name: 'border';
}
interface InherentRenderData {
  name: 'data';
}
interface InherentRenderSelect {
  name: 'select';
  options?: {
    options?: {
      label: string | number;
      value: string | number;
    }[];
  };
}

type InherentRender =
  | InherentRenderPosition
  | InherentRenderLayout
  | InherentRenderColor
  | InherentRenderText
  | InherentRenderNumber
  | InherentRenderOpacity
  | InherentRenderBorder
  | InherentRenderData
  | InherentRenderSelect;

/**
 * 渲染类型，可以是 'axis'、'size' 或 PropertyRenderer 类型
 */
export type Render =
  | InherentRender['name']
  | InherentRender
  | typeof PropertyRenderer;

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
 * 属性基础模型接口，包含名称、链和跨度
 */
export interface PropertyRendererModel {
  chains: SimpleModifier.ChainType[];
  name?: string;
  span?: 1 | 2 | 3 | 4;
  placeholder?: string;
  defaultValue?: PropertyValueType;
  options?: any;
}

/**
 * 属性渲染器选项接口，继承自属性基础模型，包含容器、值和更新函数
 */
export interface PropertyRendererOptions extends PropertyRendererModel {
  pageId: string;
  widgetId: string;
  container: HTMLElement;
  values: PropertyValueType;
  update: (
    chain: SimpleModifier.ChainType,
    value: PropertyValueType,
  ) => boolean;
}

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
export class PropertyRenderer<T = any, O = any> {
  public pageId: string;
  public widgetId: string;
  public container: HTMLElement;
  public name?: string;
  public chains: SimpleModifier.ChainType[];
  public span: 1 | 2 | 3 | 4;
  public values: T;
  public options?: O;
  public update: (
    chain: SimpleModifier.ChainType,
    value: PropertyValueType,
  ) => boolean;

  /**
   * 构造函数，初始化属性渲染器
   *
   * @param options - 属性渲染器选项
   */
  constructor(options: PropertyRendererOptions) {
    this.pageId = options.pageId;
    this.widgetId = options.widgetId;
    this.container = options.container;
    this.name = options.name;
    this.chains = options.chains;
    this.span = options.span || 4;
    this.values = options.values as T;
    this.options = options.options;
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
    chain: SimpleModifier.ChainType;
    value: any;
  }): boolean => {
    let hasChange = false;
    this.chains.forEach((_chain, index) => {
      if (_chain.join(',') === chain.join(',')) {
        this.values[index] = value;
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
  public onValueChange = (data: {
    chain: SimpleModifier.ChainType;
    value: any;
  }) => {
    this.changeValue(data);
  };
}

/************* BLOCK: PropertyRenderer start *************/
