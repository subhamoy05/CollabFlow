import '@testing-library/jest-dom';

// Polyfill window.matchMedia for jsdom tests
if (typeof window !== 'undefined') {
  window.matchMedia = window.matchMedia || function (query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: function () {},
      removeListener: function () {},
      addEventListener: function () {},
      removeEventListener: function () {},
      dispatchEvent: function () {
        return false;
      }
    };
  };

  // Polyfill IntersectionObserver for jsdom tests
  window.IntersectionObserver = window.IntersectionObserver || class {
    constructor(callback) {
      this.callback = callback;
    }
    observe(node) {
      this.callback([{ isIntersecting: true, target: node }]);
    }
    unobserve() {}
    disconnect() {}
  };
}
