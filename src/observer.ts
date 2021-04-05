import { ResizeObserver as ResizeObserverPonyfill } from "@juggle/resize-observer";
import throttle from "lodash.throttle";
import {
  fulltextSelectedClassName,
  fulltextSelectListenerClassName,
} from "./constants";

let selectionChangeEventHandlerAdded = false;

const ResizeObserver = window.ResizeObserver || ResizeObserverPonyfill;
const IntersectionObserver = window.IntersectionObserver;

type isActive = boolean;
const subscribers = new WeakMap<Element, isActive>();

export const updateCurrentState = (target: Element): void => {
  const subscriber = subscribers.get(target);
  if (!subscriber) return;

  const tailElement = target.firstElementChild;
  const fulltextElement = target.lastElementChild;
  if (!fulltextElement || !tailElement) {
    console.error("react-tail-text's element not found");
    return;
  }

  const tailed = target.classList.contains("react-tail-text_tailed");
  const enoughSpace = fulltextElement.scrollWidth <= target.clientWidth;

  if (enoughSpace && tailed) {
    target.classList.remove("react-tail-text_tailed");
    (fulltextElement as HTMLElement).style.width = "auto";
  } else if (!enoughSpace) {
    if (!tailed) {
      target.classList.add("react-tail-text_tailed");
    }

    (fulltextElement as HTMLElement).style.width = `${
      target.clientWidth - tailElement.scrollWidth
    }px`;
  }
};

const resizeHandler: ResizeObserverCallback = (entries) => {
  for (let i = 0, l = entries.length; i < l; i++) {
    updateCurrentState(entries[i].target);
  }
};

const throttledHandler = throttle(resizeHandler, 1000 / 60);
const resizeObserver = new ResizeObserver(throttledHandler);

let intersectionObserver: IntersectionObserver | undefined;
if (typeof IntersectionObserver !== "undefined") {
  const intersectionHandler: IntersectionObserverCallback = (entries) => {
    for (let i = 0, l = entries.length; i < l; i++) {
      const entry = entries[i];
      if (entry.isIntersecting) {
        updateCurrentState(entry.target);
        resizeObserver.observe(entry.target);
      } else {
        resizeObserver.unobserve(entry.target);
      }
    }
  };

  intersectionObserver = new IntersectionObserver(intersectionHandler);
} else {
  console.warn(
    "IntersectionObserver is not defined. react-tail-text perfomance may be affected"
  );
}

function addSelectionChangeEventHandler() {
  selectionChangeEventHandlerAdded = true;
  document.addEventListener("selectionchange", () => {
    const selection = document.getSelection();
    const fulltextElement = selection?.focusNode?.parentElement;

    const nodes = document.querySelectorAll(`.${fulltextSelectedClassName}`);
    for (let i = 0, l = nodes.length; i < l; ++i) {
      nodes[i].classList.remove(fulltextSelectedClassName);
    }

    if (fulltextElement?.classList.contains(fulltextSelectListenerClassName)) {
      fulltextElement.classList.add(fulltextSelectedClassName);
    }
  });
}

export default function addToObserver(
  wrapperElement: Element
): (() => void) | undefined {
  if (subscribers.has(wrapperElement)) {
    console.warn("Element already subscribed");

    return;
  }

  if (!selectionChangeEventHandlerAdded) {
    addSelectionChangeEventHandler();
  }

  subscribers.set(wrapperElement, true);
  if (intersectionObserver) {
    intersectionObserver.observe(wrapperElement);
  } else {
    resizeObserver.observe(wrapperElement);
  }

  return () => {
    subscribers.delete(wrapperElement);
    resizeObserver.unobserve(wrapperElement);
    intersectionObserver?.unobserve(wrapperElement);
  };
}
