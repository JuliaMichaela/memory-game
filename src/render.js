import { createElement } from './dom.js';

export function createHeader() {
  return createElement('header', { className: 'header' }, [
    createElement('h1', { className: 'header__title', text: 'Memory Game' }),
    createElement('div', { className: 'header__actions' }, [
      createElement('button', {
        className: 'button button--primary',
        text: 'New Game',
        attrs: { type: 'button' },
      }),
      createElement('button', {
        className: 'button',
        text: 'Leaderboard',
        attrs: { type: 'button' },
      }),
    ]),
  ]);
}

function createStat(label, value) {
  return createElement('p', { className: 'stat' }, [
    createElement('span', { className: 'stat__label', text: `${label}:` }),
    createElement('span', { className: 'stat__value', text: value }),
  ]);
}

export function createStats(totalPairs) {
  return createElement('div', { className: 'stats' }, [
    createStat('Moves', '0'),
    createStat('Pairs', `0 / ${totalPairs}`),
  ]);
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

export function createBoard(deck) {
  return createElement(
    'div',
    { className: 'board' },
    deck.map((card) => createCard(card)),
  );
}
