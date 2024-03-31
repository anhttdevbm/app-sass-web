import { useCallback } from "react";
import { shallowEqual } from "react-redux";

import { useAppDispatch, useAppSelector } from "store/hooks";
import { getAllCostRate } from "./actions";

export const useCostRate = () => {
  const dispatch = useAppDispatch();

  const { currentRate, remainingRates } = useAppSelector((state) => state.costRate, shallowEqual);

  const onGetAllCostRate = useCallback(
    async () => {
      try {
        return await dispatch(getAllCostRate()).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  return {
    currentRate,
    remainingRates,
    onGetAllCostRate,
  };
};
