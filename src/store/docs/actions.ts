/* eslint-disable @typescript-eslint/no-explicit-any */
import { AN_ERROR_TRY_AGAIN, DOCS_API_URL } from "./../../constant/index";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Endpoint, client } from "api";
import { AxiosRequestConfig } from "axios";
import { HttpStatusCode } from "constant/enums";

export const getDocs = createAsyncThunk(
  "docs/get",
  async ({ ...queries }: any) => {
    try {
      const response = await client.get(Endpoint.DOCS, queries, {
        baseURL: DOCS_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return { ...response.data };
      }

      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getDocHistory = createAsyncThunk(
  "docs/history",
  async (
    { docId, params }: { docId: string; params?: AxiosRequestConfig["params"] },
    { rejectWithValue },
  ) => {
    try {
      const response = await client.get(
        DOCS_API_URL + "/docs/history/" + docId,
        {
          params,
        },
      );
      if (response.status === HttpStatusCode.OK) return response.data;
    } catch (error) {
      rejectWithValue({
        docs: [],
        totalDocs: 0,
        limit: 10,
        totalPages: 1,
        page: 1,
        pagingCounter: 0,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null,
      });
    }
  },
);
