import { useCallback, useMemo } from "react";

import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  resetEmployee,
  resetCostRates,
} from "./reducer";
import {
  getEmployeeDetail,
  updateEmployee,
  getAllCostRate,
  getCostRate,
  deleteCostRate,
  addNewCostRate,
  updateCostRate,
  UpdateEmployee,
  NewCostRate,
  UpdateCostRate,
} from "./actions";

export const useEmployeeDetail = () => {
  const dispatch = useAppDispatch();

  const employee = useAppSelector((state) => state.employeeDetail.employee.detail);
  const status = useAppSelector((state) => state.employeeDetail.employee.status);

  const handleGetEmployeeDetail = useCallback(
    async (id: string) => {
      try {
        return await dispatch(getEmployeeDetail(id)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const handleUpdateEmployee = useCallback(
    async (data: UpdateEmployee) => {
      try {
        return await dispatch(updateEmployee(data)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const handleResetEmployee = useCallback(
    async () => {
      try {
        return dispatch(resetEmployee());
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  return {
    employee,
    status,
    handleGetEmployeeDetail,
    handleUpdateEmployee,
    handleResetEmployee,
  };
}

export const useCostRate = () => {
  const dispatch = useAppDispatch();

  const costRates = useAppSelector((state) => state.employeeDetail.costRates.items);

  const currentRate = useMemo(() => costRates?.length > 0 ? costRates[0] : undefined, [costRates]);
  const remainingRates = useMemo(() => costRates?.length > 0 ? costRates.slice(1) : [], [costRates]);

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

  const handleResetCostRates = useCallback(
    async () => {
      try {
        return dispatch(resetCostRates());
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
    handleResetCostRates,
  };
};
