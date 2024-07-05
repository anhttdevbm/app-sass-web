import { createAsyncThunk } from "@reduxjs/toolkit";
import StringFormat from "string-format";

import { Endpoint, client } from "api";
import { HttpStatusCode } from "constant/enums";
import { AN_ERROR_TRY_AGAIN, COMPANY_API_URL } from "constant/index";
import { HolidayCalendar, HolidayList, HolidayItem } from "./reducer";

export type HolidayCalendarPOSTData = Pick<
  HolidayCalendar,
  "name" | "country" | "province"
>;

export type HolidayCalendarPUTData = HolidayCalendarPOSTData &
  Pick<HolidayCalendar, "id">;

export type HolidayListPOSTData = Pick<
  HolidayList,
  "holiday_calendar_id" | "year"
> & {
  items: [];
};

export type HolidayListPUTData = Pick<HolidayList, "id" | "items">;

export type HolidayItemPOSTData = Omit<HolidayItem, "id"> & {
  holidayListId: string;
};

export type HolidayItemDELETEData = {
  id: string;
  holidayListId: string;
};

export const getAllHolidayCalendar = createAsyncThunk(
  "holidayCalendar/getAllHolidayCalendar",
  async () => {
    try {
      const response = await client.get(Endpoint.HOLIDAY_CALENDAR, undefined, {
        baseURL: COMPANY_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const addHolidayCalendar = createAsyncThunk(
  "holidayCalendar/addHolidayCalendar",
  async (data: HolidayCalendarPOSTData) => {
    try {
      const response = await client.post(Endpoint.HOLIDAY_CALENDAR, data, {
        baseURL: COMPANY_API_URL,
      });

      if (response?.status === HttpStatusCode.CREATED) {
        return response.data;
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
        StringFormat(Endpoint.HOLIDAY_CALENDAR_DETAIL, { id }),
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

export const updateHolidayCalendar = createAsyncThunk(
  "holidayCalendar/updateHolidayCalendar",
  async (data: HolidayCalendarPUTData) => {
    try {
      const response = await client.put(
        StringFormat(Endpoint.HOLIDAY_CALENDAR_DETAIL, { id: data.id }),
        data,
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

export const deleteHolidayCalendar = createAsyncThunk(
  "holidayCalendar/deleteHolidayCalendar",
  async (id: string) => {
    try {
      const response = await client.delete(
        StringFormat(Endpoint.HOLIDAY_CALENDAR_DETAIL, { id }),
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
      const response = await client.get(Endpoint.HOLIDAY_LIST, undefined, {
        baseURL: COMPANY_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data.holidayLists;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const addHolidayList = createAsyncThunk(
  "holidayCalendar/addHolidayList",
  async (data: HolidayListPOSTData) => {
    try {
      const response = await client.post(
        Endpoint.HOLIDAY_LIST,
        { ...data, items: [] },
        {
          baseURL: COMPANY_API_URL,
        },
      );

      if (response?.status === HttpStatusCode.CREATED) {
        return response.data.holidayList;
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
        StringFormat(Endpoint.HOLIDAY_LIST_DETAIL, { id }),
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

export const updateHolidayList = createAsyncThunk(
  "holidayCalendar/updateHolidayList",
  async (data: HolidayListPUTData) => {
    try {
      const response = await client.put(
        StringFormat(Endpoint.HOLIDAY_LIST_DETAIL, { id: data.id }),
        data,
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

export const addHolidayItem = createAsyncThunk(
  "holidayCalendar/addHolidayItem",
  async (data: HolidayItemPOSTData) => {
    try {
      const response = await client.post(
        StringFormat(Endpoint.HOLIDAY_LIST_DETAIL, { id: data.holidayListId }),
        data,
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

export const deleteHolidayItem = createAsyncThunk(
  "holidayCalendar/deleteHolidayItem",
  async (data: HolidayItemDELETEData) => {
    try {
      const url = `${Endpoint.HOLIDAY_LIST_DETAIL}?item_id={itemId}`;
      const response = await client.delete(
        StringFormat(url, {
          id: data.holidayListId,
          itemId: data.id,
        }),
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
