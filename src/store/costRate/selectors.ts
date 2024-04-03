import { useCallback, useMemo } from "react";

import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  getAllCostRate,
  addNewCostRate,
  updateCostRate,
  NewCostRate,
  UpdateCostRate,
} from "./actions";

export const useCostRate = () => {
  const dispatch = useAppDispatch();

  const rates = useAppSelector((state) => state.costRate.rates);

  const currentRate = useMemo(() => rates[0], [rates]);
  const remainingRates = useMemo(() => rates.slice(1), [rates]);

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

  const handleUpdateCostRate = useCallback(
    async (data: UpdateCostRate) => {
      try {
        return await dispatch(updateCostRate(data)).unwrap();
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
    handleUpdateCostRate,
  };
};
