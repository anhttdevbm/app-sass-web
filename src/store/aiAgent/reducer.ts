import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AIAgent, AIAgentState, Command, GetAIAgentsPayload, Knowledge } from "./types";
import {
  addSource,
  createAgent,
  createCommand,
  deleteAgent,
  deleteSource,
  getCommands,
  updateAgent,
} from "store/aiAgent/actions";
import { DataStatus } from "constant/enums";

const initialState: AIAgentState = {
  aiAgents: [],
  totalAIAgents: 0,
  isReady: false,
  aiAgentFilters: {},
  totalPages: 0,
  page: 1,
  limit: 10,

  deleteAgentStatus: DataStatus.IDLE,
  createAgentStatus: DataStatus.IDLE,
  updateAgentStatus: DataStatus.IDLE,

  aiAgent: undefined,
  listKnowledge: [],
  listCommand: [],
};

const aiAgentSlice = createSlice({
  name: "aiAgent",
  initialState,
  reducers: {
    setAgents: (state, action: PayloadAction<GetAIAgentsPayload>) => {
      const { data, page, size, total_page, total_agents } = action.payload;
      state.aiAgents = data;
      state.page = page;
      state.limit = size;
      state.totalPages = total_page;
      state.totalAIAgents = total_agents;
    },
    setAgent: (state, action: PayloadAction<AIAgent>) => {
      state.aiAgent = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      // Delete ai agent
      .addCase(deleteAgent.pending, (state) => {
        state.deleteAgentStatus = DataStatus.LOADING;
      })
      .addCase(deleteAgent.fulfilled, (state) => {
        state.deleteAgentStatus = DataStatus.SUCCEEDED;
      })
      .addCase(deleteAgent.rejected, (state) => {
        state.deleteAgentStatus = DataStatus.FAILED;
      })

      // Create ai agent
      .addCase(createAgent.pending, (state) => {
        state.createAgentStatus = DataStatus.LOADING;
      })
      .addCase(createAgent.fulfilled, (state) => {
        state.createAgentStatus = DataStatus.SUCCEEDED;
      })
      .addCase(createAgent.rejected, (state) => {
        state.createAgentStatus = DataStatus.FAILED;
      })

      // Update ai agent
      .addCase(updateAgent.pending, (state) => {
        state.updateAgentStatus = DataStatus.LOADING;
      })
      .addCase(updateAgent.fulfilled, (state, action: PayloadAction<AIAgent>) => {
        state.updateAgentStatus = DataStatus.SUCCEEDED;
      })
      .addCase(updateAgent.rejected, (state) => {
        state.updateAgentStatus = DataStatus.FAILED;
      })

      //Manage source
      .addCase(addSource.fulfilled, (state, payload: PayloadAction<Knowledge>) => {
        state.listKnowledge.push(payload.payload);
      })
      .addCase(deleteSource.fulfilled, (state, payload: PayloadAction<Knowledge>) => {
        state.listKnowledge = state.listKnowledge.filter((knowledge) => knowledge.id !== payload.payload.id);
      })

      // Manage command
      .addCase(getCommands.fulfilled, (state, action: PayloadAction<Command[]>) => {
        state.listCommand = action.payload;
      })
      .addCase(createCommand.fulfilled, (state, action: PayloadAction<Command>) => {
        state.listCommand.push(action.payload);
      });
  },
});

export const aiAgentReducer = aiAgentSlice.reducer;
export default aiAgentSlice.reducer;
