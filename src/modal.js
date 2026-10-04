import { createElement } from './dom.js';

const TITLE_ID = 'modal-title';
const SCROLL_LOCK_CLASS = 'scroll-locked';
const IDLE_TITLE = 'Dialog';

/**
 * Creates the one shared modal shell (a <dialog>) and appends it to the page.
 * Every modal of the app (leaderboard, victory) is shown through the returned `open`.
 *
 * open({ title, content, actions, initialFocus, returnFocus })
 *   title        string shown in the heading
 *   content      Node placed in the modal body (built by the caller)
 *   actions      [{ text, onClick?, primary? }]; without onClick a button just closes the modal
 *   initialFocus index of the action that gets focus on open (default 0)
 *   returnFocus  element to focus after closing (default: the element focused on open)
 * close()        closes the modal; also used for Escape and backdrop clicks
 *
 * <dialog>.showModal() makes the rest of the page inert (no mouse, no Tab) and
 * provides Escape; scroll lock and focus return are undone by `restorePage`, which runs
 * for every way of closing (close() directly, Escape via the `close` event).
 */
export function createModal() {
  // The heading is never empty: it holds a neutral text while the modal is closed.
  const title = createElement('h2', {
    className: 'modal__title',
    text: IDLE_TITLE,
    attrs: { id: TITLE_ID },
  });
  const body = createElement('div', { className: 'modal__body' });
  const actionsBar = createElement('div', { className: 'modal__actions' });
  const windowElement = createElement('div', { className: 'modal__window' }, [title, body, actionsBar]);
  const dialog = createElement('dialog', { className: 'modal', attrs: { 'aria-labelledby': TITLE_ID } }, [
    windowElement,
  ]);

  let returnFocusTarget = null;
  let pressStartedOnBackdrop = false;

  // Idempotent: safe to run twice (from close() and from the `close` event).
  // The late `close` event of a previous closing must not touch a modal opened since then.
  function restorePage() {
    if (dialog.open) {
      return;
    }

    document.body.classList.remove(SCROLL_LOCK_CLASS);
    title.textContent = IDLE_TITLE;
    body.replaceChildren();
    actionsBar.replaceChildren();

    if (returnFocusTarget?.isConnected) {
      returnFocusTarget.focus();
    }
    returnFocusTarget = null;
  }

  function close() {
    if (dialog.open) {
      dialog.close();
      restorePage();
    }
  }

  function open({ title: titleText, content, actions = [], initialFocus = 0, returnFocus } = {}) {
    if (dialog.open) {
      return;
    }

    title.textContent = titleText;
    body.replaceChildren(content);

    const buttons = actions.map(({ text, onClick, primary }) => {
      const button = createElement('button', {
        className: primary ? 'button button--primary' : 'button',
        text,
        attrs: { type: 'button' },
      });
      button.addEventListener('click', () => (onClick ? onClick() : close()));
      return button;
    });
    actionsBar.replaceChildren(...buttons);

    returnFocusTarget = returnFocus ?? document.activeElement;
    document.body.classList.add(SCROLL_LOCK_CLASS);
    dialog.showModal();
    body.scrollTop = 0;
    buttons[initialFocus]?.focus();
  }

  // Escape closes the dialog natively, without going through close().
  dialog.addEventListener('close', restorePage);

  // The <dialog> fills the viewport; only a press that starts and ends on it (not inside
  // the window, not a text selection dragged out of it) counts as a backdrop click.
  dialog.addEventListener('mousedown', (event) => {
    pressStartedOnBackdrop = event.target === dialog;
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog && pressStartedOnBackdrop) {
      close();
    }
    pressStartedOnBackdrop = false;
  });

  document.body.append(dialog);

  return { open, close, isOpen: () => dialog.open };
}
