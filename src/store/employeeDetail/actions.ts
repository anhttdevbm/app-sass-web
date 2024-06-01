import { createAsyncThunk } from "@reduxjs/toolkit";
import StringFormat from "string-format";

import { Endpoint, client } from "api";
import { HttpStatusCode } from "constant/enums";
import { Employee, BaseCostRate, CostRateOptional, CostRate } from "./reducer";
import {
  AN_ERROR_TRY_AGAIN,
  AUTH_API_URL,
  COMPANY_API_URL,
} from "constant/index";

export type UpdateEmployee = Partial<Employee>;

// export type UpdateCostRateRequest = BaseCostRate & CostRateOptional & Pick<
//   CostRateResponse,
//   "id" | "user_id"
// >;

export type CostRateRequest = BaseCostRate & CostRateOptional;

export type DeleteMultiCostRateResponse = {
  message: string;
  acknowledged: boolean;
  deletedCount: number;
  cost_rate_ids: string[];
};

export const getEmployeeDetail = createAsyncThunk(
  "costRate/getEmployeeDetail",
  async (id: string) => {
    try {
      const response = await client.get(
        StringFormat(Endpoint.USER_ITEM, { id }),
        undefined,
        {
          baseURL: AUTH_API_URL,
        },
      );

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updateEmployee = createAsyncThunk(
  "costRate/updateEmployee",
  async (data: UpdateEmployee) => {
    try {
      const response = await client.put(
        StringFormat(Endpoint.USER_ITEM, { id: data.id }),
        data,
        {
          baseURL: AUTH_API_URL,
        },
      );

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getAllCostRate = createAsyncThunk(
  "costRate/getAllCostRate",
  async (employeeId: string) => {
    try {
      const response = await client.get(
        StringFormat(Endpoint.COST_RATE, { employeeId }),
        undefined,
        {
          baseURL: COMPANY_API_URL,
        },
      );

      if (response?.status === HttpStatusCode.OK) {
        return response.data as CostRate[];
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const addCostRate = createAsyncThunk(
  "costRate/addCostRate",
  async (payload: { employeeId: string; data: CostRateRequest }) => {
    try {
      const { employeeId, data } = payload;
      const response = await client.post(
        StringFormat(Endpoint.COST_RATE, { employeeId }),
        data,
        {
          baseURL: COMPANY_API_URL,
        },
      );

      if (response?.status === HttpStatusCode.CREATED) {
        return response.data as CostRate;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getCostRate = createAsyncThunk(
  "costRate/getCostRate",
  async (payload: { employeeId: string; id: string }) => {
    try {
      const { employeeId, id } = payload;
      const response = await client.get(
        StringFormat(Endpoint.COST_RATE_DETAIL, { employeeId, id }),
        undefined,
        {
          baseURL: COMPANY_API_URL,
        },
      );

      if (response?.status === HttpStatusCode.OK) {
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
  async (payload: {
    employeeId: string;
    id: string;
    data: CostRateRequest;
  }) => {
    try {
      const { employeeId, id, data } = payload;
      const response = await client.put(
        StringFormat(Endpoint.COST_RATE_DETAIL, { employeeId, id }),
        data,
        {
          baseURL: COMPANY_API_URL,
        },
      );

      if (response?.status === HttpStatusCode.CREATED) {
        return response.data as CostRate;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const deleteCostRate = createAsyncThunk(
  "costRate/deleteCostRate",
  async (payload: { employeeId: string; id: string }) => {
    try {
      const { employeeId, id } = payload;
      const response = await client.delete(
        StringFormat(Endpoint.COST_RATE_DETAIL, { employeeId, id }),
        {
          baseURL: COMPANY_API_URL,
        },
      );

      if (response?.status === HttpStatusCode.OK) {
        if (!response.data.id) {
          response.data.id = id;
        }
        return response.data as CostRate;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const deleteMultiCostRate = createAsyncThunk(
  "costRate/deleteMultiCostRate",
  async (payload: {
    employeeId: string;
    data: { cost_rate_ids: string[] };
  }) => {
    try {
      const { employeeId, data } = payload;
      const response = await client.post(
        StringFormat(Endpoint.COST_RATE_DELETE_MULTI, { employeeId }),
        data,
        {
          baseURL: COMPANY_API_URL,
        },
      );

      if (response?.status === HttpStatusCode.OK) {
        response.data.cost_rate_ids = data.cost_rate_ids;
        return response.data as DeleteMultiCostRateResponse;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getCostRateChart = createAsyncThunk(
  "costRate/getCostRateChart",
  async (employeeId: string) => {
    try {
      const response = await client.get(
        StringFormat(Endpoint.COST_RATE_CHART, { employeeId }),
        undefined,
        {
          baseURL: COMPANY_API_URL,
        },
      );

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);
