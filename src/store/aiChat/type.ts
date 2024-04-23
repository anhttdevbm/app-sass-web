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

export type SelectChatAI = {
  id: number;
  name: string;
  description: string;
}

export type GetExamplePromptQueries = {
  number_prompt: number;
};

export type AIChatState = {
  chatSessions: ChatSession[];
  chatSessionsStatus: DataStatus;
  chatSessionsError?: string;
  chatSessionsFilters: Omit<GetChatSessionsQueries, "pageIndex" | "pageSize">;
  chatSessionsNextPage: number;
  deleteAllChatSessionsStatus: DataStatus;
  deleteAllChatSessionsError: string | undefined;

  examplePrompts: ExamplePrompt[];
  examplePromptsStatus: DataStatus;
  examplePromptsError?: string;
  examplePromptsFilters: GetExamplePromptQueries;

  persona: SelectChatAI[];
  personaStatus: DataStatus;
  personaError?: string;
  personaFilters: GetPersonaQueries;

  tone: SelectChatAI[];
  toneStatus: DataStatus;
  toneError?: string;
  toneFilters: GetToneQueries;
};

export type GetChatSessionsQueries = BaseQueries & {
  chat_name?: string;
};

export type EditChatSessionQueries = {
  id: string;
};

export type ChatSessionData = {
  chatname?: string;
  persona: string;
  tone: string;
  chat_status: string;
  user_prompt: string;
  file?: File;
};

export type GetOpenAIChatQueries = BaseQueries & {
  id: string;
};

export type GetPersonaQueries = BaseQueries;

export type GetToneQueries = BaseQueries;

export type DeleteAllChatSessionQueries = {
  userId: string;
}
