import { File } from "store/aiChat/type";
import { DataStatus } from "constant/enums";

export type SendChatData = {
  tone: string;
  ai_agent: string;
  user_prompt: string;
  lang: string;
  files?: File[];
};

export type ChatResponse = {
  id?: string;
  tone: string;
  user_prompt: string;
  assistant_content: string;
  created_at?: string;
  files?: File[]
};

export type ChatAIAgentState = {
  chatData: ChatResponse[];
  page?: number;
  chatAIStatus: DataStatus;
};

