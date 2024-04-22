import { DataStatus } from "constant/enums";
import { BaseQueries } from "constant/types";

export type ExamplePrompt = {
  id: number;
  prompt: string;
};

export type GetExamplePromptQueries = BaseQueries & {
  number_prompt: number;
};

export type AIChatState = {
  examplePrompts?: ExamplePrompt[];
  status: DataStatus;
  error?: string;
  filters: GetExamplePromptQueries;
};
