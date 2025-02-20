export interface WidgetAdapterOptions<T = any> {
  /**
   * 小部件的实例标识符
   */
  instance?: T;
  /**
   * 小部件的名称
   */
  name: string;
  /**
   * 包含小部件的 DOM 元素
   */
  container: HTMLDivElement;
}

export interface WidgetAdapterInterface {
  /**
   * 将小部件挂载到其容器元素中
   */
  mount: () => void;
  /**
   * 从其容器元素中卸载小部件
   */
  unmount: () => void;
  /**
   * 可选的语言变化回调函数，当语言变化时调用
   * @param _lang - 新的语言代码
   */
  onLangChange?: (_lang: string) => void;
}

export class WidgetAdapter<T = any> implements WidgetAdapterInterface {
  public instance: SimpleExtSpace.Widget<T>;
  public name: string;
  public container: HTMLDivElement;

  /**
   * 创建 WidgetAdapter 的实例
   * @param {WidgetAdapterOptions} options - 适配器的配置选项
   * @prop {string} instance - 小部件的实例标识符
   * @prop {string} name - 小部件的名称
   * @prop {HTMLDivElement} container - 包含小部件的 DOM 元素
   */
  constructor(options: WidgetAdapterOptions) {
    this.instance = options.instance;
    this.name = options.name;
    this.container = options.container;
  }

  public mount = () => {};
  public unmount = () => {};

  public onLangChange?: (_lang: string) => void;
}
