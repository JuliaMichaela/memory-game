import { CARDS_DATA } from './cards-data.js';
import { createDeck } from './deck.js';
import { createElement } from './dom.js';
import { createGame } from './game.js';
import { createModal } from './modal.js';
import {
  createBoard,
  createCards,
  createHeader,
  createLeaderboardContent,
  createStats,
  createVictoryContent,
  updateCard,
  updateStats,
} from './render.js';
import { loadResults, saveResult } from './results.js';

function init() {
  const modal = createModal();
  const stats = createStats(CARDS_DATA.length);
  const board = createBoard([]);
  const cardElements = new Map();

  const header = createHeader({ onNewGame: startNewGame, onLeaderboard: showLeaderboard });
  const newGameButton = header.querySelector('[data-action="new-game"]');

  const game = createGame(createDeck(), {
    onChange(changedIds) {
      changedIds.forEach((id) => updateCard(cardElements.get(id), game.getCard(id), game.getStatus(id)));
      updateStats(stats, game.state);
    },
    // Called by the game exactly once per finished game.
    onComplete({ moves }) {
      saveResult({ moves });
      showVictory(moves);
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

  function showVictory(moves) {
    modal.open({
      title: 'Congratulations!',
      content: createVictoryContent(moves),
      actions: [
        {
          text: 'New Game',
          primary: true,
          onClick() {
            modal.close();
            startNewGame();
          },
        },
        { text: 'Close' },
      ],
      returnFocus: newGameButton,
    });
  }

  function showLeaderboard(returnFocus) {
    modal.open({
      title: 'Leaderboard',
      content: createLeaderboardContent(loadResults()),
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
      header,
      createElement('main', { className: 'main' }, [stats, board]),
    ]),
  );
}

init();
