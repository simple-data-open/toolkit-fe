import typescriptLogo from './typescript.svg';
import viteLogo from '/vite.svg';

export const counter = <button type="button"></button>;

const handleClick = () => console.log('click');

counter.on('click', handleClick);

counter.on('dblclick', () => {
  console.log('dblclick');
  counter.off('click', handleClick);
});

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

const list = [
  {
    name: 'Vite',
    version: '2.9.1',
  },
  {
    name: 'TypeScript',
    version: '4.6.2',
  },
];

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
      {list.map(item => (
        <li>
          {item.name} {item.version}
        </li>
      ))}
    </p>
  </>
);
