import {
  ExtensionAdapterInterface,
  ExtensionAdatpter,
  Regist,
  RegistOptions,
} from '@simple-data-open/adapter';

export class WidgetExtension
  extends ExtensionAdatpter
  implements ExtensionAdapterInterface
{
  constructor(options) {
    super(options);
  }
  public mount = () => {};
  public unmount = () => {};
}

export const resolveExtension = (regist: Regist) => {
  regist({
    view: 'canvas',
    slot: 'widget',
  });
};

export const mapSlotToComponent = (slot: RegistOptions['slot']) => {
  return {
    widget: WidgetExtension,
  }[slot];
};
