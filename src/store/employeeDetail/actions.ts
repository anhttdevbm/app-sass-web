import { createAsyncThunk } from "@reduxjs/toolkit";
import StringFormat from "string-format";

import { Endpoint, client } from "api";
import { HttpStatusCode } from "constant/enums";
import { Employee, CostRate } from "./reducer";
import { AN_ERROR_TRY_AGAIN, AUTH_API_URL, COMPANY_API_URL } from "constant/index";

export type UpdateEmployee = Partial<Employee>;

export type UpdateCostRate = Partial<Omit<CostRate, "created_by" | "created_time" | "company">>

export type NewCostRate = Omit<UpdateCostRate, "id" | "start_date" | "end_date"> & Pick<CostRate, "start_date" | "end_date">

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

export const getCostRate = createAsyncThunk(
  "costRate/getCostRate",
  async (id: string) => {
    try {
      const response = await client.get(
        StringFormat(Endpoint.COST_RATE_DETAIL, { id }),
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

export const deleteCostRate = createAsyncThunk(
  "costRate/deleteCostRate",
  async (id: string) => {
    try {
      const response = await client.delete(
        StringFormat(Endpoint.COST_RATE_DETAIL, { id }),
        {
          baseURL: COMPANY_API_URL,
        },
      );

      if (response?.status === HttpStatusCode.OK) {
        if (!response.data.id) {
          response.data.id = id
        }
        return response.data;
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
