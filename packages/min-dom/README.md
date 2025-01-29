## Usage

[example](../../examples/min-dom/)

### tsconfig.json

```tsconfig.json
{
  "compilerOptions": {
    // ...
    "jsx": "react-jsx",
    "jsxImportSource": "@simple-data-open/min-dom",
    "types": ["@simple-data-open/min-dom"]
    // ...
  }
}
```

```tsx
// app.tsx
import typescriptLogo from './typescript.svg';
import viteLogo from '/vite.svg';

export const counter = <button type="button"></button>;

const logo = (
  <a href="https://vite.dev" target="_blank">
    <img src={viteLogo} class="logo" alt="Vite logo" />
  </a>
);

export const app = (
  <>
    {logo}
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src={typescriptLogo} class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">{counter}</div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </>
);
```

```ts
// main.ts
import './app.tsx';
import { app, counter } from './app.tsx';
import { setupCounter } from './counter.ts';

import './style.css';

document.querySelector<HTMLDivElement>('#app')!.appendChild(app.element);

setupCounter(counter.element);
```
