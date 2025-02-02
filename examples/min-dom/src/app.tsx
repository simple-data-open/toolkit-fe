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
