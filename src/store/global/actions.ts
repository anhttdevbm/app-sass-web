import { createAsyncThunk } from "@reduxjs/toolkit";
import { client, Endpoint } from "api";
import { HttpStatusCode } from "constant/enums";
import { COMPANY_API_URL, AN_ERROR_TRY_AGAIN, API_URL } from "constant/index";
import { BaseQueries } from "constant/types";
import { serverQueries, refactorRawItemListResponse } from "utils/index";

export const getPositions = async (queries: BaseQueries) => {
  queries = serverQueries(
    { ...queries, is_active: true, sort: "created_time=-1" },
    undefined,
    ["is_active"],
  ) as BaseQueries;

  try {
    let query = queries?.query;

    query = query?.replace("eq(name", "like(name");
    query = query?.replace("eq(created_time", "gte(created_time");
    
    const newqueries = {
      ...queries,
      query: query
    };
    
    const response = await client.get(Endpoint.POSITIONS_ALL, newqueries, {
      baseURL: COMPANY_API_URL,
    });

    if (response?.status === HttpStatusCode.OK) {
      return refactorRawItemListResponse(response.data);
    }
    throw AN_ERROR_TRY_AGAIN;
  } catch (error) {
    throw error;
  }
};

export const getProjectTypes = async (queries: BaseQueries) => {
  queries = serverQueries(
    { ...queries, is_active: true, sort: "created_time=-1" },
    undefined,
    ["is_active"],
  ) as BaseQueries;

  try {
    const response = await client.get(Endpoint.PROJECT_TYPES_ALL, queries, {
      baseURL: COMPANY_API_URL,
    });

    if (response?.status === HttpStatusCode.OK) {
      return refactorRawItemListResponse(response.data);
    }
    throw AN_ERROR_TRY_AGAIN;
  } catch (error) {
    throw error;
  }
};

export const getCurrencies = async (queries: BaseQueries) => {

  try {
    const response = await client.get(Endpoint.CURRENCY, {}, {
      baseURL: API_URL,
    });

    if (response?.status === HttpStatusCode.OK) {
      return response.data;
    }
    throw AN_ERROR_TRY_AGAIN;
  } catch (error) {
    throw error;
  }
};

export const getPositionOptions = createAsyncThunk(
  "global/getPositionOptions",
  getPositions,
);

export const getProjectTypeOptions = createAsyncThunk(
  "global/getProjectTypeOptions",
  getProjectTypes,
);

export const getCurrencyOptions = createAsyncThunk(
  "global/getCurrencyOptions",
  getCurrencies,
);