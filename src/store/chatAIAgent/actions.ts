import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { ChatFilter, ChatResponse, GetChatRequest, SendChatData } from "store/chatAIAgent/types";
import { client, Endpoint } from "../../api";
import { AI_AGENT_API_URL, AN_ERROR_TRY_AGAIN } from "constant/index";
import { HttpStatusCode } from "constant/enums";

export const chat = createAsyncThunk(
  "chatAIAgent/chat",
  async (data: SendChatData) => {
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

      const response = await client.post(
        Endpoint.AI_AGENT_CHAT+`/${data.agentId}`, formData, { baseURL: AI_AGENT_API_URL }
      )

      if (response?.status === HttpStatusCode.OK) {
        return response.data.data;
      }

      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  }
);

export const getChat = createAsyncThunk(
  "chatAIAgent/getChat",
  async ({agentId, queries} : GetChatRequest) => {
    try {
      const response = await client.get(
        Endpoint.AI_AGENT_CHAT+`/${agentId}`, queries, { baseURL: AI_AGENT_API_URL }
      )

      if (response?.status === HttpStatusCode.OK) {
        return response.data.data;
      }

      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  }
)

export const addChat = createAction<ChatResponse>("chatAIAgent/addChat");

