import { useCallback, useMemo } from "react";
import dayjs from "dayjs";

import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  resetEmployee,
  resetCostRates,
  CostRateWorkingHours,
  CostRate,
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

  const employee = useAppSelector(
    (state) => state.employeeDetail.employee.detail,
  );
  const status = useAppSelector(
    (state) => state.employeeDetail.employee.status,
  );

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

  const handleResetEmployee = useCallback(async () => {
    try {
      return dispatch(resetEmployee());
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  return {
    employee,
    status,
    handleGetEmployeeDetail,
    handleUpdateEmployee,
    handleResetEmployee,
  };
};

export const useCostRate = () => {
  const dispatch = useAppDispatch();

  const selectAllCostRate = useAppSelector((state) =>
    state.employeeDetail.costRates.items.map((cr) => getCalculatedCostRate(cr)),
  );

  const selectCurrentCostRate = useMemo(
    () =>
      selectAllCostRate.find((cr) => {
        const startDate = dayjs(cr.start_date).startOf("day");
        const endDate = dayjs(cr.end_date).startOf("day");
        const today = dayjs().startOf("day");
        return (
          (startDate.isBefore(today) || startDate.isSame(today)) &&
          (endDate.isAfter(today) || endDate.isSame(today))
        );
      }),
    [selectAllCostRate],
  );

  const selectCostRate = useCallback(
    (id: string) => selectAllCostRate.find((cr) => cr.id === id),
    [selectAllCostRate],
  );

  const handleGetAllCostRate = useCallback(async () => {
    try {
      return await dispatch(getAllCostRate()).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

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
        return await dispatch(
          addNewCostRate(getCalculatedCostRate(data)),
        ).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const handleUpdateCostRate = useCallback(
    async (data: UpdateCostRate) => {
      try {
        return await dispatch(
          updateCostRate(getCalculatedCostRate(data)),
        ).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const handleResetCostRates = useCallback(async () => {
    try {
      return dispatch(resetCostRates());
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  return {
    selectCurrentCostRate,
    selectAllCostRate,
    selectCostRate,
    handleGetAllCostRate,
    handleGetCostRate,
    handleDeleteCostRate,
    handleAddNewCostRate,
    handleUpdateCostRate,
    handleResetCostRates,
  };
};

const calculateWorkingHours = (
  startDateStr: string | Date,
  endDateStr: string | Date,
  workingHours: CostRateWorkingHours,
  subtractedDays?: number,
) => {
  const endDate = dayjs(endDateStr).startOf("day");
  let startDate = dayjs(startDateStr).startOf("day");

  if (startDate.isAfter(endDate)) {
    return 0;
  }

  if (startDate.isSame(endDate)) {
    return 0;
  }

  let result = 0;
  const weekDiff = endDate.diff(startDate, "week");
  const mappedWorkingHours = workingHours.map((h) => +h);
  const weekHours = mappedWorkingHours.reduce((sum, hour) => sum + hour, 0);
  startDate = startDate.add(weekDiff, "week");
  while (!startDate.isAfter(endDate)) {
    result += mappedWorkingHours[(startDate.day() + 6) % 7];
    startDate = startDate.add(1, "day");
  }
  result = result + weekDiff * weekHours - (subtractedDays ?? 0);

  return result;
};

const calculateWorkingDays = (
  startDateStr: string | Date,
  endDateStr: string | Date,
  workingHours: CostRateWorkingHours,
  subtractedDays?: number,
) =>
  calculateWorkingHours(
    startDateStr,
    endDateStr,
    workingHours.map((h) => (h == 0 ? 0 : 1)) as CostRateWorkingHours,
    subtractedDays,
  );

const calculateCostPerHour = (
  type: string,
  totalCost: number,
  startDateStr: string | Date,
  workingHours: CostRateWorkingHours,
) =>
  +(
    Math.round(
      +(
        (totalCost * (type.toUpperCase() === "WEEKLY" ? 52 : 12)) /
          calculateWorkingHours(
            dayjs(startDateStr).startOf("year").toDate(),
            dayjs(startDateStr)
              .startOf("year")
              .add(1, "year")
              .add(-1, "day")
              .toDate(),
            workingHours,
            0,
          ) +
        "e+2"
      ),
    ) + "e-2"
  );

export function getCalculatedCostRate<
  T extends CostRate | NewCostRate | UpdateCostRate,
>(cr: T): T {
  return {
    ...cr,
    type: cr.type.toUpperCase(),
    currency: cr.currency.toUpperCase(),
    working_hours: cr.working_hours.map((h) => +h) as CostRateWorkingHours,
    total_hours: calculateWorkingHours(
      cr.start_date,
      cr.end_date,
      cr.working_hours,
      0,
    ),
    total_days: calculateWorkingDays(
      cr.start_date,
      cr.end_date,
      cr.working_hours,
      0,
    ),
    remaining_hours: calculateWorkingHours(
      dayjs().startOf("day").toISOString(),
      cr.end_date,
      cr.working_hours,
      0,
    ),
    remaining_days: calculateWorkingDays(
      dayjs().startOf("day").toISOString(),
      cr.end_date,
      cr.working_hours,
      0,
    ),
    cost_per_hour: calculateCostPerHour(
      cr.type,
      cr.cost_per_month,
      cr.start_date,
      cr.working_hours,
    ),
  };
}
