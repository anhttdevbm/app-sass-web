import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
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

export type CostRateState = {
  rates: CostRate[];
}

const initialState: CostRateState = {
  rates: [],
}

const costRateSlice = createSlice({
  name: 'costRate',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(
        getAllCostRate.fulfilled,
        (state, action: PayloadAction<CostRate[]>) => {
          state.rates = [ ...action.payload ];
        }
      )
      .addCase(
        getCostRate.fulfilled,
        (state, action: PayloadAction<CostRate>) => {
          const index = state.rates.findIndex(rate => rate.id === action.payload.id);
          if (index > -1) {
            state.rates[index] = { ...action.payload }
          } else {
            state.rates.unshift({ ...action.payload });
          }
        }
      )
      .addCase(
        deleteCostRate.fulfilled,
        (state, action: PayloadAction<CostRate>) => {
          const index = state.rates.findIndex(rate => rate.id === action.payload.id);
          if (index > -1) {
            state.rates.splice(index, 1);
          }
        }
      )
      .addCase(
        addNewCostRate.fulfilled,
        (state, action: PayloadAction<CostRate>) => {
          state.rates.unshift({ ...action.payload });
        }
      )
      .addCase(
        updateCostRate.fulfilled,
        (state, action: PayloadAction<CostRate>) => {
          state.rates[state.rates.findIndex(rate => rate.id === action.payload.id)] = { ...action.payload }
        }
      )
})

export default costRateSlice.reducer;
