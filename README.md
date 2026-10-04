# Memory Game

A classic memory card game: flip two cards at a time, remember where the images are and find all the matching pairs in as few moves as possible. The space-themed cards are drawn as local SVG images.

## Features

- 16 cards: 8 different images, each appears twice.
- The deck is shuffled (Fisher–Yates) on page load and on every new game.
- Counters for moves and found pairs.
- The board is blocked while a non-matching pair is shown (about 1 second), then both cards flip back.
- New Game without reloading the page, at any moment of the game.
- Victory modal with the total number of moves.
- Leaderboard with the top 10 results (place, moves, date), stored in `localStorage`.
- Responsive layout (checked from 320px wide screens up to desktop).
- Keyboard accessible: Tab, Enter and Space, visible focus, accessible card names, a focus-trapping modal dialog.

## How to play

1. The game starts automatically with all cards face down.
2. Click a card, then another one. Opening two cards counts as one move.
3. If the images match, the pair stays open and the pairs counter grows.
4. If they differ, both cards are shown for about a second and then flip back. Other cards cannot be opened in the meantime.
5. Find all 8 pairs to win. The result is added to the leaderboard.
6. Use **New Game** to start over and **Leaderboard** to see the best results. Modals close with the Close button, the Escape key or a click on the dimmed background.

## Technologies

- HTML5
- CSS3
- JavaScript (ES Modules), no frameworks or libraries
- `localStorage` for the leaderboard

The page markup is created entirely with JavaScript (`document.createElement`); `index.html` contains only a `<script>` in its `<body>`.

## Running locally

ES Modules are not loaded from `file://`, so serve the project over HTTP:

```bash
git clone https://github.com/JuliaMichaela/memory-game.git
cd memory-game
git checkout memory-game
python3 -m http.server 8000
```

Then open <http://localhost:8000> in your browser.

## Deployment

Deployment link will be added after GitHub Pages setup.

## Project structure

```
index.html          page shell (empty body with one script)
assets/images/      8 SVG card images
src/
  main.js           application entry point, wires everything together
  game.js           game state and rules (no DOM)
  deck.js           deck creation
  shuffle.js        Fisher–Yates shuffle
  cards-data.js     card data (id, name, image path)
  render.js         DOM rendering helpers
  modal.js          shared modal dialog
  results.js        leaderboard storage in localStorage
  dom.js            createElement helper
styles/             CSS files
```
