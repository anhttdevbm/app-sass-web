import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { CostRateType, CURRENCY_CODE, DataStatus } from "constant/enums";
import { User } from "constant/types";
import {
  addCostRate,
  deleteCostRate,
  deleteMultiCostRate,
  DeleteMultiCostRateResponse,
  getAllCostRate,
  getCostRate,
  getCostRateChart,
  getEmployeeDetail,
  updateCostRate,
  updateEmployee,
} from "./actions";

export type CostRateWorkingHours = {
  MON: number;
  TUE: number;
  WED: number;
  THU: number;
  FRI: number;
  SAT: number;
  SUN: number;
};

export type BaseCostRate = {
  type: CostRateType;
  cost_per_month: number;
  currency: CURRENCY_CODE;
  working_hours: CostRateWorkingHours;
  start_date: string;
  end_date: string;
};

export type CostRateOptional = {
  holiday_calendar?: string;
  note?: string;
  over_head?: boolean;
};

export type CostRateResponse = {
  message?: string;
  id: string;
  total_hours: number;
  total_days: number;
  total_working_days: number;
  current_working_days: number;
  cost_per_hours: number;
  created_time: string;
  created_by: string;
  is_active: boolean;
  user_id: string;
};

// export type CostRateTransient = {
//   remaining_hours?: number;
//   remaining_days?: number;
// };

export type CostRate = BaseCostRate & CostRateOptional & CostRateResponse;

export interface Employee extends User {
  created_time: string;
  department: string;
  is_active: boolean;
  approve?: boolean;
  updated_time: string;
  date_end_using: string;
  date_start_using: string;
  is_pay_user: boolean;
  id: string;
}

export type EmployeeDetailState = {
  employee: {
    status: DataStatus;
    detail?: Employee;
  };
  costRates: {
    status: DataStatus;
    items: CostRate[];
  };
};

const initialState: EmployeeDetailState = {
  employee: {
    status: DataStatus.IDLE,
  },
  costRates: {
    status: DataStatus.IDLE,
    items: [],
  },
};

const employeeDetailSlice = createSlice({
  name: "employeeDetail",
  initialState,
  reducers: {
    resetEmployee: (state) => ({
      ...state,
      employee: { ...initialState.employee },
    }),
    resetCostRates: (state) => ({
      ...state,
      costRates: { ...initialState.costRates },
    }),
    reset: () => ({ ...initialState }),
  },
  extraReducers: (builder) =>
    builder
      .addCase(getEmployeeDetail.pending, (state) => {
        state.employee.status = DataStatus.LOADING;
      })
      .addCase(getEmployeeDetail.rejected, (state) => {
        state.employee.status = DataStatus.FAILED;
      })
      .addCase(
        getEmployeeDetail.fulfilled,
        (state, action: PayloadAction<Employee>) => {
          state.employee.detail = action.payload;
          state.employee.status = DataStatus.SUCCEEDED;
        },
      )
      .addCase(updateEmployee.pending, (state) => {
        state.employee.status = DataStatus.LOADING;
      })
      .addCase(updateEmployee.rejected, (state) => {
        state.employee.status = DataStatus.FAILED;
      })
      .addCase(
        updateEmployee.fulfilled,
        (state, action: PayloadAction<Employee>) => {
          state.employee.detail = action.payload;
          state.employee.status = DataStatus.SUCCEEDED;
        },
      )
      .addCase(getAllCostRate.pending, (state) => {
        state.costRates.status = DataStatus.LOADING;
      })
      .addCase(getAllCostRate.rejected, (state) => {
        state.costRates.status = DataStatus.FAILED;
      })
      .addCase(
        getAllCostRate.fulfilled,
        (state, action: PayloadAction<CostRate[]>) => {
          state.costRates.items = action.payload;
          state.costRates.status = DataStatus.SUCCEEDED;
        },
      )
      .addCase(addCostRate.pending, (state) => {
        state.costRates.status = DataStatus.LOADING;
      })
      .addCase(addCostRate.rejected, (state) => {
        state.costRates.status = DataStatus.FAILED;
      })
      .addCase(
        addCostRate.fulfilled,
        (state, action: PayloadAction<CostRate>) => {
          state.costRates.items.unshift(action.payload);
          state.costRates.status = DataStatus.SUCCEEDED;
        },
      )
      .addCase(getCostRate.pending, (state) => {
        state.costRates.status = DataStatus.LOADING;
      })
      .addCase(getCostRate.rejected, (state) => {
        state.costRates.status = DataStatus.FAILED;
      })
      .addCase(
        getCostRate.fulfilled,
        (state, action: PayloadAction<CostRate>) => {
          const index = state.costRates.items.findIndex(
            (rate) => rate.id === action.payload.id,
          );
          if (index > -1) {
            state.costRates.items[index] = action.payload;
          } else {
            state.costRates.items.unshift(action.payload);
          }
          state.costRates.status = DataStatus.SUCCEEDED;
        },
      )
      .addCase(updateCostRate.pending, (state) => {
        state.costRates.status = DataStatus.LOADING;
      })
      .addCase(updateCostRate.rejected, (state) => {
        state.costRates.status = DataStatus.FAILED;
      })
      .addCase(
        updateCostRate.fulfilled,
        (state, action: PayloadAction<CostRate>) => {
          const index = state.costRates.items.findIndex(
            (rate) => rate.id === action.payload.id,
          );
          if (index > -1) {
            state.costRates.items[index] = action.payload;
          }
          state.costRates.status = DataStatus.SUCCEEDED;
        },
      )
      .addCase(deleteCostRate.pending, (state) => {
        state.costRates.status = DataStatus.LOADING;
      })
      .addCase(deleteCostRate.rejected, (state) => {
        state.costRates.status = DataStatus.FAILED;
      })
      .addCase(
        deleteCostRate.fulfilled,
        (state, action: PayloadAction<CostRate>) => {
          const index = state.costRates.items.findIndex(
            (rate) => rate.id === action.payload.id,
          );
          if (index > -1) {
            state.costRates.items.splice(index, 1);
          }
          state.costRates.status = DataStatus.SUCCEEDED;
        },
      )
      .addCase(deleteMultiCostRate.pending, (state) => {
        state.costRates.status = DataStatus.LOADING;
      })
      .addCase(deleteMultiCostRate.rejected, (state) => {
        state.costRates.status = DataStatus.FAILED;
      })
      .addCase(
        deleteMultiCostRate.fulfilled,
        (state, action: PayloadAction<DeleteMultiCostRateResponse>) => {
          state.costRates.items = state.costRates.items.filter(
            (i) => !action.payload.cost_rate_ids.includes(i.id),
          );
          state.costRates.status = DataStatus.SUCCEEDED;
        },
      )
      .addCase(getCostRateChart.pending, (state) => {
        state.costRates.status = DataStatus.LOADING;
      })
      .addCase(getCostRateChart.rejected, (state) => {
        state.costRates.status = DataStatus.FAILED;
      })
      .addCase(getCostRateChart.fulfilled, (state) => {
        state.costRates.status = DataStatus.SUCCEEDED;
      }),
});

export const { reset, resetEmployee, resetCostRates } =
  employeeDetailSlice.actions;

export default employeeDetailSlice.reducer;
