import { MockHTMLElement } from '@stencil/core/mock-doc';

global.MutationObserver = class {
  // @ts-ignore
  constructor(callback) {}

  disconnect() {}

  // @ts-ignore
  observe(element, initObject) {}

  takeRecords() {
    return [];
  }
};

global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// @ts-expect-error - HTMLSlotElement does not exist without a DOM environment,
//  thus type-checking with `instanceof HTMLSlotElement` throws a ReferenceError without this mock
global.HTMLSlotElement = class {};

// The focus method is not available on MockHTMLElements in tests, so we provide it manually.
// Also see https://github.com/ionic-team/stencil/issues/1964#issuecomment-722344630
Object.defineProperty(MockHTMLElement.prototype, 'focus', {
  value: jest.fn(),
  configurable: true,
  writable: true,
});
