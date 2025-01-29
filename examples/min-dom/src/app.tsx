import typescriptLogo from './typescript.svg';
import viteLogo from '/vite.svg';

export const counter = <button type="button"></button>;

const logo = (
  <a href="https://vite.dev" target="_blank">
    <img src={viteLogo} class="logo" alt="Vite logo" />
  </a>
);

setInterval(() => {
  const backgroundColor =
    `${Math.random().toString(16).replace('0.', '#')}`.slice(0, 7);
  counter.style({
    backgroundColor,
  });
}, 1000);

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
