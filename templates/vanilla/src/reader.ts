import {
  WidgetAdapter,
  WidgetAdapterInterface,
  WidgetAdapterOptions,
} from '@simple-data-open/adapter';

import { mount } from './widget';

export class WidgetExtension
  extends WidgetAdapter
  implements WidgetAdapterInterface
{
  constructor(options: WidgetAdapterOptions) {
    super(options);
  }
  public mount = () => {
    mount(this.container);
  };
  public unmount = () => {};
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
