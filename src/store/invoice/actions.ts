import { createAsyncThunk } from "@reduxjs/toolkit";
import { client, Endpoint } from "api";
import { HttpStatusCode } from "constant/enums";
import { AN_ERROR_TRY_AGAIN, INVOICE_API_URL } from "constant/index";
import StringFormat from "string-format";
import { Service } from "./reducer";

export type GetInvoiceListQueries = {
  page?: number;
  size?: number;
  query?: string;
};

export const getInvoiceList = createAsyncThunk(
  "Invoice/getInvoiceList",
  async (queries: GetInvoiceListQueries) => {
    const newQueries = { page: 0, size: 10, ...queries };
    try {
      const response = await client.get(Endpoint.INVOICE, newQueries, {
        baseURL: INVOICE_API_URL,
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

export const getInvoiceDetail = createAsyncThunk(
  "Invoice/getInvoiceDetail",
  async (id: string) => {
    try {
      const response = await client.get(
        StringFormat(Endpoint.DETAIL_INVOICE, { id }),
        {},
        {
          baseURL: INVOICE_API_URL,
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

export const getAllPaymentByInvoiceId = createAsyncThunk(
  "Invoice/getPaymentByInvoiceId",
  async (id: string) => {
    try {
      const response = await client.get(
        StringFormat(Endpoint.ALL_CUSTOM_PAYMENT, { id }),
        {},
        {
          baseURL: INVOICE_API_URL,
        },
      );

      // if (response?.status === HttpStatusCode.OK) {
      return response.data;
      // }
      // throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const createNewInvoice = createAsyncThunk(
  "Invoice/createNewInvoice",
  async (formData: any) => {
    try {
      const response = await client.post(Endpoint.INVOICE, formData, {
        baseURL: INVOICE_API_URL,
      });
      console.log("reponse", response.data);

      // if (response?.status === HttpStatusCode.OK) {
      return response.data;
      // }
      // throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const deleteInvoice = createAsyncThunk(
  "Invoice/deleteInvoice",
  async ({ id }: { id: string }) => {
    try {
      const response = await client.delete(
        StringFormat(Endpoint.DETAIL_INVOICE, { id }),
        {
          baseURL: INVOICE_API_URL,
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

export const deleteMultipleInvoice = createAsyncThunk(
  "Invoice/deleteMultipleInvoice",
  async ({ invoice_number }: { invoice_number: string[] }) => {
    try {
      const response = await client.delete(Endpoint.DELETE_MULTIPLE_INVOICES, {
        baseURL: INVOICE_API_URL,
        data: invoice_number,
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

export const updateInvoice = createAsyncThunk(
  "Invoice/updateInvoice",
  async ({ service_items, id }: { service_items: Service[]; id: string }) => {
    try {
      const response = await client.put(
        StringFormat(Endpoint.DETAIL_INVOICE, { id }),
        { service_items },
        {
          baseURL: INVOICE_API_URL,
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
