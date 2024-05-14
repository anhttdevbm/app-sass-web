import { BaseQueries } from "constant/types";

export interface AIAgent {
  id: string;
  name: string;
  avatar: {
    link?: string;
  };
  creationDate: string;
  status: string;
  description?: string;
  tone?: string;
}

export type GetAIAgentListQueries = BaseQueries & {
  searchKey?: string;
};

export interface AIAgentState {
  aiAgents: AIAgent[];
  totalAIAgents: number;
  isReady: boolean;
  aiAgentFilters: Omit<GetAIAgentListQueries, "page" | "size">;
  totalPages: number;
  page: number;
  limit: number;

  aiAgent: AIAgent | null;
}
