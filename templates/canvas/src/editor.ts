import {
  ExtensionAdapterInterface,
  ExtensionAdatpter,
  Regist,
  RegistOptions,
} from '@simple-data-open/adapter';

import { render } from 'solid-js/web';

import { Widget } from './widget';

export class WidgetExtension
  extends ExtensionAdatpter
  implements ExtensionAdapterInterface
{
  private dispose: () => void = () => undefined;

  constructor(options) {
    super(options);
  }
  public mount = () => {
    this.dispose = render(Widget, this.container);
  };
  public unmount = () => {
    this.dispose();
  };
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
