import { CARDS_DATA } from './cards-data.js';
import { shuffle } from './shuffle.js';

/**
 * Builds a shuffled deck: every item of the source data appears twice.
 * Cards of one pair share pairId; every card has a unique instanceId.
 */
export function createDeck(cardsData = CARDS_DATA) {
  const cards = cardsData.flatMap((item) =>
    [1, 2].map((copy) => ({
      instanceId: `${item.pairId}-${copy}`,
      pairId: item.pairId,
      name: item.name,
      image: item.image,
    })),
  );

  return shuffle(cards);
}
