import type { JSX } from '../types/jsx.d.ts';

import { h } from './index';

export type { JSX };

function jsx(tag, props) {
  return h(tag, props);
}

const Fragment = (props: { children: JSX.Child[] }) => {
  return props.children;
};

export { jsx, jsx as jsxs, jsx as jsxDEV, Fragment };
