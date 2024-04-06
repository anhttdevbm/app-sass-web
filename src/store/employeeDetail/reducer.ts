import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { User } from "constant/types";
import { DataStatus } from "constant/enums";
import {
  getEmployeeDetail,
  updateEmployee,
  getAllCostRate,
  getCostRate,
  deleteCostRate,
  addNewCostRate,
  updateCostRate,
} from "./actions";

export type CostRate = {
  id: string;
  company: string;
  cost_per_month: number;
  currency: string;
  type: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  holiday_calendar: string;
  working_hours: number[];
  total_hours?: number;
  created_by: string;
  created_time: string;
}

export interface Employee extends User {
  created_time: string;
  department: string;
  is_active: boolean;
  approve?: boolean;
  updated_time: string;
  date_end_using: string;
  date_start_using: string;
  is_pay_user: boolean;
  id_rocket?: string;
}

export type EmployeeDetailState = {
  employee: {
    status: DataStatus;
    detail?: Employee;
  },
  costRates: {
    status: DataStatus;
    items: CostRate[]
  };
}

const initialState: EmployeeDetailState = {
  employee: {
    status: DataStatus.IDLE,
  },
  costRates: {
    status: DataStatus.IDLE,
    items: [],
  },
}

const employeeDetailSlice = createSlice({
  name: 'employeeDetail',
  initialState,
  reducers: {
    resetEmployee: (state) => ({ ...state, employee: { ...initialState.employee } }),
    reset: () => ({ ...initialState }),
  },
  extraReducers: (builder) =>
    builder
      .addCase(
        getEmployeeDetail.pending,
        (state) => {
          state.employee.status = DataStatus.LOADING
        }
      )
      .addCase(
        getEmployeeDetail.fulfilled,
        (state, action: PayloadAction<Employee>) => {
          state.employee.detail = { ...action.payload }
          state.employee.status = DataStatus.SUCCEEDED
        }
      )
      .addCase(
        updateEmployee.pending,
        (state) => {
          state.employee.status = DataStatus.LOADING
        }
      )
      .addCase(
        updateEmployee.fulfilled,
        (state, action: PayloadAction<Employee>) => {
          state.employee.detail = { ...action.payload }
          state.employee.status = DataStatus.SUCCEEDED
        }
      )
      .addCase(
        getAllCostRate.pending,
        (state) => {
          state.costRates.status = DataStatus.LOADING
        }
      )
      .addCase(
        getAllCostRate.fulfilled,
        (state, action: PayloadAction<CostRate[]>) => {
          state.costRates.items = [ ...action.payload ];
          state.costRates.status = DataStatus.SUCCEEDED
        }
      )
      .addCase(
        getCostRate.pending,
        (state) => {
          state.costRates.status = DataStatus.LOADING
        }
      )
      .addCase(
        getCostRate.fulfilled,
        (state, action: PayloadAction<CostRate>) => {
          const index = state.costRates.items.findIndex(rate => rate.id === action.payload.id);
          if (index > -1) {
            state.costRates.items[index] = { ...action.payload }
          } else {
            state.costRates.items.unshift({ ...action.payload });
          }
          state.costRates.status = DataStatus.SUCCEEDED
        }
      )
      .addCase(
        deleteCostRate.pending,
        (state) => {
          state.costRates.status = DataStatus.LOADING
        }
      )
      .addCase(
        deleteCostRate.fulfilled,
        (state, action: PayloadAction<CostRate>) => {
          const index = state.costRates.items.findIndex(rate => rate.id === action.payload.id);
          if (index > -1) {
            state.costRates.items.splice(index, 1);
          }
          state.costRates.status = DataStatus.SUCCEEDED
        }
      )
      .addCase(
        addNewCostRate.pending,
        (state) => {
          state.costRates.status = DataStatus.LOADING
        }
      )
      .addCase(
        addNewCostRate.fulfilled,
        (state, action: PayloadAction<CostRate>) => {
          state.costRates.items.unshift({ ...action.payload });
          state.costRates.status = DataStatus.SUCCEEDED
        }
      )
      .addCase(
        updateCostRate.pending,
        (state) => {
          state.costRates.status = DataStatus.LOADING
        }
      )
      .addCase(
        updateCostRate.fulfilled,
        (state, action: PayloadAction<CostRate>) => {
          state.costRates.items[state.costRates.items.findIndex(rate => rate.id === action.payload.id)] = { ...action.payload }
          state.costRates.status = DataStatus.SUCCEEDED
        }
      )
})

export const {
  reset,
  resetEmployee,
} = employeeDetailSlice.actions;

export default employeeDetailSlice.reducer;
