import {
  ExtensionAdapter,
  ExtensionAdapterInterface,
  ExtensionAdapterOptions,
} from '@simple-data-open/adapter';

import { generateWidgetCustomizeData } from './customize';
import { mount } from './widget';

export class WidgetExtension
  extends ExtensionAdapter
  implements ExtensionAdapterInterface
{
  constructor(options: ExtensionAdapterOptions) {
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

export const mapCustomizeData = (name: string) => {
  return {
    widget: generateWidgetCustomizeData,
  }[name];
};
