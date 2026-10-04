import { CARDS_DATA } from './cards-data.js';
import { createDeck } from './deck.js';
import { createElement } from './dom.js';
import { createGame } from './game.js';
import { createBoard, createHeader, createStats, updateCard, updateStats } from './render.js';

function init() {
  const deck = createDeck();
  const stats = createStats(CARDS_DATA.length);
  const board = createBoard(deck);

  const cardElements = new Map(
    [...board.children].map((element) => [element.dataset.instanceId, element]),
  );

  const game = createGame(deck, {
    onChange(changedIds) {
      changedIds.forEach((id) => updateCard(cardElements.get(id), game.getCard(id), game.getStatus(id)));
      updateStats(stats, game.state);
    },
  });

  board.addEventListener('click', (event) => {
    const cardElement = event.target.closest('.card');
    if (cardElement) {
      game.selectCard(cardElement.dataset.instanceId);
    }
  });

  document.body.append(
    createElement('div', { className: 'app' }, [
      createHeader(),
      createElement('main', { className: 'main' }, [stats, board]),
    ]),
  );
}

init();
