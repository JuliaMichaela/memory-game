export const CARD_STATUS = Object.freeze({
  CLOSED: 'closed',
  OPENED: 'opened',
  MATCHED: 'matched',
});

export const MISMATCH_DELAY_MS = 1000;

/**
 * Game logic without any DOM: it only knows about cards and notifies
 * the outside world through callbacks.
 *
 * @param {Array<{instanceId: string, pairId: string}>} deck
 * @param {object} [callbacks]
 * @param {(changedIds: string[]) => void} [callbacks.onChange] cards (or counters) changed
 * @param {(result: {moves: number}) => void} [callbacks.onComplete] all pairs are found
 * @param {number} [callbacks.mismatchDelay] ms a mismatched pair stays visible
 */
export function createGame(deck, { onChange, onComplete, mismatchDelay = MISMATCH_DELAY_MS } = {}) {
  const cardsById = new Map(deck.map((card) => [card.instanceId, card]));

  const state = {
    deck,
    statuses: new Map(deck.map((card) => [card.instanceId, CARD_STATUS.CLOSED])),
    firstCard: null,
    locked: false,
    moves: 0,
    pairs: 0,
    totalPairs: deck.length / 2,
    mismatchTimerId: null,
    finished: false,
  };

  function notify(changedIds) {
    onChange?.(changedIds);
  }

  function closeMismatchedPair(firstId, secondId) {
    state.mismatchTimerId = null;
    state.statuses.set(firstId, CARD_STATUS.CLOSED);
    state.statuses.set(secondId, CARD_STATUS.CLOSED);
    state.locked = false;
    notify([firstId, secondId]);
  }

  function selectCard(instanceId) {
    const card = cardsById.get(instanceId);

    if (!card || state.finished || state.locked) {
      return;
    }
    if (state.statuses.get(instanceId) !== CARD_STATUS.CLOSED) {
      return;
    }

    state.statuses.set(instanceId, CARD_STATUS.OPENED);

    if (!state.firstCard) {
      state.firstCard = card;
      notify([instanceId]);
      return;
    }

    const first = state.firstCard;
    state.firstCard = null;
    state.moves += 1;

    if (first.pairId === card.pairId) {
      state.statuses.set(first.instanceId, CARD_STATUS.MATCHED);
      state.statuses.set(instanceId, CARD_STATUS.MATCHED);
      state.pairs += 1;
      state.finished = state.pairs === state.totalPairs;
      notify([first.instanceId, instanceId]);

      if (state.finished) {
        onComplete?.({ moves: state.moves });
      }
      return;
    }

    state.locked = true;
    state.mismatchTimerId = setTimeout(
      () => closeMismatchedPair(first.instanceId, instanceId),
      mismatchDelay,
    );
    notify([first.instanceId, instanceId]);
  }

  return {
    state,
    selectCard,
    getCard: (instanceId) => cardsById.get(instanceId),
    getStatus: (instanceId) => state.statuses.get(instanceId),
  };
}
