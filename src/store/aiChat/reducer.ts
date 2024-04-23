import { createSlice } from "@reduxjs/toolkit";
import { DataStatus } from "constant/enums";
import { AN_ERROR_TRY_AGAIN } from "constant/index";
import {
  chatWithAI,
  createChatSession,
  deleteChatSession,
  editChatSession,
  getChatSessions,
  getExamplePrompt,
  getPersona,
  getTone,
} from "./actions";
import { AIChatState } from "./type";

const initialState: AIChatState = {
  chatSessions: [],
  chatSessionsStatus: DataStatus.IDLE,
  chatSessionsError: undefined,
  chatSessionsFilters: {},
  chatSessionsNextPage: 1,

  examplePrompts: [],
  examplePromptsStatus: DataStatus.IDLE,
  examplePromptsError: undefined,
  examplePromptsFilters: { number_prompt: 6 },

  persona: [],
  personaStatus: DataStatus.IDLE,
  personaError: undefined,
  personaFilters: {},

  tone: [],
  toneStatus: DataStatus.IDLE,
  toneError: undefined,
  toneFilters: {},
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
      })

      // create chat session
      .addCase(createChatSession.pending, (state) => {
        state.chatSessionsStatus = DataStatus.LOADING;
      })
      .addCase(createChatSession.fulfilled, (state, { payload }) => {
        state.chatSessionsStatus = DataStatus.SUCCEEDED;
        state.chatSessions.push(payload);
      })
      .addCase(createChatSession.rejected, (state, action) => {
        state.chatSessionsStatus = DataStatus.FAILED;
        state.chatSessionsError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
      })

      // chat with AI
      .addCase(chatWithAI.pending, (state) => {
        state.chatSessionsStatus = DataStatus.LOADING;
      })
      .addCase(chatWithAI.fulfilled, (state, { payload }) => {
        state.chatSessionsStatus = DataStatus.SUCCEEDED;

        const index = state.chatSessions.findIndex(
          (chatSession) => chatSession.id === payload.id,
        );
        if (index !== -1) {
          state.chatSessions[index] = payload;
        }
      })
      .addCase(chatWithAI.rejected, (state, action) => {
        state.chatSessionsStatus = DataStatus.FAILED;
        state.chatSessionsError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
      })

      // Get persona
      .addCase(getPersona.pending, (state) => {
        state.personaStatus = DataStatus.LOADING;
      })
      .addCase(getPersona.fulfilled, (state, { payload }) => {
        state.personaStatus = DataStatus.SUCCEEDED;
        state.persona.push(...payload.results);

        let pageNumber;

        if (payload.next) {
          const url = new URL(payload.next);
          const pageNumberString = url.searchParams.get("page");
          pageNumber = Number(pageNumberString);
        }

        state.personaFilters = { ...state.personaFilters, pageIndex: pageNumber };
      })
      .addCase(getPersona.rejected, (state, action) => {
        state.personaStatus = DataStatus.FAILED;
        state.personaError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
      })

      // Get tone
      .addCase(getTone.pending, (state) => {
        state.toneStatus = DataStatus.LOADING;
      })
      .addCase(getTone.fulfilled, (state, { payload }) => {
        state.toneStatus = DataStatus.SUCCEEDED;
        state.tone.push(...payload.results);

        let pageNumber;

        if (payload.next) {
          const url = new URL(payload.next);
          const pageNumberString = url.searchParams.get("page");
          pageNumber = Number(pageNumberString);
        }

        state.toneFilters = { ...state.toneFilters, pageIndex: pageNumber };
      })
      .addCase(getTone.rejected, (state, action) => {
        state.toneStatus = DataStatus.FAILED;
        state.toneError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
      });
  },
});

export const aiChatReducer = aiChatSlice.reducer;
export default aiChatSlice.reducer;
