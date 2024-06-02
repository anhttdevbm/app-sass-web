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
  UpdateEmployee,
  getAllCostRate,
  CostRateRequest,
  addCostRate,
  getCostRate,
  updateCostRate,
  deleteCostRate,
  deleteMultiCostRate,
  getCostRateChart,
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

  const status = useAppSelector(
    (state) => state.employeeDetail.costRates.status,
  );

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

  const handleGetAllCostRate = useCallback(
    async (employeeId: string) => {
      try {
        return await dispatch(getAllCostRate(employeeId)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const handleAddCostRate = useCallback(
    async (payload: { employeeId: string; data: CostRateRequest }) => {
      try {
        return await dispatch(addCostRate(payload)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const handleGetCostRate = useCallback(
    async (payload: { employeeId: string; id: string }) => {
      try {
        return await dispatch(getCostRate(payload)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const handleUpdateCostRate = useCallback(
    async (payload: {
      employeeId: string;
      id: string;
      data: CostRateRequest;
    }) => {
      try {
        return await dispatch(updateCostRate(payload)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const handleDeleteCostRate = useCallback(
    async (payload: { employeeId: string; id: string }) => {
      try {
        return await dispatch(deleteCostRate(payload)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const handleDeleteMultiCostRate = useCallback(
    async (payload: {
      employeeId: string;
      data: { cost_rate_ids: string[] };
    }) => {
      try {
        return await dispatch(deleteMultiCostRate(payload)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const handleGetCostRateChart = useCallback(
    async (employeeId: string) => {
      try {
        return await dispatch(getCostRateChart(employeeId)).unwrap();
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
    status,
    selectCurrentCostRate,
    selectAllCostRate,
    selectCostRate,
    handleGetAllCostRate,
    handleAddCostRate,
    handleGetCostRate,
    handleUpdateCostRate,
    handleDeleteCostRate,
    handleDeleteMultiCostRate,
    handleGetCostRateChart,
    handleResetCostRates,
  };
};

const convertWorkingHoursObj = (
  obj: CostRateWorkingHours,
  countDaysOnly = false,
): CostRateWorkingHours => {
  const result = { ...obj };
  Object.keys(result).forEach((key) => {
    result[key] = countDaysOnly ? (result[key] == 0 ? 0 : 1) : +result[key];
  });
  return result;
};

const convertCostRateObj = (costRate: CostRate): CostRate => ({
  ...costRate,
  working_hours: convertWorkingHoursObj(costRate.working_hours),
});

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
  const mappedWorkingHours = Object.values(workingHours);
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
    convertWorkingHoursObj(workingHours, true) as CostRateWorkingHours,
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

export function getCalculatedCostRate(cr: CostRate): CostRate {
  const converted = convertCostRateObj(cr);
  return {
    ...converted,
    // total_hours: calculateWorkingHours(
    //   cr.start_date,
    //   cr.end_date,
    //   cr.working_hours,
    //   0,
    // ),
    // total_days: calculateWorkingDays(
    //   cr.start_date,
    //   cr.end_date,
    //   cr.working_hours,
    //   0,
    // ),
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
