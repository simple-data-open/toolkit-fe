import type { JSX } from '../types/jsx.d.ts';

export function render(
  component: () => JSX.Element | JSX.Element[],
  container: HTMLElement,
) {
  const element = component();

  const components: JSX.Element[] = [];

  if (Array.isArray(element)) {
    components.push(...element);
  } else {
    components.push(element);
  }
  for (const component of components) {
    container.appendChild(component.element);
  }

  return () => {
    for (const component of components) {
      component.remove();
    }
  };
}
