import { Chart } from '@antv/g2';
import {
  WidgetAdapter,
  WidgetAdapterInterface,
  WidgetAdapterOptions,
} from '@simple-data-open/adapter';

import { generateWidgetCustomizeData } from './customize';
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

export const mapCustomizeData = (name: string) => {
  return {
    widget: generateWidgetCustomizeData,
  }[name];
};

const data = [
  { letter: 'A', frequency: 0.08167 },
  { letter: 'B', frequency: 0.01492 },
  { letter: 'C', frequency: 0.02782 },
  { letter: 'D', frequency: 0.04253 },
  { letter: 'E', frequency: 0.12702 },
  { letter: 'F', frequency: 0.02288 },
  { letter: 'G', frequency: 0.02015 },
  { letter: 'H', frequency: 0.06094 },
  { letter: 'I', frequency: 0.06966 },
  { letter: 'J', frequency: 0.00153 },
  { letter: 'K', frequency: 0.00772 },
  { letter: 'L', frequency: 0.04025 },
  { letter: 'M', frequency: 0.02406 },
  { letter: 'N', frequency: 0.06749 },
  { letter: 'O', frequency: 0.07507 },
  { letter: 'P', frequency: 0.01929 },
  { letter: 'Q', frequency: 0.00095 },
  { letter: 'R', frequency: 0.05987 },
  { letter: 'S', frequency: 0.06327 },
  { letter: 'T', frequency: 0.09056 },
  { letter: 'U', frequency: 0.02758 },
  { letter: 'V', frequency: 0.00978 },
  { letter: 'W', frequency: 0.0236 },
  { letter: 'X', frequency: 0.0015 },
  { letter: 'Y', frequency: 0.01974 },
  { letter: 'Z', frequency: 0.00074 },
];
const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart.interval().data(data).encode('x', 'letter').encode('y', 'frequency');

chart.render();
