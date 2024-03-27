import { useRef, useState, useCallback } from "react";

const useDebounce = (
  callback: (...args: any[]) => unknown,
  timeout: number,
): [(...args: any[]) => unknown, boolean, () => void] => {
  const timerId = useRef<NodeJS.Timeout | null>(null);
  const [isDone, setIsDone] = useState(false);
  timeout = timeout || 0;

  const debouncedFunction = useCallback(
    (...args) => {
      if (timerId.current) {
        clearTimeout(timerId.current);
        timerId.current = null;
        setIsDone(true);
      }
      timerId.current = setTimeout(() => {
        setIsDone(false);
        callback(...args);
      }, timeout);
    },
    [callback, timeout],
  );

  const cancel = useCallback(() => {
    if (timerId.current) {
      clearTimeout(timerId.current);
      timerId.current = null;
      setIsDone(true);
    }
  }, []);

  return [debouncedFunction, isDone, cancel];
};

export default useDebounce;
