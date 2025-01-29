import '../types/jsx.d.ts';
import { svgTags } from './svg';

type HyperscriptFunc<K extends keyof JSX.IntrinsicElements> = (
  props: JSX.IntrinsicElements[K] | null,
  ...children: JSX.Child[]
) => JSX.IntrinsicElement<K>;

const __H__ = Symbol.for('h');

// 判断 child 是否为 IntrinsicElement
function isIntrinsicElement(
  child: any,
): child is JSX.IntrinsicElement<keyof JSX.IntrinsicElements> {
  return child && child.__H__ === __H__;
}

// h 函数：创建元素
function hyperscript<K extends keyof JSX.IntrinsicElements>(
  tag: K | HyperscriptFunc<K>,
  props: JSX.IntrinsicElements[K] | null,
  ...children: JSX.Child[]
): JSX.IntrinsicElement<K> {
  if (typeof tag === 'function') {
    // 函数调用
    return tag(props, ...children);
  }

  let element;

  if (tag === 'Fragment') {
    element = document.createDocumentFragment();
  } else if (svgTags.has(tag as string)) {
    element = document.createElementNS(
      'http://www.w3.org/2000/svg',
      tag as string,
    );
  } else {
    element = document.createElement(tag as string);
  }

  // 设置属性
  if (props) {
    for (const key in props) {
      if (key === 'children') continue;

      if (key.startsWith('on') && typeof props[key] === 'function') {
        // 事件绑定
        element.addEventListener(
          key.slice(2).toLowerCase(),
          props[key] as EventListener,
        );
      } else if (key in element) {
        // 普通属性
        (element as any)[key] = props[key];
      } else {
        // 自定义属性
        element.setAttribute(key, props[key] as string);
      }
    }
  }

  // 添加子节点
  children.forEach(child => {
    if (Array.isArray(child)) {
      child.forEach(nestedChild => element.appendChild(toNode(nestedChild)));
    } else if (typeof child !== 'undefined') {
      element.appendChild(toNode(child));
    }
  });

  return {
    element,
    attr(attr, value) {
      if (typeof value === 'undefined')
        return element.getAttribute(attr as string);
      element.setAttribute(attr as string, value as string);
      return value as string;
    },
    remove: () => element.remove(),
    style: (style: Partial<CSSStyleDeclaration>) => {
      Object.assign(element.style, style);
    },
    __H__,
  };
}

// 将子节点转换为 DOM 节点
function toNode(child: any): Node {
  if (isIntrinsicElement(child)) return child.element;

  if (child instanceof Node) return child;

  if (typeof child === 'string' || typeof child === 'number')
    return document.createTextNode(String(child));

  return document.createTextNode(String(child));
}

export { hyperscript as h };
