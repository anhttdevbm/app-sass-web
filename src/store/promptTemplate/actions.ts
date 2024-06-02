import { createAsyncThunk } from "@reduxjs/toolkit";
import { client, Endpoint } from "../../api";
import { AI_AGENT_API_URL, AN_ERROR_TRY_AGAIN } from "constant/index";
import { HttpStatusCode } from "constant/enums";

export const getPromptTemplates = createAsyncThunk(
  "aiAgent/getPromptTemplates",
  async () => {
    try {
      const response = await client.get(Endpoint.AI_AGENT_PROMPT_TEMPLATE, {}, { baseURL: AI_AGENT_API_URL })

      if (response?.status === HttpStatusCode.OK) {
        return response.data.data;
      }

      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);
