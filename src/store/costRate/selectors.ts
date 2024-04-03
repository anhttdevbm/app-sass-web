import { useCallback } from "react";
import { shallowEqual } from "react-redux";

import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  getAllCostRate,
  addNewCostRate,
  NewCostRate,
} from "./actions";

export const useCostRate = () => {
  const dispatch = useAppDispatch();

  const { currentRate, remainingRates } = useAppSelector((state) => state.costRate, shallowEqual);

  const handleGetAllCostRate = useCallback(
    async () => {
      try {
        return await dispatch(getAllCostRate()).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const handleAddNewCostRate = useCallback(
    async (data: NewCostRate) => {
      try {
        return await dispatch(addNewCostRate(data)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  return {
    currentRate,
    remainingRates,
    handleGetAllCostRate,
    handleAddNewCostRate,
  };
};
