'use strict';

const imageDialog = document.querySelector('#image-dialog');
const dialogImage = document.querySelector('#dialog-image');
const dialogCaption = document.querySelector('#image-dialog-caption');
let lastImageTrigger = null;

for (const trigger of document.querySelectorAll('[data-zoom]')) {
  trigger.addEventListener('click', () => {
    lastImageTrigger = trigger;
    dialogImage.src = trigger.dataset.zoom;
    dialogImage.alt = trigger.querySelector('img').alt;
    dialogCaption.textContent = trigger.dataset.caption;
    imageDialog.showModal();
    document.body.style.overflow = 'hidden';
  });
}

imageDialog.querySelector('.dialog-close').addEventListener('click', () => imageDialog.close());
imageDialog.addEventListener('click', (event) => {
  if (event.target !== imageDialog) return;
  const bounds = imageDialog.getBoundingClientRect();
  const outside = event.clientX < bounds.left || event.clientX > bounds.right ||
    event.clientY < bounds.top || event.clientY > bounds.bottom;
  if (outside) imageDialog.close();
});
imageDialog.addEventListener('close', () => {
  document.body.style.overflow = '';
  lastImageTrigger?.focus();
});

const copyButton = document.querySelector('#copy-citation');
const copyStatus = document.querySelector('#copy-status');
let copyResetTimeout;
copyButton.addEventListener('click', async () => {
  const bibtex = document.querySelector('#bibtex');
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(bibtex.textContent.trim());
    copyButton.querySelector('span').textContent = 'Copied';
    copyStatus.textContent = 'BibTeX copied to clipboard.';
    clearTimeout(copyResetTimeout);
    copyResetTimeout = setTimeout(() => {
      copyButton.querySelector('span').textContent = 'Copy BibTeX';
      copyStatus.textContent = '';
    }, 3000);
  } catch {
    const range = document.createRange();
    range.selectNodeContents(bibtex);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    copyStatus.textContent = 'BibTeX selected. Press Ctrl+C (or Command+C) to copy.';
  }
});
