import { ResizeObserver as ResizeObserverPonyfill } from "@juggle/resize-observer";
import throttle from "lodash.throttle";

const ResizeObserver = window.ResizeObserver || ResizeObserverPonyfill;
const IntersectionObserver = window.IntersectionObserver;

type SubscriberData = {
  fulltextWidth: number;
  fulltextElement: HTMLElement;
  tailWidth: number;
  tailElement: HTMLElement;
  startElement: HTMLElement;
};

const subscribers = new WeakMap<Element, SubscriberData>();

const updateCurrentState = (target: Element) => {
  const subscriberData = subscribers.get(target);
  if (!subscriberData) return;

  const {
    fulltextWidth,
    tailWidth,
    fulltextElement,
    tailElement,
    startElement,
  } = subscriberData;
  const enoughSpace = target.clientWidth >= fulltextWidth;

  if (enoughSpace && tailElement.style.visibility !== "none") {
    fulltextElement.style.width = "auto";
    fulltextElement.style.visibility = "visible";

    startElement.style.width = "0px";
    startElement.style.visibility = "none";
    tailElement.style.width = "0px";
    tailElement.style.visibility = "none";
  } else {
    fulltextElement.style.width = "0px";
    fulltextElement.style.visibility = "none";

    startElement.style.width = `${target.clientWidth - tailWidth}px`;
    startElement.style.visibility = "visible";
    tailElement.style.width = `${tailWidth}px`;
    tailElement.style.visibility = "visible";
  }
};

const resizeHandler: ResizeObserverCallback = (entries) => {
  for (let i = 0, l = entries.length; i < l; i++) {
    updateCurrentState(entries[i].target);
  }
};

const throttledHandler = throttle(resizeHandler, 20);
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
    "В браузере отсутствует поддержка IntersectionObserver. Производительность react-tail-text может быть снижена"
  );
}

export default function addToObserver(
  wrapperElement: HTMLElement,
  fulltextElement: HTMLElement,
  fulltextWidth: number,
  tailElement: HTMLElement,
  tailWidth: number,
  startElement: HTMLElement,
): (() => void) | undefined {
  if (subscribers.has(wrapperElement)) {
    console.warn("Element already subscribed");

    return;
  }

  subscribers.set(wrapperElement, {
    fulltextElement,
    fulltextWidth,
    tailElement,
    tailWidth,
    startElement,
  });

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