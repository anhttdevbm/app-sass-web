import { DataStatus } from "constant/enums";
import { BaseQueries } from "constant/types";
import { Omit } from "lodash";

export type ExamplePrompt = {
  id: number;
  prompt: string;
};

export type ChatSession = {
  id: string;
  uid: string;
  chatname: string;
  status: string;
  last_question_at: string;
  created_at: string;
};

export type GetExamplePromptQueries = {
  number_prompt: number;
};

export type AIChatState = {
  chatSessions: ChatSession[];
  chatSessionsStatus: DataStatus;
  chatSessionsError?: string;
  chatSessionsFilters: Omit<GetChatSessionsQueries, "pageIndex" | "pageSize">;
  chatSessionsNextPage: number;

  examplePrompts?: ExamplePrompt[];
  examplePromptsStatus: DataStatus;
  examplePromptsError?: string;
  examplePromptsFilters: GetExamplePromptQueries;
};

export type GetChatSessionsQueries = BaseQueries & {
  chat_name?: string;
};
