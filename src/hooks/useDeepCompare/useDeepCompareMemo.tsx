/* eslint-disable react-hooks/exhaustive-deps */
import { DependencyList, useMemo } from "react";
import { useDeepCompareMemoize } from "./useDeepCompareMemoize";

function useDeepCompareMemo<T>(factory: () => T, dependencies: DependencyList) {
  return useMemo(factory, useDeepCompareMemoize(dependencies));
}

export default useDeepCompareMemo;
