import { createAsyncThunk } from "@reduxjs/toolkit";
import { HttpStatusCode } from "constant/enums";
import { AI_CHAT_API_URL, AN_ERROR_TRY_AGAIN } from "constant/index";
import { refactorRawItemListResponse, serverQueries } from "utils/index";
import { GetExamplePromptQueries } from "./type";
import { Endpoint, client } from "api";
import { RepeatOneSharp } from "@mui/icons-material";

export const getExamplePrompt = createAsyncThunk(
  "aiChat/getExamplePrompt",
  async (queries: GetExamplePromptQueries) => {
    const newQueries = serverQueries(queries, [
      "number_prompt",
    ]) as GetExamplePromptQueries;

    try {
      const response = await client.get(
        Endpoint.AI_CHAT_EXAMPLE_PROMPT,
        newQueries,
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
