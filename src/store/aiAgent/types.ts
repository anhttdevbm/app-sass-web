import { BaseQueries } from "constant/types";
import { DataStatus } from "constant/enums";

export enum StatusAIAgent {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}

export interface AIAgent {
  id: string;
  name: string;
  avatar?: string;
  created_time: string;
  status: StatusAIAgent;
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

  getAgentsStatus: DataStatus;
  deleteAgentStatus: DataStatus;
  createAgentStatus: DataStatus;
  updateAgentStatus: DataStatus;

  aiAgent?: AIAgent;
}

export interface GetAIAgentsPayload {
  data: AIAgent[];
  page: number;
  size: number;
  total_page: number;
}

export interface CreateAIAgentPayload {
  name: string;
  description: string;
  avatar?: string;
}

export interface UpdateAIAgentPayload {
  name?: string;
  description?: string;
  avatar?: string;
  tone?: string;
}
