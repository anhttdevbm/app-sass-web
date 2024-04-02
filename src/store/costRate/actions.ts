import { createAsyncThunk } from "@reduxjs/toolkit";

import { Endpoint, client } from "api";
import { HttpStatusCode } from "constant/enums";
import { CostRate } from "./reducer";
import { AN_ERROR_TRY_AGAIN, COMPANY_API_URL } from "constant/index";

export type NewCostRate = {
  type?: string;
  cost_per_month?: number;
  currency?: string;
  working_hours?: [number, number, number, number, number, number, number];
  total_hours?: number;
  start_date?: string;
  end_date?: string;
  holiday_calendar?: string;
  note?: string;
}

export const getAllCostRate = createAsyncThunk(
  "costRate/getAllCostRate",
  async () => {
    try {
      const response = await client.get(Endpoint.COST_RATE, undefined, {
        baseURL: COMPANY_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data as CostRate[];
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const addNewCostRate = createAsyncThunk(
  "costRate/addNewCostRate",
  async (data: NewCostRate) => {
    try {
      const response = await client.post(Endpoint.COST_RATE_NEW, data, {
        baseURL: COMPANY_API_URL,
      });

      if (response?.status === HttpStatusCode.CREATED) {
        return response.data as CostRate;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);
