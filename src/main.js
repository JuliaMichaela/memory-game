import { CARDS_DATA } from './cards-data.js';
import { createDeck } from './deck.js';
import { createElement } from './dom.js';
import { createGame } from './game.js';
import { createModal } from './modal.js';
import {
  createBoard,
  createCards,
  createHeader,
  createStats,
  updateCard,
  updateStats,
} from './render.js';

function init() {
  const modal = createModal();
  const stats = createStats(CARDS_DATA.length);
  const board = createBoard([]);
  const cardElements = new Map();

  const game = createGame(createDeck(), {
    onChange(changedIds) {
      changedIds.forEach((id) => updateCard(cardElements.get(id), game.getCard(id), game.getStatus(id)));
      updateStats(stats, game.state);
    },
  });

  // Replaces the cards inside the existing board; listeners stay on the board itself.
  function renderBoard() {
    const elements = createCards(game.state.deck);
    cardElements.clear();
    elements.forEach((element) => cardElements.set(element.dataset.instanceId, element));
    board.replaceChildren(...elements);
    updateStats(stats, game.state);
  }

  function startNewGame() {
    game.reset(createDeck());
    renderBoard();
  }

  function showLeaderboard(returnFocus) {
    modal.open({
      title: 'Leaderboard',
      content: createElement('p', { className: 'modal__text', text: 'No results yet' }),
      actions: [{ text: 'Close', primary: true }],
      returnFocus,
    });
  }

  board.addEventListener('click', (event) => {
    const cardElement = event.target.closest('.card');
    if (cardElement) {
      game.selectCard(cardElement.dataset.instanceId);
    }
  });

  renderBoard();

  document.body.append(
    createElement('div', { className: 'app' }, [
      createHeader({ onNewGame: startNewGame, onLeaderboard: showLeaderboard }),
      createElement('main', { className: 'main' }, [stats, board]),
    ]),
  );
}

init();
