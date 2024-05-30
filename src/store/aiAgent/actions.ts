import { createAsyncThunk } from "@reduxjs/toolkit";
import { CreateAIAgentPayload, GetAIAgentListQueries } from "./types";
import { client, Endpoint } from "api";
import { AI_AGENT_API_URL, AN_ERROR_TRY_AGAIN, UPLOAD_API_URL } from "constant/index";
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

export const createAgent = createAsyncThunk(
  "aiAgent/createAgent",
  async (data: CreateAIAgentPayload) => {
    try {
      const response = await client.post(
        Endpoint.AI_AGENT_CREATE, data, { baseURL: AI_AGENT_API_URL }
      )

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }

      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const uploadAvatar = createAsyncThunk(
    "aiAgent/uploadAvatar",
  async (file: File) => {
      try {
        return client.upload(Endpoint.UPLOAD_LINK, file)
      } catch (error) {
        throw error;
      }
    },
)

export const getAvatarLink =  createAsyncThunk(
  "aiAgent/getAvatarLink",
  async (id: string) => {
    try {
      const response = await client.post(Endpoint.DOWNLOAD_LINK, [id], { baseURL: UPLOAD_API_URL })

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }

      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
)

export const getPromptTemplates = createAsyncThunk(
  "aiAgent/getPromptTemplates",
  async () => {
    try {
      const response = await client.get(Endpoint.AI_AGENT_PROMPT_TEMPLATE, {}, { baseURL: AI_AGENT_API_URL })

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }

      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);
