import { JSX } from '@simple-data-open/min-dom/jsx-runtime';

import typescriptLogo from './typescript.svg';
import viteLogo from '/vite.svg';

export const counter = <button type="button"></button>;

const handleClick = () => console.log('click');

counter.on('click', handleClick);

counter.on('dblclick', () => {
  counter.off('click', handleClick);
});

export const ButtonUmount = (props: { onClick: () => void }) => (
  <button type="button" onclick={props.onClick}>
    Unmount
  </button>
);

const Logo = (props: { href: string }) => (
  <a href={props.href} target="_blank" min:query="QUERY_IDENTIFIER">
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

const MemoryLeak = () => {
  let nodes: JSX.Element[] = [];
  const btnInsert = <button onclick={handleInsert}>Insert</button>;
  const btnClear = <button onclick={handleClear}>Clear</button>;

  function handleInsert() {
    Array.from({ length: 1000 }).forEach((_, index) => {
      const node = <div data-index={index}>node - {index}</div>;
      nodes.push(node);
      root.element.appendChild(node.element);
    });
  }

  function handleClear() {
    nodes.forEach(node => {
      node.remove();
    });
    nodes = [];
  }

  const root = (
    <div>
      {btnInsert}
      {btnClear}
      <br />
    </div>
  );

  return root;
};

const QueryTest = () => {
  const root = (
    <div>
      <button
        onclick={() => {
          const element = root.query('QUERY_ELEMENT');
          element.attr('data-time', Date.now());
          element.text(`Query Element ${Date.now()}`);
          element.style({
            // 随机背景
            background: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
          });
        }}
      >
        query and update
      </button>
      <div min:query="QUERY_ELEMENT">Query Element {Date.now()}</div>
    </div>
  );
  return root;
};

const QueryListTest = () => {
  const list = [
    {
      name: 'Vite',
      version: '2.9.1',
      content: `content ${Date.now()}`,
    },
    {
      name: 'TypeScript',
      version: '4.6.2',
      content: `content ${Date.now()}`,
    },
  ];

  const root = (
    <div>
      <button
        onclick={() => {
          const queries = root.queryAll('QUERY_LIST_ITEM');
          queries.attr(index => {
            return {
              'data-index': index,
              style: {
                backgroundColor: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
              },
            };
          });
          const contents = root.queryAll('QUERY_LIST_CONTENT');
          contents.text(index => {
            return `index: ${index}, content ${Date.now()}`;
          });
          contents.style(() => {
            return {
              color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
            };
          });
        }}
      >
        query list and update
      </button>
      <ul>
        {list.map(item => (
          <li min:query="QUERY_LIST_ITEM">
            <span>{item.name} </span>
            <span>{item.version}</span>
            <br />
            <span min:query="QUERY_LIST_CONTENT">{item.content}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return root;
};

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
    <br />
    <QueryTest />
    <br />
    <QueryListTest />
    <br />
    <MemoryLeak />
  </>
);
