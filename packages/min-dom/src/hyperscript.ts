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

      if (key.startsWith('min:')) {
        setupMinKey(element, key.slice(4), props[key]);
      } else if (key.startsWith('on') && typeof props[key] === 'function') {
        // 事件绑定
        element.addEventListener(
          transformListener(key),
          props[key] as EventListener,
        );
      } else {
        setupAtttrbiutes(element, key, props[key]);
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
    query<T extends Element = HTMLElement | SVGElement>(selector: string) {
      const scopeElement = element.querySelector<T>(
        `[data-min-query="${selector}"]`,
      );
      return {
        element: scopeElement,
        attr(key, value) {
          if (!scopeElement) {
            console.error(`query ${selector} not found`);
            return;
          }
          setupAtttrbiutes(scopeElement, key, value);
        },
        text(text?: string) {
          if (!scopeElement) {
            console.error(`query ${selector} not found`);
            return;
          }
          return setupText(scopeElement, text);
        },
        style(style: Partial<CSSStyleDeclaration>) {
          if (!scopeElement) {
            console.error(`query ${selector} not found`);
            return;
          }
          if (
            scopeElement instanceof HTMLElement ||
            scopeElement instanceof SVGElement
          ) {
            Object.assign(scopeElement.style, style);
          }
        },
      };
    },
    queryAll<T extends Element = HTMLElement | SVGElement>(selector: string) {
      const scopeElements = Array.from(
        element.querySelectorAll<T>(`[data-min-query="${selector}"]`),
      );
      return {
        elements: scopeElements,
        attr(cb: (index: number, scopeElement: T) => Record<string, any>) {
          scopeElements.forEach((scopeElement, index) => {
            Object.entries(cb(index, scopeElement)).forEach(([key, value]) => {
              setupAtttrbiutes(scopeElement, key, value);
            });
          });
        },
        text(cb: (index: number, scopeElement: T) => string) {
          scopeElements.forEach((scopeElement, index) => {
            setupText(scopeElement, cb(index, scopeElement));
          });
        },
        style(
          cb: (index: number, scopeElement: T) => Partial<CSSStyleDeclaration>,
        ) {
          scopeElements.forEach((scopeElement, index) => {
            if (
              scopeElement instanceof HTMLElement ||
              scopeElement instanceof SVGElement
            ) {
              Object.assign(scopeElement.style, cb(index, scopeElement));
            }
          });
        },
      };
    },
    text(text?: string) {
      if (typeof text === 'undefined') return element.textContent;

      element.textContent = text;

      return text;
    },
    attr(key: string, value: any) {
      setupAtttrbiutes(element, key, value);
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

// min:<key> 属性处理
function setupMinKey(
  element: HTMLElement | SVGElement,
  key: string,
  value: string,
): void {
  if (key === 'query') {
    element.setAttribute('data-min-query', value);
  }
}

function setupAtttrbiutes(element: Element, key: string, value: any): void {
  // 标准属性
  if (
    key === 'style' &&
    (element instanceof HTMLElement || element instanceof SVGElement)
  ) {
    // style 属性
    if (typeof value !== 'string') {
      Object.assign(element.style, value);
      return;
    }
    element.style.cssText = value as string;
    return;
  }
  // 仅支持 HTML 元素属性直接设置
  if (key in element && element instanceof HTMLElement) {
    if (typeof value === 'undefined') {
      // 删除属性
      delete element[key];
      return;
    }
    // 标准属性
    element[key] = value;
  } else {
    // 自定义属性
    if (typeof value === 'undefined') {
      element.removeAttribute(key);
    }
    // 自定义属性
    element.setAttribute(key, value as string);
  }
}

function setupText(element: Element, text?: string) {
  if (typeof text === 'undefined') return element.textContent;

  element.textContent = text;

  return text;
}
