import { render } from '@simple-data-open/min-dom';

import { App, ButtonUmount, counter } from './app.tsx';
import { setupCounter } from './counter.ts';

import './style.css';

const unmountApp = render(App, document.querySelector<HTMLDivElement>('#app')!);

const unmountButton = render(
  () =>
    ButtonUmount({
      onClick: () => {
        unmountApp();
        unmountButton();
      },
    }),
  document.querySelector<HTMLDivElement>('#app')!,
);

setupCounter(counter.element);
