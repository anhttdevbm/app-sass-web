import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  AddSourceInput,
  AIAgent,
  CreateAIAgentPayload, CreateCommandInput,
  DeleteSourceInput,
  GetAIAgentListQueries, GetAIAgentsPayload,
  UpdateAIAgentPayload,
} from "./types";
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

export const getAgent = createAsyncThunk(
  "aiAgent/getAgent",
  async (id: string) => {
    try {
      const response = await client.get(
        `${Endpoint.AI_AGENT}/${id}/detail`, undefined,{baseURL: AI_AGENT_API_URL}
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

export const uploadFile = createAsyncThunk(
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

export const updateAgent = createAsyncThunk(
  "aiAgent/updateAgent",
  async ({ id, data }: { id: string; data: UpdateAIAgentPayload }) => {
    try {
      const response = await client.put(
        `${Endpoint.AI_AGENT_UPDATE}/${id}`, data, { baseURL: AI_AGENT_API_URL }
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

export const addSource = createAsyncThunk(
  "aiAgent/addSource",
  async (data: AddSourceInput) => {
    try {
      const response = await client.post(
        Endpoint.AI_AGENT_ADD_SOURCE, data, { baseURL: AI_AGENT_API_URL }
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

export const getSources = createAsyncThunk(
  "aiAgent/getSources",
  async (agentId: string) => {
    try {
      const response = await client.get(
        `${Endpoint.AI_AGENT_GET_SOURCE.replace(':agentId', agentId)}`, {},{ baseURL: AI_AGENT_API_URL }
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

export const resyncSource = createAsyncThunk(
  "aiAgent/resyncSource",
  async (knowledgeId: string) => {
    try {
      const response = await client.post( Endpoint.AI_AGENT_RESYNCE_SOURCE+`/${knowledgeId}`, {}, { baseURL: AI_AGENT_API_URL });

      if (response?.status === HttpStatusCode.OK) {
        return response.data.data;
      }

      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const deleteSource = createAsyncThunk(
  "aiAgent/deleteSource",
  async ({agentId, knowledgeId}: DeleteSourceInput) => {
    try {
      const endpoint = Endpoint.AI_AGENT_DELETE_SOURCE
        .replace(':agentID', agentId)
        .replace(':knowledgeId', knowledgeId);

      const response = await client.delete(endpoint, { baseURL: AI_AGENT_API_URL });

      if (response?.status === HttpStatusCode.OK) {
        return response.data.data;
      }

      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const createCommand = createAsyncThunk(
  "aiAgent/createCommand",
  async (data: CreateCommandInput) => {
    try {
      const response = await client.post(
        Endpoint.AI_AGENT_CREATE_COMMAND, data, { baseURL: AI_AGENT_API_URL }
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

export const getCommands = createAsyncThunk(
  "aiAgent/getCommands",
  async (id: string) => {
    try {
      const response = await client.get(
        `${Endpoint.AI_AGENT_GET_COMMAND.replace(':agentId', id)}`, {},{ baseURL: AI_AGENT_API_URL }
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

export const setAgents = createAction<GetAIAgentsPayload>("aiAgent/setAgents");

export const setAgent = createAction<AIAgent>("aiAgent/setAgent");
