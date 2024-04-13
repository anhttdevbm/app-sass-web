import { createAsyncThunk } from "@reduxjs/toolkit";
import StringFormat from "string-format";

import { Endpoint, client } from "api";
import { HttpStatusCode } from "constant/enums";
import { AN_ERROR_TRY_AGAIN, COMPANY_API_URL } from "constant/index";

export const getAllHolidayCalendar = createAsyncThunk(
  "holidayCalendar/getAllHolidayCalendar",
  async () => {
    try {
      const response = await client.get(
        Endpoint.HOLIDAY_CALENDAR,
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

export const getAllHolidayList = createAsyncThunk(
  "holidayCalendar/getAllHolidayList",
  async () => {
    try {
      const response = await client.get(
        Endpoint.HOLIDAY_LIST,
        undefined,
        {
          baseURL: COMPANY_API_URL,
        },
      );

      if (response?.status === HttpStatusCode.OK) {
        return response.data.holidayLists;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getHolidayCalendar = createAsyncThunk(
  "holidayCalendar/getHolidayCalendar",
  async (id: string) => {
    try {
      const response = await client.get(
        StringFormat(Endpoint.HOLIDAY_CALENDAR_DETAIL, id),
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

export const getHolidayList = createAsyncThunk(
  "holidayCalendar/getHolidayList",
  async (id: string) => {
    try {
      const response = await client.get(
        StringFormat(Endpoint.HOLIDAY_LIST_DETAIL, id),
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
