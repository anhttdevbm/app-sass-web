import { createAsyncThunk } from "@reduxjs/toolkit";
import { client, Endpoint } from "api";
import { HttpStatusCode } from "axios";
import { AN_ERROR_TRY_AGAIN, SALE_API_URL } from "constant/index";

export interface TagData {
  name?: string;
  id?: string;
}

export const createTags = createAsyncThunk(
  "tags/createTags",
  async (data: TagData) => {
    try {
      const response = await client.post(Endpoint.TAGS, data, {
        baseURL: SALE_API_URL,
      });
      if (response?.status === HttpStatusCode.Created) {
        const { data } = response;
        return data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getTags = createAsyncThunk(
  "tags/getTags",
  async (name: string | undefined) => {
    try {
      const response = await client.get(
        Endpoint.TAGS_ALL,
        {
          name,
        },
        {
          baseURL: SALE_API_URL,
        },
      );
      if (response?.status === HttpStatusCode.Ok) {
        const { data } = response;
        return data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);
