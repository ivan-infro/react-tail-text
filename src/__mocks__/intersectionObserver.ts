const observe = jest.fn();
const unobserve = jest.fn();

Object.defineProperty(window, "IntersectionObserver", {
  value: jest.fn().mockImplementation(() => ({
    observe,
    unobserve,
  })),
});
