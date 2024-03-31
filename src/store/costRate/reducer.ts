import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { getAllCostRate } from "./actions";

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
  currentRate?: CostRate;
  remainingRates: CostRate[];
}

const initialState: CostRateState = {
  remainingRates: [],
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
          state.currentRate = action.payload[0];
          state.remainingRates = action.payload;
        }
      )
})

export default costRateSlice.reducer;
