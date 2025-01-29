import './app.tsx';
import { app, counter } from './app.tsx';
import { setupCounter } from './counter.ts';

import './style.css';

document.querySelector<HTMLDivElement>('#app')!.appendChild(app.element);

setupCounter(counter.element);
