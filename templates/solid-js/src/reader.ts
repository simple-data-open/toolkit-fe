import {
  ExtensionAdapter,
  ExtensionAdapterInterface,
  ExtensionAdapterOptions,
} from '@simple-data-open/adapter';

import { render } from 'solid-js/web';

import { Widget } from './widget';

export class WidgetExtension
  extends ExtensionAdapter
  implements ExtensionAdapterInterface
{
  private dispose: () => void = () => undefined;

  constructor(options: ExtensionAdapterOptions) {
    super(options);
  }
  public mount = () => {
    this.dispose = render(Widget, this.container);
  };
  public unmount = () => {
    this.dispose();
  };
}

export const mapSlots = (slot: SimpleExtSpace.Slot) => {
  const slots = {
    widget: WidgetExtension,
  };

  if (!slots[slot]) {
    console.error(`Miss slot ${slot}`);
  }

  return slots[slot];
};
