import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetAIAgentListQueries } from "./types";
import { client, Endpoint } from "api";
import { AI_AGENT_API_URL, AI_CHAT_API_URL, AN_ERROR_TRY_AGAIN } from "constant/index";
import { HttpStatusCode } from "constant/enums";

export const getAgents = createAsyncThunk(
  "aiAgent/getAgents",
  async (queries: GetAIAgentListQueries) => {
    try {
      const response = await client.get(
        Endpoint.AI_AGENT, queries, { baseURL: AI_AGENT_API_URL }
      )

      if (response?.status === HttpStatusCode.OK) {
        return response.data.data;
      }

      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const deleteAgent = createAsyncThunk(
  "aiAgent/deleteAgent",
  async (id: string) => {
    try {
      const response = await client.delete(
        `${Endpoint.AI_AGENT_DELETE}/${id}`, { baseURL: AI_AGENT_API_URL }
      )

      if (response?.status === HttpStatusCode.OK) {
        return id;
      }

      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);
