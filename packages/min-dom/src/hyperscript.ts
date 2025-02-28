import type { JSX } from '../types/jsx.d.ts';

import { svgTags } from './svg';

const __H__ = Symbol.for('hyperscript');

function transformListener(input: string): string {
  // 移除 'on' 前缀
  const withoutOn = input.startsWith('on') ? input.slice(2) : input;

  // 将第一个字符转换为小写
  const firstCharLower = withoutOn.charAt(0).toLowerCase() + withoutOn.slice(1);

  // 将剩余的大写字母转换为 "-" 加上小写字母
  const transformed = firstCharLower.replace(
    /[A-Z]/g,
    match => `-${match.toLowerCase()}`,
  );

  return transformed;
}

// 判断 child 是否为 IntrinsicElement
function isIntrinsicElement(
  child: any,
): child is JSX.IntrinsicElement<keyof JSX.IntrinsicElements> {
  return child && child.__H__ === __H__;
}

// h 函数：创建元素
export function hyperscript<K extends keyof JSX.IntrinsicElements>(
  tag: K | JSX.HyperscriptFunc<K>,
  props: JSX.IntrinsicElements[K],
): JSX.IntrinsicElement<K> {
  if (typeof tag === 'function') {
    // 函数调用
    return tag(props);
  }

  let element: HTMLElement | SVGElement;
  // if (tag === 'Fragment') {
  //   element = document.createDocumentFragment();
  // } else
  if (svgTags.has(tag as string)) {
    element = document.createElementNS(
      'http://www.w3.org/2000/svg',
      tag as string,
    ) as SVGElement;
  } else {
    element = document.createElement(tag as string) as HTMLElement;
  }

  // 设置属性
  if (props) {
    for (const key in props) {
      if (key === 'children') continue;

      if (key.startsWith('on') && typeof props[key] === 'function') {
        // 事件绑定
        element.addEventListener(
          transformListener(key),
          props[key] as EventListener,
        );
      } else if (key in element) {
        if (key === 'style') {
          // 处理 style 属性
          if (typeof props[key] !== 'string') {
            for (const styleKey in props[key]) {
              (element.style as any)[styleKey] = props[key][styleKey];
            }
            continue;
          }
          element.style.cssText = props[key] as string;
          continue;
        }
        if (typeof props[key] === 'undefined') {
          delete props[key];
          continue;
        }
        // 普通属性
        (element as any)[key] = props[key];
      } else {
        if (typeof props[key] === 'undefined') {
          element.removeAttribute(key);
        }
        // 自定义属性
        element.setAttribute(key, props[key] as string);
      }
    }
  }
  const isChildNode = (child: any) => typeof child !== 'undefined';

  function appendChild(element: HTMLElement | SVGElement, children: any) {
    // 添加子节点
    if (Array.isArray(children)) {
      children.forEach(child => {
        if (Array.isArray(child)) {
          appendChild(element, child);
          return;
        }

        if (!isChildNode(child)) return;

        element.appendChild(toNode(child));
      });
    } else if (isChildNode(children)) {
      element.appendChild(toNode(children));
    }
  }

  appendChild(element, props.children);

  return {
    element: element as K extends keyof JSX.IntrinsicSVGElements
      ? SVGElement
      : HTMLElement,
    attr(attr, value) {
      if (typeof value === 'undefined')
        return element.getAttribute(attr as string);
      element.setAttribute(attr as string, value as string);
      return value as string;
    },
    on: element.addEventListener.bind(element),
    off: element.removeEventListener.bind(element),
    remove: () => {
      for (const key in props) {
        if (key.startsWith('on') && typeof props[key] === 'function') {
          element.removeEventListener(
            transformListener(key),
            props[key] as EventListener,
          );
        }
      }
      element.remove();
      // @ts-expect-error: element is null
      element = null;
    },
    style: (style: Partial<CSSStyleDeclaration>) => {
      Object.assign(element.style, style);
    },
    __H__,
  };
}

// 将子节点转换为 DOM 节点
function toNode(child: any): Node {
  if (typeof child === 'undefined' || child === null)
    return document.createComment(String(child));

  if (isIntrinsicElement(child)) return child.element;

  if (child instanceof Node) return child;

  if (typeof child === 'string' || typeof child === 'number')
    return document.createTextNode(String(child));

  return document.createTextNode(String(child));
}
