import { h } from './index';

function jsx(tag, props) {
  const { children, ...restProps } = props || {};
  return h(
    tag,
    restProps,
    ...(Array.isArray(children) ? children : [children]),
  );
}
const Fragment = (props: any, ...children: JSX.Child[]) => {
  return h('Fragment', props, ...children);
};

export { jsx, jsx as jsxs, jsx as jsxDEV, Fragment };
