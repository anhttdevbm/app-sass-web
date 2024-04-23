import { createAsyncThunk } from "@reduxjs/toolkit";
import { Endpoint, client } from "api";
import { HttpStatusCode } from "constant/enums";
import { AI_CHAT_API_URL, AN_ERROR_TRY_AGAIN } from "constant/index";
import { serverQueries } from "utils/index";
import { GetExamplePromptQueries, GetChatSessionsQueries } from "./type";

export const getExamplePrompt = createAsyncThunk(
  "aiChat/getExamplePrompt",
  async (queries: GetExamplePromptQueries) => {
    try {
      const response = await client.get(
        Endpoint.AI_CHAT_EXAMPLE_PROMPT,
        queries,
        {
          baseURL: AI_CHAT_API_URL,
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

export const getChatSessions = createAsyncThunk(
  "aiChat/getChatSessions",
  async (queries: GetChatSessionsQueries) => {
    const newQueries = serverQueries(queries) as GetChatSessionsQueries;
    try {
      const response = await client.get(Endpoint.AI_CHAT_SESSION, newQueries, {
        baseURL: AI_CHAT_API_URL,
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
