import { createElement } from './dom.js';

export function createHeader({ onNewGame, onLeaderboard } = {}) {
  const newGameButton = createElement('button', {
    className: 'button button--primary',
    text: 'New Game',
    attrs: { type: 'button' },
  });
  newGameButton.addEventListener('click', () => onNewGame?.());

  const leaderboardButton = createElement('button', {
    className: 'button',
    text: 'Leaderboard',
    attrs: { type: 'button' },
  });
  leaderboardButton.addEventListener('click', () => onLeaderboard?.(leaderboardButton));

  return createElement('header', { className: 'header' }, [
    createElement('h1', { className: 'header__title', text: 'Memory Game' }),
    createElement('div', { className: 'header__actions' }, [
      newGameButton,
      leaderboardButton,
    ]),
  ]);
}

function createStat(name, label, value) {
  const valueElement = createElement('span', { className: 'stat__value', text: value });
  valueElement.dataset.stat = name;

  return createElement('p', { className: 'stat' }, [
    createElement('span', { className: 'stat__label', text: `${label}:` }),
    valueElement,
  ]);
}

export function createStats(totalPairs) {
  return createElement('div', { className: 'stats' }, [
    createStat('moves', 'Moves', '0'),
    createStat('pairs', 'Pairs', `0 / ${totalPairs}`),
  ]);
}

export function updateStats(statsElement, { moves, pairs, totalPairs }) {
  statsElement.querySelector('[data-stat="moves"]').textContent = String(moves);
  statsElement.querySelector('[data-stat="pairs"]').textContent = `${pairs} / ${totalPairs}`;
}

/** Syncs one card element with its game status (class + accessible name). */
export function updateCard(element, card, status) {
  const isOpened = status === 'opened';
  const isMatched = status === 'matched';

  element.classList.toggle('opened', isOpened);
  element.classList.toggle('matched', isMatched);

  if (isMatched) {
    element.setAttribute('aria-label', `${card.name}, matched`);
    element.setAttribute('aria-disabled', 'true');
  } else {
    element.setAttribute('aria-label', isOpened ? card.name : 'Hidden card');
    element.removeAttribute('aria-disabled');
  }
}

export function createCard(card) {
  const back = createElement('span', { className: 'card__face card__face--back' });
  const front = createElement('span', { className: 'card__face card__face--front' }, [
    createElement('img', {
      className: 'card__image',
      attrs: { src: card.image, alt: '', draggable: 'false' },
    }),
  ]);

  const element = createElement(
    'button',
    {
      className: 'card',
      attrs: { type: 'button', 'aria-label': 'Hidden card' },
    },
    [back, front],
  );
  element.dataset.pairId = card.pairId;
  element.dataset.instanceId = card.instanceId;

  return element;
}

export function createCards(deck) {
  return deck.map((card) => createCard(card));
}

export function createBoard(deck) {
  return createElement('div', { className: 'board' }, createCards(deck));
}
