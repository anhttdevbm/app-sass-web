import { createAsyncThunk } from "@reduxjs/toolkit";
import { client, Endpoint } from "api";
import { HttpStatusCode, Status } from "constant/enums";
import { AN_ERROR_TRY_AGAIN, INVOICE_API_URL } from "constant/index";

export type GetInvoiceListQueries = {
  page?: number;
  size?: number;
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
