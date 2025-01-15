export interface ExtensionAdapterOptions {
  instance: string;
  name: string;
  container: HTMLElement;
}

export class ExtensionAdatpter {
  public instance: string;
  public name: string;
  public container: HTMLElement;

  constructor(options: ExtensionAdapterOptions) {
    this.instance = options.instance;
    this.name = options.name;
    this.container = options.container;
  }
}

export class ExtensionAdapterInterface {
  public mount = () => {};
  public unmount = () => {};
  public onLangChange? = (_lang: string) => {};
}

export class WidgetBase
  extends ExtensionAdatpter
  implements ExtensionAdapterInterface
{
  constructor(options) {
    super(options);
  }
  public mount = () => {};
  public unmount = () => {};
}
