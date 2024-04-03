import { createAsyncThunk } from "@reduxjs/toolkit";
import StringFormat from "string-format";

import { Endpoint, client } from "api";
import { HttpStatusCode } from "constant/enums";
import { CostRate } from "./reducer";
import { AN_ERROR_TRY_AGAIN, COMPANY_API_URL } from "constant/index";

export type NewCostRate = Partial<
  Omit<CostRate, "id" | "created_by" | "created_time" | "company">
> & {
  note?: string;
}

export type UpdateCostRate = Partial<
  Omit<CostRate, "created_by" | "created_time" | "company">
> & {
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

export const updateCostRate = createAsyncThunk(
  "costRate/updateCostRate",
  async (data: UpdateCostRate) => {
    try {
      const response = await client.put(
        StringFormat(Endpoint.COST_RATE_DETAIL, { id: data.id }),
        data,
        {
          baseURL: COMPANY_API_URL,
        },
      );

      if (response?.status === HttpStatusCode.CREATED) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);
