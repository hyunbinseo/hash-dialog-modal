# hash-dialog-modal

Open and close [`<dialog>`] modals based on the URL hash value. A vanilla JavaScript library for all browsers and frameworks. [Demo]

[`<dialog>`]: https://developer.mozilla.org/docs/Web/HTML/Element/dialog
[Demo]: https://html.hyunbin.page/hash-dialog-modal

https://user-images.githubusercontent.com/47051820/223364228-0893dfe1-ef83-4cda-833d-bdace9bb3069.mp4

## Explanation

Assume a webpage with the following anchor elements.

```html
<a href="#1">#1</a>
<a href="#2">#2</a>
```

**The dialog will be opened if**

1. The page is initially loaded with the hash of `#1` or `#2`.
2. Hash change is triggered (e.g. clicking `<a href="#1">`).

**The dialog will be not open if**

- The page is requested with `#3`, since there are no `<a>` elements with the `href` value of `#3`. The URL hash is trimmed as well.

**The dialog will be closed if**

1. The `Escape` key is pressed (browser default).
2. `dialog.close()` is called using JavaScript.

**When the dialog is closed**

1. Hash is removed from the current URL using `history.pushState()`.
2. Corresponding `<a>` element is focused for keyboard accessibility.

**When the dialog is opened/closed**

- The `<body>` can have its `overflow` automatically set to `hidden/visible` to remove scroll from the `<body>`. Reference [options](#options).

## Usage

Import from [jsDelivr] - Vanilla JavaScript example

[jsdelivr]: https://www.jsdelivr.com/package/npm/hash-dialog-modal

```html
<a href="#1">#1</a>
<a href="#2">#2</a>

<dialog></dialog>

<script type="module">
  import { controlDialogWithUrlHash } from 'cdn-of-choice';

  // Select the dialog element.
  const dialog = document.querySelector('dialog');

  const updateDialogContent = () =>
    (dialog.textContent = `Current hash is '${window.location.hash}'`);

  updateDialogContent(); // Update the dialog content on initial load.

  // Dynamically update the dialog content based on the URL hash change.
  window.addEventListener('hashchange', updateDialogContent);

  // Pass the dialog element to the imported function.
  const { removeEventListeners } = controlDialogWithUrlHash(dialog, 'auto');

  // Remove all event listeners when needed.
  // - window.removeEventListener('hashchange', updateDialogContent);
  // - removeEventListeners();
</script>
```

Install from [npm] - Node.js and [SvelteKit] example

[npm]: https://www.npmjs.com/package/hash-dialog-modal
[SvelteKit]: https://kit.svelte.dev/

```svelte
<script lang="ts">
  import { controlDialogWithUrlHash } from 'hash-dialog-modal';
  import { onMount } from 'svelte';

  let dialogElement: HTMLDialogElement;
  let dialogContent: string;

  const updateDialogContent = () =>
    (dialogContent = `Current hash is '${window.location.hash}'`);

  onMount(() => {
    updateDialogContent();
    const { removeEventListeners } = controlDialogWithUrlHash(
      dialogElement,
      'auto'
    );
    return removeEventListeners;
  });
</script>

<svelte:window on:hashchange={updateDialogContent} />

<a href="#1">#1</a>
<a href="#2">#2</a>

<dialog bind:this={dialogElement}>{dialogContent}</dialog>
```

## Options

```typescript
export declare const controlDialogWithUrlHash: (
  dialog: HTMLDialogElement,
  overflow: 'auto' | 'manual', // sets the overflow style of the <body>
  options?: Partial<{
    onHashRemoval: () => void; // runs on dialog close and hash removal
  }>
) => {
  removeEventListeners: () => void; // removes all event listeners
};
```

## Advanced

What `overflow` auto is recommended.

```javascript
// Remove scroll from the <body> when the <dialog> is opened as a modal.
if (overflow === 'auto') document.body.style.overflow = 'hidden'; // handleHash
if (overflow === 'auto') document.body.style.overflow = 'visible'; // closeDialog
```

Why `onHashRemoval` callback should be provided.

```javascript
window.history.pushState(null, '', ' '); // Does not trigger on:hashchange event.
options.onHashRemoval?.(); // Therefore, the callback should be manually provided.
```
