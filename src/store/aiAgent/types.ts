import { BaseQueries } from "constant/types";
import { DataStatus } from "constant/enums";

export enum StatusAIAgent {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}

export enum TypeKnowledge {
  LINK = "LINK",
  MEDIA = "MEDIA",
  YOUTUBE = "YOUTUBE",
  FILE = "FILE"
}

export enum StatusKnowledge {
  ACTIVE = "ACTIVE",
  DEACTIVE = "DEACTIVE"
}

export interface AIAgent {
  id: string;
  name: string;
  avatar?: string;
  created_time: string;
  status: StatusAIAgent;
  description?: string;
  tone?: string;
  enableKnowledge: boolean;
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

  deleteAgentStatus: DataStatus;
  createAgentStatus: DataStatus;
  updateAgentStatus: DataStatus;

  aiAgent?: AIAgent;
  listKnowledge: Knowledge[];
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
  enableKnowledge?: boolean;
}

export interface AddSourceInput {
  name: string
  type: string
  agentId: string
}

export interface Knowledge {
  id: string
  name: string
  type: string
  status: string
  agentId: string
}

export interface DeleteSourceInput {
  agentId: string
  knowledgeId: string
}
