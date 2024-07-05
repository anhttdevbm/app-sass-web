import { useEffect, useRef } from "react";

const DEFAULT_EVENTS = ["mousedown", "touchstart", "scroll"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useOnClickOutside<T extends HTMLElement = any>(
  handler: () => void,
  events?: string[] | null,
  nodes?: (HTMLElement | null)[],
) {
  const ref = useRef<T>();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const listener = (event: any) => {
      const { target } = event ?? {};
      const shouldIgnore =
        target?.hasAttribute("data-ignore-outside-clicks") ||
        target?.parentElement.hasAttribute("data-ignore-outside-clicks") ||
        (!document.body.contains(target) && target.tagName !== "HTML");
      if (Array.isArray(nodes)) {
        const shouldTrigger = nodes.every(
          (node) => !!node && !event.composedPath().includes(node),
        );
        shouldTrigger && !shouldIgnore && handler();
      } else if (ref.current && !ref.current.contains(target)) {
        !shouldIgnore && handler();
      }
    };

    (events || DEFAULT_EVENTS).forEach((fn) =>
      document.addEventListener(fn, listener),
    );

    return () => {
      (events || DEFAULT_EVENTS).forEach((fn) =>
        document.removeEventListener(fn, listener),
      );
    };
  }, [ref, handler, nodes, events]);

  return ref;
}
