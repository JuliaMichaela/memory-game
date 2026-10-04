export const STORAGE_KEY = 'memory-game:results';
export const MAX_RESULTS = 10;

/**
 * A result is { moves: number, completedAt: number } where completedAt is Date.now().
 * Lists are always ordered best first: fewer moves, then the earlier completedAt.
 */
function isValidResult(result) {
  return (
    typeof result === 'object' &&
    result !== null &&
    Number.isInteger(result.moves) &&
    result.moves > 0 &&
    Number.isFinite(result.completedAt)
  );
}

function sortAndTrim(results) {
  return results
    .sort((a, b) => a.moves - b.moves || a.completedAt - b.completedAt)
    .slice(0, MAX_RESULTS);
}

/** Reads the top results; a missing, corrupted or malformed value gives an empty/clean list. */
export function loadResults() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(parsed)) {
      return [];
    }
    const valid = parsed
      .filter(isValidResult)
      .map(({ moves, completedAt }) => ({ moves, completedAt }));
    return sortAndTrim(valid);
  } catch {
    return [];
  }
}

/** Adds one finished game to the stored top and returns the updated list. */
export function saveResult({ moves, completedAt = Date.now() }) {
  const results = sortAndTrim([...loadResults(), { moves, completedAt }]);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  } catch {
    // Storage may be full or blocked: the game keeps working without persistence.
  }

  return results;
}

/** DD.MM.YYYY, local date, no time. */
export function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${day}.${month}.${date.getFullYear()}`;
}
