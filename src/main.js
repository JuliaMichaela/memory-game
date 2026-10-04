import { createElement } from './dom.js';

function init() {
  const app = createElement('div', { className: 'app' });
  document.body.append(app);
}

init();
