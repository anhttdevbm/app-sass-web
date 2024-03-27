import { useRef, DependencyList } from "react";
import { deepEqual } from "utils/index";

export const useDeepCompareMemoize = (value: DependencyList) => {
  const ref = useRef<DependencyList>([]);
  if (!deepEqual(value, ref.current)) ref.current = value;
  return ref.current;
};
