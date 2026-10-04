/**
 * Thin wrapper over document.createElement.
 * Every UI element in the app must be created through this helper.
 */
export function createElement(tag, { className, text, attrs = {} } = {}, children = []) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }
  if (text !== undefined) {
    element.textContent = text;
  }
  Object.entries(attrs).forEach(([name, value]) => {
    element.setAttribute(name, value);
  });
  element.append(...children);

  return element;
}
