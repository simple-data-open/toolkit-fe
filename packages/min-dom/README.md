## Usage

[example](../../examples/min-dom/)

### Profile

```json
// tsconfig.json
{
  "compilerOptions": {
    // ...
    "jsx": "preserve",
    "jsxImportSource": "@simple-data-open/min-dom"
    // ...
  }
}
```

```ts
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsxImportSource: '@simple-data-open/min-dom',
    jsx: 'automatic',
  },
});
```

```js
// webpack.config.js
{
  module: {
    rules: [
      {
        test: /\.tsx$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                [
                  '@babel/plugin-transform-react-jsx',
                  {
                    runtime: 'automatic',
                    importSource: '@simple-data-open/min-dom',
                  },
                ],
              ],
            },
          },
          'ts-loader',
        ],
      },
    ],
  }
}
```

```tsx
// app.tsx
import typescriptLogo from './typescript.svg';
import viteLogo from '/vite.svg';

export const counter = <button type="button"></button>;

export const ButtonUmount = (props: { onClick: () => void }) => (
  <button type="button" onclick={props.onClick}>
    Unmount
  </button>
);

const Logo = (props: { href: string }) => (
  <a href={props.href} target="_blank">
    <img src={viteLogo} class="logo" alt="Vite logo" />
  </a>
);

export const App = () => (
  <>
    <Logo href="https://vitejs.dev/" />
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
```
