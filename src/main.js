import { CARDS_DATA } from './cards-data.js';
import { createDeck } from './deck.js';
import { createElement } from './dom.js';
import { createBoard, createHeader, createStats } from './render.js';

function init() {
  const app = createElement('div', { className: 'app' }, [
    createHeader(),
    createElement('main', { className: 'main' }, [
      createStats(CARDS_DATA.length),
      createBoard(createDeck()),
    ]),
  ]);
  document.body.append(app);
}

init();
