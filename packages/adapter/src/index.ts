export interface ExtensionAdapterOptions {
  instance: string;
  name: string;
  container: HTMLElement;
}

export class ExtensionAdapter {
  public instance: string;
  public name: string;
  public container: HTMLElement;

  constructor(options: ExtensionAdapterOptions) {
    this.instance = options.instance;
    this.name = options.name;
    this.container = options.container;
  }
}

export interface ExtensionAdapterInterface {
  mount: () => void;
  unmount: () => void;
  onLangChange?: (_lang: string) => void;
}

export class WidgetBase
  extends ExtensionAdapter
  implements ExtensionAdapterInterface
{
  constructor(options) {
    super(options);
  }
  public mount = () => {};
  public unmount = () => {};
}
