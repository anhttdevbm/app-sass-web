import { createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "api";
import { HttpStatusCode } from "constant/enums";
import {
  AN_ERROR_TRY_AGAIN,
  AUTH_API_URL,
  CHAT_API_URL,
  UPLOAD_API_URL,
} from "constant/index";
import { UrlsQuery, MediaQuery } from "./typeMedia";
import { AxiosError } from "axios";

export const getChatUrls = createAsyncThunk(
  "chat/getChatUrls",
  async (params: UrlsQuery, { rejectWithValue }) => {
    try {
      const response = await client.post("getChatUrls", params, {
        baseURL: CHAT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data["error"]);
      } else {
        throw error;
      }
    }
  },
);

export const getChatRoomFile = createAsyncThunk(
  "chat/roomFiles",
  async (params: MediaQuery) => {
    try {
      const response = await client.post("roomFiles", params, {
        baseURL: CHAT_API_URL,
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

export const uploadFile = createAsyncThunk(
  "chat/uploadFiles",
  async ({ endpoint, file }: { endpoint: string; file: File }) => {
    try {
      let response = await client.get(
        `${endpoint}/${file.name}`,
        { type: file.type },
        {
          baseURL: UPLOAD_API_URL,
        },
      );

      if (response?.status === HttpStatusCode.OK) {
        const fileUpload = response.data;
        response = await client.put(response.data.upload, file);
        if (response?.status === HttpStatusCode.OK) {
          return { ...fileUpload, type: file.type, title: file.name };
        }
        throw AN_ERROR_TRY_AGAIN;
      } else {
        throw AN_ERROR_TRY_AGAIN;
      }
    } catch (error) {
      throw error;
    }
  },
);
