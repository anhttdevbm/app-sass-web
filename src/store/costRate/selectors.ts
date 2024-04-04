import { useCallback, useMemo } from "react";

import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  getAllCostRate,
  getCostRate,
  deleteCostRate,
  addNewCostRate,
  updateCostRate,
  NewCostRate,
  UpdateCostRate,
} from "./actions";

export const useCostRate = () => {
  const dispatch = useAppDispatch();

  const rates = useAppSelector((state) => state.costRate.rates);

  const currentRate = useMemo(() => rates?.length > 0 ? rates[0] : undefined, [rates]);
  const remainingRates = useMemo(() => rates?.length > 0 ? rates.slice(1) : [], [rates]);

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

  const handleGetCostRate = useCallback(
    async (id: string) => {
      try {
        return await dispatch(getCostRate(id)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const handleDeleteCostRate = useCallback(
    async (id: string) => {
      try {
        return await dispatch(deleteCostRate(id)).unwrap();
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
    handleGetCostRate,
    handleDeleteCostRate,
    handleAddNewCostRate,
    handleUpdateCostRate,
  };
};
