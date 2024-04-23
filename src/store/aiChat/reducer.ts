import { createSlice } from "@reduxjs/toolkit";
import { DataStatus } from "constant/enums";
import { AN_ERROR_TRY_AGAIN } from "constant/index";
import {
  deleteChatSession,
  editChatSession,
  getChatSessions,
  getExamplePrompt,
} from "./actions";
import { AIChatState } from "./type";

const initialState: AIChatState = {
  chatSessions: [],
  chatSessionsStatus: DataStatus.IDLE,
  chatSessionsError: undefined,
  chatSessionsFilters: {},
  chatSessionsNextPage: 1,

  examplePrompts: undefined,
  examplePromptsStatus: DataStatus.IDLE,
  examplePromptsError: undefined,
  examplePromptsFilters: { number_prompt: 6 },
};

const aiChatSlice = createSlice({
  name: "aiChat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get example prompts
      .addCase(getExamplePrompt.pending, (state) => {
        state.examplePromptsStatus = DataStatus.LOADING;
      })
      .addCase(getExamplePrompt.fulfilled, (state, { payload }) => {
        const data = payload;
        state.examplePromptsStatus = DataStatus.SUCCEEDED;
        state.examplePrompts = data;
      })
      .addCase(getExamplePrompt.rejected, (state, action) => {
        state.examplePromptsStatus = DataStatus.FAILED;
        state.examplePromptsError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
      })

      // get chat sessions
      .addCase(getChatSessions.pending, (state) => {
        state.chatSessionsStatus = DataStatus.LOADING;
      })
      .addCase(getChatSessions.fulfilled, (state, { payload }) => {
        state.chatSessionsStatus = DataStatus.SUCCEEDED;
        state.chatSessions.push(...payload.results);

        let pageNumber;

        if (payload.next) {
          const url = new URL(payload.next);
          const pageNumberString = url.searchParams.get("page");
          pageNumber = Number(pageNumberString);
        }

        state.chatSessionsNextPage = pageNumber;
      })
      .addCase(getChatSessions.rejected, (state, action) => {
        state.chatSessionsStatus = DataStatus.FAILED;
        state.chatSessionsError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
      })

      // edit chat session
      .addCase(editChatSession.pending, (state) => {
        state.chatSessionsStatus = DataStatus.LOADING;
      })
      .addCase(editChatSession.fulfilled, (state, { payload }) => {
        state.chatSessionsStatus = DataStatus.SUCCEEDED;
        const index = state.chatSessions.findIndex(
          (chatSession) => chatSession.id === payload.id,
        );
        if (index !== -1) {
          state.chatSessions[index] = payload;
        }
      })
      .addCase(editChatSession.rejected, (state, action) => {
        state.chatSessionsStatus = DataStatus.FAILED;
        state.chatSessionsError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
      })

      // delete chat session
      .addCase(deleteChatSession.pending, (state) => {
        state.chatSessionsStatus = DataStatus.LOADING;
      })
      .addCase(deleteChatSession.fulfilled, (state, { payload }) => {
        state.chatSessionsStatus = DataStatus.SUCCEEDED;
        state.chatSessions = state.chatSessions.filter(
          (chatSession) => chatSession.id !== payload,
        );
      })
      .addCase(deleteChatSession.rejected, (state, action) => {
        state.chatSessionsStatus = DataStatus.FAILED;
        state.chatSessionsError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
      });
  },
});

export const aiChatReducer = aiChatSlice.reducer;
export default aiChatSlice.reducer;
