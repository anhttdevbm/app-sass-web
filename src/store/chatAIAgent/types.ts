import { File } from "store/aiChat/type";
import { DataStatus } from "constant/enums";

export type SendChatData = {
  tone?: string;
  agentId: string;
  user_prompt: string;
  lang: string;
  files?: File[];
};

export type ChatResponse = {
  id?: string;
  tone?: string;
  agentId?: string;
  user_prompt: string;
  assistant_content: string;
  created_at?: string;
  files?: File[]
};

export type GetChatRequest = {
  agentId: string;
  queries: ChatFilter;
}

export type GetChatPayload = {
  page: number;
  messages: ChatResponse[];
  has_next_page: boolean;
}

export type ChatFilter = {
  page: number;
  limit?: number;
};

export type ChatAIAgentState = {
  chatData: ChatResponse[];
  page: number;
  hasNextPage: boolean;
  chatAIStatus: DataStatus;
};

