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
  updated_at: string;
};

export type SelectChatAI = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

export type GetExamplePromptQueries = {
  number_prompt: number;
};

export type AIChatState = {
  chatSessions: ChatSession[];
  chatSessionsStatus: DataStatus;
  chatSessionsError?: string;
  chatSessionsFilters: Omit<GetChatSessionsQueries, "pageIndex" | "pageSize">;
  chatSessionsNextPage?: number;
  deleteAllChatSessionsStatus: DataStatus;
  deleteAllChatSessionsError: string | undefined;

  chatSession?: string;
  chatSessionStatus: DataStatus;
  chatSessionError?: string;
  chatSessionFilters?: { id: string };
  newChatSessionCreated?: string;

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

  openAIChat: OpenAIChat[];
  openAIChatStatus: DataStatus;
  openAIChatError?: string;
  openAIChatFilters?: GetOpenAIChatQueries;

  chatAIStatus: DataStatus;
};

export type GetChatSessionsQueries = BaseQueries & {
  chat_name?: string;
};

export type EditChatSessionQueries = {
  id: string;
};

export type ChatSessionData = {
  chatname?: string;
};

export type GetPersonaQueries = BaseQueries;

export type GetToneQueries = BaseQueries;

export type DeleteAllChatSessionQueries = {
  userId: string;
};

export type ChatWithAIData = {
  persona: string;
  tone: string;
  chat_session?: string;
  user_prompt: string;
  lang: string;
  files?: File[];
};

export type File = Blob & {
  name?: string;
  type?: string;
  link?: string;
  size?: number;
}

export type OpenAIChat = {
  id?: string;
  persona: string;
  tone: string;
  system_prompt?: string;
  user_prompt: string;
  assistant_content: string;
  model?: string;
  chat_session?: string;
  created_at?: string;
  files?: File[]
};

export type GetOpenAIChatQueries = {
  page?: number;
  id?: string;
};
