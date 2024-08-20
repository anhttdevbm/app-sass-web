import { createAsyncThunk } from "@reduxjs/toolkit";
import { Endpoint, client } from "api";
import { SORT_OPTIONS } from "constant/enums";
import { RESOURCE_API_URL } from "constant/index";
import { getServiceBudget } from "./../billing/actions";

export interface IBookingAllFitler {
  search_key?: string;
  working_sort?: WorkingStatus;
  sort?: SORT_OPTIONS | "";
  start_date?: string;
  end_date?: string;
  position?: string;
}
export enum resourceActionType {
  SET_BOOKING_ALL_FILTER = "SET_BOOKING_ALL_FILTER",
  SET_DATE_PICKER = "SET_DATE_PICKER",
  SET_CURRENT_DATE = "SET_CURRENT_DATE",
}

export enum WorkingStatus {
  ALL = "",
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  INACTIVE = "INACTIVE",
}

export interface BookingData {
  booking_type: string;
  project_id: string;
  position: string;
  time_off_type: string;
  start_date: string;
  end_date: string;
  allocation: number;
  allocation_type: string;
  note: string;
  service_id: string;
  user_id: string;
}

export const getBookingAll = createAsyncThunk(
  "resource/getBookingAll",
  async (params: IBookingAllFitler) => {
    try {
      const response = await client.get(
        Endpoint.RESOURCE_PLANNING_LIST,
        params,
        {
          baseURL: RESOURCE_API_URL,
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

export const getMyBookingResource = createAsyncThunk(
  "resource/getMyBooking",
  async (params: IBookingAllFitler) => {
    try {
      const response = await client.get(Endpoint.MY_RESOURCE_PLANNING, params, {
        baseURL: RESOURCE_API_URL,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

export const createBookingResource = createAsyncThunk(
  "resource/createBooking",
  async (params: BookingData) => {
    try {
      const response = await client.post(Endpoint.RESOURCE_PLANNING, params, {
        baseURL: RESOURCE_API_URL,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

export const getDetailBooking = createAsyncThunk(
  "resource/getDetailBooking",
  async (id: string) => {
    try {
      const response = await client.get(`${Endpoint.RESOURCE_PLANNING}/${id}`, {
        baseURL: RESOURCE_API_URL,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

export const updateBookingResource = createAsyncThunk(
  "resource/updateBooking",
  async (params: BookingData & { id: string }) => {
    try {
      const response = await client.put(
        `${Endpoint.RESOURCE_PLANNING}/${params.id}`,
        params,
        {
          baseURL: RESOURCE_API_URL,
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

export const deleteBookingResource = createAsyncThunk(
  "resource/deleteBooking",
  async (id: string) => {
    try {
      const response = await client.delete(
        `${Endpoint.RESOURCE_PLANNING}/${id}`,
        {
          baseURL: RESOURCE_API_URL,
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

export const getBudgetServices = createAsyncThunk(
  "resource/getBudgetServices",
  async (params: { project_id: string; budgets: string[] }, { dispatch }) => {
    try {
      const sectionsDispatch = [] as Promise<any>[];

      params.budgets.forEach((budget) => {
        sectionsDispatch.push(dispatch(getServiceBudget(budget)).unwrap());
      });

      const response = await Promise.all(sectionsDispatch).then((res) => {
        const service = res.reduce((acc, cur) => {
          acc.push(...cur.sections);
          return acc;
        }, []);
        return service;
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
);
