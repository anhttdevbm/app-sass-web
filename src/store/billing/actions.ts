import { createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "api/client";
import { Endpoint } from "api/endpoint";
import { HttpStatusCode, Status } from "constant/enums";
import {
  AN_ERROR_TRY_AGAIN,
  AN_ERROR_TRY_RELOAD_PAGE,
  BILLING_API_URL,
  SALE_API_URL,
} from "constant/index";
import { BaseQueries, BaseQueries_Billing } from "constant/types";
import { refactorRawItemListResponse, serverQueries } from "utils/index";
import StringFormat from "string-format";

import { Option } from "constant/types";
import { BillingCommentData, BillingDataUpdate } from "./reducer";

export enum BillingStatus {
  OPEN = "Open",
  PAID = "Paid",
  UNPAID = "Unpaid",
}

export enum DependencyStatus {
  BLOCKING = "BLOCK",
  WAITING_ON = "WAIT",
  LINKED_TO = "LINK",
}

export type GetBillingListQueries = BaseQueries_Billing & {
  budgetId?: string;
  status?: BillingStatus;
};
export type GetBudgetListQueries = BaseQueries & {
  // status?: BillingStatus;
};
export type exportBillingQueries = BaseQueries_Billing & {
  fileType?: string;
  pageType?: string;
};
export type BillingData = {};
export type BillingDataExport = {
  bill?: [];
};

export const getBillingList = createAsyncThunk(
  "Billing/getBillingList",
  async (queries: GetBillingListQueries) => {
    let newQueries = {};

    newQueries = { ...queries };

    if (!Object.keys(newQueries).includes("status")) {
      newQueries = { ...queries, status: "Unpaid" };
    }
    // if (newQueries?.sort !== "updated_time=-1") {
    //   newQueries.sort = "created_time=-1";
    // }

    // newQueries = serverQueries(newQueries, ["name"]) as GetBillingListQueries;

    // console.log(newQueries);

    try {
      const response = await client.get(Endpoint.BILLING, newQueries, {
        baseURL: BILLING_API_URL,
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

export const getBillingDetail = createAsyncThunk(
  "Billing/getBillingDetail",
  async (id: string) => {
    // if (newQueries?.sort !== "updated_time=-1") {
    //   newQueries.sort = "created_time=-1";
    // }

    try {
      const response = await client.get(
        StringFormat(Endpoint.DETAIL_BILLING, { id }),
        {},
        {
          baseURL: BILLING_API_URL,
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

export const getBudgetList = createAsyncThunk(
  "Billing/getBudgetList",
  async (queries: GetBudgetListQueries) => {
    let newQueries = { ...queries };

    // if (newQueries?.sort !== "updated_time=-1") {
    //   newQueries.sort = "created_time=-1";
    // }

    newQueries = serverQueries(newQueries, ["name"]) as GetBudgetListQueries;

    try {
      const response = await client.get(Endpoint.BUDGET, newQueries, {
        baseURL: SALE_API_URL,
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

export const getBudgetDetail = createAsyncThunk(
  "Billing/getBudgetDetail",
  async (id: string) => {
    try {
      const response = await client.get(
        Endpoint.DETAIL_BUDGET + "/" + id,
        // StringFormat(Endpoint.DETAIL_BUDGET, { id }),
        {},
        {
          baseURL: SALE_API_URL,
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

export const getServiceBudget = createAsyncThunk(
  "Billing/getServiceBudget",
  async (id: string) => {
    try {
      const response = await client.get(
        StringFormat(Endpoint.SERVICE_BY_BUDGET, { id }),
        {},
        {
          baseURL: SALE_API_URL,
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

// export const getBilling = createAsyncThunk(
//   "Billing/getBilling",
//   async (id: string) => {
//     try {
//       const response = await client.get(
//         StringFormat(Endpoint.Billing_ITEM, { id }),
//       );

//       if (response?.status === HttpStatusCode.OK) {
//         return response.data;
//       }
//       throw AN_ERROR_TRY_AGAIN;
//     } catch (error) {
//       throw error;
//     }
//   },
// );

export const createBilling = createAsyncThunk(
  "Billing/createBilling",
  async (data: BillingData) => {
    try {
      const response = await client.post(Endpoint.BILLING, data, {
        baseURL: BILLING_API_URL,
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

export const updateBilling = createAsyncThunk(
  "Billing/updateBilling",
  async (data: BillingDataUpdate) => {
    try {
      const response = await client.put(
        `${Endpoint.BILLING}/${data?.id}`,
        data,
        { baseURL: BILLING_API_URL },
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

export const createCommentBilling = createAsyncThunk(
  "Billing/createCommentBilling",
  async (data: BillingCommentData) => {
    try {
      const response = await client.post(Endpoint.INTERACTION_BILLING, data, {
        baseURL: BILLING_API_URL,
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

export const getCommentBilling = createAsyncThunk(
  "Billing/getCommentBilling",
  async (id: string) => {
    try {
      const response = await client.get(
        StringFormat(Endpoint.INTERACTION_BILLING_BY_BILL, { id }),
        {},
        {
          baseURL: BILLING_API_URL,
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

export const exportBilling = createAsyncThunk(
  "Billing/exportBilling",
  async ({
    queries,
    data,
  }: {
    queries: exportBillingQueries;
    data: BillingDataExport;
  }) => {
    try {
      const response = await client.post(Endpoint.EXPORT_BILLING, data, {
        params: queries,
        baseURL: BILLING_API_URL,
        responseType:
          queries.fileType == "xlsx"
            ? "blob"
            : queries.fileType == "csv"
            ? "text/csv"
            : "arraybuffer",
      });

      if (response?.status === HttpStatusCode.OK) {
        return {
          response: response.data,
          fileType: queries.fileType,
          dataBill: data?.bill,
        };
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const downloadPdfBilling = createAsyncThunk(
  "Billing/downloadPdfBilling",
  async ({
    queries,
    data,
  }: {
    queries: exportBillingQueries;
    data: BillingDataExport;
  }) => {
    try {
      const response = await client.post(Endpoint.EXPORT_BILLING, data, {
        params: queries,
        baseURL: BILLING_API_URL,
        responseType: "arraybuffer",
      });

      if (response?.status === HttpStatusCode.OK) {
        return {
          response: response.data,
          fileType: queries.fileType,
          dataBill: data?.bill,
        };
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const viewPdfBilling = createAsyncThunk(
  "Billing/viewPdfBilling",
  async ({
    queries,
    data,
  }: {
    queries: exportBillingQueries;
    data: BillingDataExport;
  }) => {
    try {
      const response = await client.post(Endpoint.EXPORT_BILLING, data, {
        params: queries,
        baseURL: BILLING_API_URL,
        responseType: "arraybuffer",
      });

      if (response?.status === HttpStatusCode.OK) {
        return {
          response: response.data,
          fileType: queries.fileType,
          dataBill: data?.bill,
        };
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const addUserToBilling = createAsyncThunk(
  "Billing/addUserToBilling",
  async ({ id, userId }: { id: string; userId: string }) => {
    try {
      const response = await client.put(
        Endpoint.ADD_USER_BILL,
        { id, userId },
        {
          baseURL: BILLING_API_URL,
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
