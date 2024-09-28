import { createAsyncThunk } from "@reduxjs/toolkit";
import { client, Endpoint } from "api";
import { HttpStatusCode } from "constant/enums";
import { AN_ERROR_TRY_AGAIN, AUTH_API_URL } from "constant/index";
import { BaseQueries_Feedback } from "constant/types";
import { PAY_API_URL } from "constant/index";

export type GetListAccounts = BaseQueries_Feedback & {
  query?: string;
};
export type GetAllTransaction = BaseQueries_Feedback & {
  query?: string;
};

interface ChangeAutoRenewalParams {
  email: string;
  auto_renewal: boolean;
}

interface getPriceUpgradePackage {
  newPackage: string;
  billingPlan: string;
  numberOfUser: number;
}

interface changePackageAccountParams {
  email: string;
  packageName: number;
}

interface payParams {
  billing_plan: string;
  packageName: string;
  currency_code: string;
  sub_total: number;
  vat: number;
}

interface getAllAccountAdmin {
  searchKey?: string;
}

interface changeBillOwnerParams {
  email: string;
}
export const getListAccounts = createAsyncThunk(
  "packageManagement/getListAccounts",
  async ({ ...queries }: GetListAccounts) => {
    try {
      const response = await client.get(Endpoint.LIST_ACCOUNTS, queries, {
        baseURL: AUTH_API_URL,
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

export const getAllTransaction = createAsyncThunk(
  "packageManagement/getAllTransaction",
  async ({ ...queries }: GetAllTransaction) => {
    try {
      const response = await client.get(Endpoint.ALL_TRANSACTION, queries, {
        baseURL: PAY_API_URL,
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

export const changeAutoRenewal = createAsyncThunk(
  "packageManagement/changeAutoRenewal",
  async (params: ChangeAutoRenewalParams) => {
    try {
      const response = await client.post(Endpoint.CHANGE_AUTO_RENEWAL, params, {
        baseURL: AUTH_API_URL,
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

export const getPriceUpgradePackage = createAsyncThunk(
  "packageManagement/getPriceUpgradePackage",
  async ({ ...queries }: getPriceUpgradePackage) => {
    try {
      const response = await client.get(
        Endpoint.GET_PRICE_UPGRADE_PACKAGE,
        queries,
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
export const changePackageAccount = createAsyncThunk(
  "packageManagement/changePackageAccount",
  async (params: changePackageAccountParams) => {
    try {
      const response = await client.post(
        Endpoint.CHANGE_PACKAGE_ACCOUNT,
        params,
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

export const pay = createAsyncThunk(
  "packageManagement/pay",
  async (params: payParams) => {
    try {
      const response = await client.post(Endpoint.PAY, params, {
        baseURL: PAY_API_URL,
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

export const getAllAccountAdmin = createAsyncThunk(
  "packageManagement/get-all-account-admin",
  async ({ ...queries }: getAllAccountAdmin) => {
    try {
      const response = await client.get(
        Endpoint.GET_ALL_ACCOUNT_ADMIN,
        queries,
        {
          baseURL: PAY_API_URL,
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

export const getAccountBillOwner = createAsyncThunk(
  "packageManagement/get-account-bill-owner",
  async () => {
    try {
      const response = await client.get(
        Endpoint.GET_ACCOUNT_BILL_OWNER,
        {},
        {
          baseURL: PAY_API_URL,
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
export const changeBillOwner = createAsyncThunk(
  "packageManagement/changeBillOwner",
  async (params: changeBillOwnerParams) => {
    try {
      const response = await client.post(Endpoint.CHANGE_BILL_OWNER, params, {
        baseURL: PAY_API_URL,
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

export const getRequestUpgradePayment = createAsyncThunk(
  "packageManagement/request-upgrade",
  async () => {
    try {
      const response = await client.get(
        Endpoint.REQUEST_UPGRADE,
        {},
        {
          baseURL: PAY_API_URL,
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
