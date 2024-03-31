import { createAsyncThunk } from "@reduxjs/toolkit";

import { Endpoint, client } from "api";
import { HttpStatusCode } from "constant/enums";
import { CostRate } from "./reducer";
import { AN_ERROR_TRY_AGAIN, COMPANY_API_URL } from "constant/index";

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
