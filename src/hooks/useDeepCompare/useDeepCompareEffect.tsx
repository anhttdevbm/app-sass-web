/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useDeepCompareMemoize } from "./useDeepCompareMemoize";

function useDeepCompareEffect(
  effect: React.EffectCallback,
  dependencies: React.DependencyList,
) {
  useEffect(effect, useDeepCompareMemoize(dependencies));
}

export default useDeepCompareEffect;
