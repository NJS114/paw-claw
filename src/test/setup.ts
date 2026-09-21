import '@testing-library/jest-dom/vitest';
import { beforeEach } from 'vitest';

beforeEach(()=>{
  localStorage.clear();
});

// jsdom has dialog elements but does not implement the native modal API.
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
}
