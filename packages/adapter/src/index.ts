/* widget adapter */

export interface WidgetAdapterOptions {
  instance: string;
  name: string;
  container: HTMLElement;
}

export interface WidgetAdapterInterface {
  mount: () => void;
  unmount: () => void;
  onLangChange?: (_lang: string) => void;
}

export class WidgetAdapter implements WidgetAdapterInterface {
  public instance: string;
  public name: string;
  public container: HTMLElement;

  /**
   * 创建 WidgetAdapter 的实例。
   * @param {WidgetAdapterOptions} options - 适配器的配置选项。
   * @prop {string} instance - 小部件的实例标识符。
   * @prop {string} name - 小部件的名称。
   * @prop {HTMLElement} container - 包含小部件的 DOM 元素。
   */
  constructor(options: WidgetAdapterOptions) {
    this.instance = options.instance;
    this.name = options.name;
    this.container = options.container;
  }

  public mount = () => {};
  public unmount = () => {};
}

/* property adapter */

export interface PropertyAdapterOptions {
  instance: string;
  name: string;
  container: HTMLElement;
  reload?: () => void;
}

export interface PropertyAdapterInterface {
  mount: () => void;
  unmount: () => void;
  reload?: () => void;
  onLangChange?: (_lang: string) => void;
}

export class PropertyAdapter implements PropertyAdapterInterface {
  public instance: string;
  public name: string;
  public container: HTMLElement;
  public reload?: () => void;
  /**
   * 创建 PropertyAdapter 的实例。
   * @param {PropertyAdapterOptions} options - 适配器的配置选项。
   * @prop {string} instance - 适配器的实例名称。
   * @prop {string} name - 适配器的名称。
   * @prop {HTMLElement} container - 适配器的容器元素。
   */
  constructor(options: PropertyAdapterOptions) {
    this.instance = options.instance;
    this.name = options.name;
    this.container = options.container;
    this.reload = options.reload;
  }

  public mount = () => {};
  public unmount = () => {};
}
