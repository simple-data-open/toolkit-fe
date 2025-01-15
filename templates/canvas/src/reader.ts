import {
  ExtensionAdapterInterface,
  ExtensionAdapterOptions,
  ExtensionAdatpter,
} from '@simple-data-open/adapter';

import { render } from 'solid-js/web';

import { Widget } from './widget';

export class WidgetExtension
  extends ExtensionAdatpter
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

export const mapSlots = (
  slot: SimpleExtSpace.SlotCanvas | SimpleExtSpace.SlotShare,
) => {
  const views = {
    canvas: {
      widget: WidgetExtension,
    },
  };

  const _slot = views[slot.view]?.[slot.slot];

  if (_slot) {
    console.error(`Miss slot ${slot.view} ${slot.slot}`);
  }

  return _slot;
};
