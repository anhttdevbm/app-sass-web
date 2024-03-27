/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DependencyList, useCallback } from "react";
import { useDeepCompareMemoize } from "./useDeepCompareMemoize";

const useDeepCompareCallback = <T extends (...args: any[]) => any>(
  callBack: T,
  dependencies: DependencyList,
) => {
  return useCallback(callBack, useDeepCompareMemoize(dependencies));
};

export default useDeepCompareCallback;
