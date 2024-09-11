import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { client, Endpoint } from "api";
import { HttpStatusCode } from "constant/enums";
import { AI_CHAT_API_URL, AN_ERROR_TRY_AGAIN } from "constant/index";
import { serverQueries } from "utils/index";
import {
  ChatSessionData,
  ChatWithAIData,
  GetChatSessionsQueries,
  GetExamplePromptQueries,
  GetOpenAIChatQueries,
  GetPersonaQueries,
  GetToneQueries,
  OpenAIChat,
} from "./type";

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

export const editChatSession = createAsyncThunk(
  "aiChat/editChatSession",
  async ({ id, ...data }: Partial<ChatSessionData> & { id: string }) => {
    try {
      const response = await client.put(
        `${Endpoint.AI_CHAT}/${id}`,
        data,
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

export const deleteChatSession = createAsyncThunk(
  "aiChat/deleteChatSession",
  async (id: string) => {
    try {
      const response = await client.delete(
        `${Endpoint.AI_CHAT}/${id}`,
        {
          baseURL: AI_CHAT_API_URL,
        },
      );
      if (response?.status === 204) {
        return id;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const createChatSession = createAsyncThunk(
  "aiChat/createChatSession",
  async (data: ChatSessionData) => {
    try {
      const response = await client.post(Endpoint.AI_CHAT_SESSION + "/", data, {
        baseURL: AI_CHAT_API_URL,
      });
      if (response?.status === HttpStatusCode.CREATED) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const chatWithAI = createAsyncThunk(
  "aiChat/chatWithAI",
  async (data: ChatWithAIData) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (item instanceof File) {
              formData.append(`${key}`, item, item.name);
            }
          });
        } else {
          formData.append(key, value);
        }
      });

      const response = await client.post(Endpoint.AI_CHAT + "/", formData, {
        baseURL: AI_CHAT_API_URL,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.status === HttpStatusCode.CREATED) {        
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getOpenAIChat = createAsyncThunk(
  "aiChat/getOpenAIChat",
  async (queries: GetOpenAIChatQueries) => {
    try {
      const response = await client.get(
        `${Endpoint.AI_CHAT}/${queries.chat_session_id}`,
        {
          page: queries.page,
        },
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

export const getPersona = createAsyncThunk(
  "aiChat/getPersona",
  async (queries: GetPersonaQueries) => {
    const newQueries = serverQueries(queries) as GetPersonaQueries;

    try {
      const response = await client.get(Endpoint.AI_CHAT_PERSONA, newQueries, {
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

export const getTone = createAsyncThunk(
  "aiChat/getTone",
  async (queries: GetToneQueries) => {
    const newQueries = serverQueries(queries) as GetToneQueries;

    try {
      const response = await client.get(Endpoint.AI_CHAT_TONE, newQueries, {
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

export const deleteAllChatSessions = createAsyncThunk(
  "aiChat/deleteAllChatSessions",
  async () => {
    try {
      const response = await client.delete(Endpoint.AI_CHAT_SESSION, {
        baseURL: AI_CHAT_API_URL,
      });
      if (response?.status === 204) {
        return true;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const setSelectedChatId = createAction<string | undefined>(
  "aiChat/setSelectedChatId",
);

export const newChat = createAction<void>("aiChat/newChat");

export const addChatWithAI = createAction<OpenAIChat>("aiChat/addChatWithAI");

export const addNewChatSession = createAction<ChatSessionData>( "aiChat/addNewChatSession");
