import { createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "api/client";
import { Endpoint } from "api/endpoint";
import { HttpStatusCode } from "constant/enums";
import { AN_ERROR_TRY_AGAIN, TIME_SHEET_API_URL } from "constant/index";
import { BaseQueries } from "constant/types";
import { refactorRawItemListResponse } from "utils/index";
import { Maybe } from "yup";
//serverQueries
export enum ProjectStatus {
  ACTIVE = "ACTIVE",
  PAUSE = "PAUSE",
  CLOSE = "CLOSE",
}

export enum DependencyStatus {
  BLOCKING = "BLOCK",
  WAITING_ON = "WAIT",
  LINKED_TO = "LINK",
}

export type GetMyTimeSheetQueries = {
  start_date: string;
  end_date: string;
  search_key?: string;
};

export type GetWorkLogQueries = {
  date: string;
  search_key?: string;
};

export type BodyPinTimeSheet = {
  id: string;
  is_pin: boolean;
  type: string;
};

export type BodyCreateTimeSheet = {
  id: string;
  project_id: string;
  position: string;
  start_time: string;
  type: string;
  day: string;
  duration: number;
  note?: Maybe<string | undefined>;
};
export const getMyTimeSheet = createAsyncThunk(
  "timeTracking/getMyTimeSheet",
  async (queries: GetMyTimeSheetQueries) => {
    const newQueries = { ...queries };

    try {
      const response = await client.get(Endpoint.MY_TIME_SHEET, newQueries, {
        baseURL: TIME_SHEET_API_URL,
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

export const getWorkLog = createAsyncThunk(
  "timeTracking/getWorkLog",
  async (queries: GetWorkLogQueries) => {
    const newQueries = { ...queries };

    try {
      const response = await client.get(Endpoint.WORK_LOG, newQueries, {
        baseURL: TIME_SHEET_API_URL,
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

export const getCompanyTimeSheet = createAsyncThunk(
  "timeTracking/getCompanyTimeSheet",
  async (queries: GetMyTimeSheetQueries) => {
    const newQueries = { ...queries };

    try {
      const response = await client.get(
        Endpoint.COMPANY_TIME_SHEET,
        newQueries,
        {
          baseURL: TIME_SHEET_API_URL,
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

export const createTimeSheet = createAsyncThunk(
  "timeTracking/createTimeSheet",
  async (data: Omit<BodyCreateTimeSheet, "id">) => {
    try {
      const response = await client.post(Endpoint.TIME_SHEET, data, {
        baseURL: TIME_SHEET_API_URL,
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

export const updateTimeSheet = createAsyncThunk(
  "timeTracking/updateTimeSheet",
  async (data: BodyCreateTimeSheet) => {
    try {
      const response = await client.patch(
        `${Endpoint.TIME_SHEET}/${data.id}`,
        data,
        {
          baseURL: TIME_SHEET_API_URL,
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

export const pinTimeSheet = createAsyncThunk(
  "timeTracking/pinTimeSheet",
  async (data: BodyPinTimeSheet) => {
    try {
      const response = await client.post(`${Endpoint.PIN}`, data, {
        baseURL: TIME_SHEET_API_URL,
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

export const deleteTimeSheet = createAsyncThunk(
  "timeTracking/deleteTimeSheet",
  async (data: { id: string }) => {
    try {
      const response = await client.delete(
        `${Endpoint.TIME_SHEET}/${data.id}`,
        {
          baseURL: TIME_SHEET_API_URL,
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

// export const getSameWorker = createAsyncThunk(
//   "timeTracking/sameWorker",
//   async (data: { id: string }) => {
//     try {
//       const response = await client.get(
//         `${Endpoint.SAME_WORKER}/${data.id}`,
//         data,
//         {
//           baseURL: TIME_SHEET_API_URL,
//         },
//       );

//       if (response?.status === HttpStatusCode.CREATED) {
//         return response.data;
//       }
//       throw AN_ERROR_TRY_AGAIN;
//     } catch (error) {
//       throw error;
//     }
//   },
// );

export const getSameWorker = async (data: { id: string }) => {
  const res = await client.get(`${Endpoint.SAME_WORKER}/${data.id}`, data, {
    baseURL: TIME_SHEET_API_URL,
  });

  return res.data;
};
