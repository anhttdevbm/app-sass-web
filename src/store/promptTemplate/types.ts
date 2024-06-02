import { DataStatus } from "constant/enums";

export interface PromptTemplate {
  id: string;
  name: string;
  icon?: React.ReactNode;
  description: string;
  category: string;
  created_time?: string;
  updated_time?: string;
}

export interface PromptTemplateGroup {
  total: number;
  data: PromptTemplate[];
}

export interface PromptTemplateDynamicState {
  [category: string]: PromptTemplateGroup;
}

export interface PromptTemplateState {
  promptTemplates: PromptTemplateDynamicState;
  getPromptTemplatesStatus: DataStatus;
}
