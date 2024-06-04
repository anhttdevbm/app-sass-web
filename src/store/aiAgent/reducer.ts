import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AIAgent, AIAgentState, Command, GetAIAgentsPayload, Knowledge } from "./types";
import {
  addSource,
  createAgent, createCommand,
  deleteAgent,
  deleteSource,
  getAgents,
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
    getAgent: (state, action: PayloadAction<string>) => {
      state.aiAgent = state.aiAgents.find((aiAgent) => aiAgent.id === action.payload);
    },
    setAgents: (state, action: PayloadAction<GetAIAgentsPayload>) => {
      const { data, page, size, total_page } = action.payload;
      state.aiAgents = data;
      state.page = page;
      state.limit = size;
      state.totalPages = total_page;
    }
  },
  extraReducers: (builder) => {
    // Delete ai agent
    builder.addCase(deleteAgent.pending, (state) => {
      state.deleteAgentStatus = DataStatus.LOADING;
    });
    builder.addCase(deleteAgent.fulfilled, (state) => {
      state.deleteAgentStatus = DataStatus.SUCCEEDED;
    });
    builder.addCase(deleteAgent.rejected, (state) => {
      state.deleteAgentStatus = DataStatus.FAILED;
    });

    // Create ai agent
    builder.addCase(createAgent.pending, (state) => {
      state.createAgentStatus = DataStatus.LOADING;
    });
    builder.addCase(createAgent.fulfilled, (state) => {
      state.createAgentStatus = DataStatus.SUCCEEDED;
    });
    builder.addCase(createAgent.rejected, (state) => {
      state.createAgentStatus = DataStatus.FAILED;
    });

    // Update ai agent
    builder.addCase(updateAgent.pending, (state) => {
      state.updateAgentStatus = DataStatus.LOADING;
    });
    builder.addCase(updateAgent.fulfilled, (state, action: PayloadAction<AIAgent>) => {
      state.updateAgentStatus = DataStatus.SUCCEEDED;
    });
    builder.addCase(updateAgent.rejected, (state) => {
      state.updateAgentStatus = DataStatus.FAILED;
    });

    //Manage source
    builder.addCase(addSource.fulfilled, (state, payload: PayloadAction<Knowledge>) => {
      state.listKnowledge.push(payload.payload);
    });
    builder.addCase(deleteSource.fulfilled, (state, payload: PayloadAction<Knowledge>) => {
      state.listKnowledge = state.listKnowledge.filter((knowledge) => knowledge.id !== payload.payload.id);
    });

    // Manage command
    builder.addCase(getCommands.fulfilled, (state, action: PayloadAction<Command[]>) => {
      state.listCommand = action.payload;
    });
    builder.addCase(createCommand.fulfilled, (state, action: PayloadAction<Command>) => {
      state.listCommand.push(action.payload);
    });
  },
});

export const aiAgentReducer = aiAgentSlice.reducer;
export default aiAgentSlice.reducer;
