import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DataStatus } from "constant/enums";
import { AN_ERROR_TRY_AGAIN } from "constant/index";
import {
  chatWithAI,
  createChatSession,
  deleteAllChatSessions,
  deleteChatSession,
  editChatSession,
  getChatSessions,
  getExamplePrompt,
  getOpenAIChat,
  getPersona,
  getTone,
} from "./actions";
import { AIChatState, ChatSession, ChatSessionData, OpenAIChat } from "./type";
import { getPageNumber } from "./helper";

const initialState: AIChatState = {
  chatSessions: [],
  chatSessionsStatus: DataStatus.IDLE,
  chatSessionsError: undefined,
  chatSessionsFilters: {},
  chatSessionsNextPage: 1,
  deleteAllChatSessionsStatus: DataStatus.IDLE,
  deleteAllChatSessionsError: undefined,

  chatSession: undefined,
  chatSessionStatus: DataStatus.IDLE,
  chatSessionError: undefined,
  chatSessionFilters: { id: "" },
  newChatSessionCreated: undefined,

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

  openAIChat: [],
  openAIChatStatus: DataStatus.IDLE,
  openAIChatError: undefined,
  openAIChatFilters: {},

  chatAIStatus: DataStatus.IDLE,
};

const aiChatSlice = createSlice({
  name: "aiChat",
  initialState,
  reducers: {
    setSelectedChatId: (state, action: PayloadAction<string | undefined>) => {
      state.chatSession = action.payload;
    },
    newChat: (state, action) => {
      state.chatSession = undefined;
      state.newChatSessionCreated = undefined;
      state.openAIChat = [];
    },
    addChatWithAI: (state, action: PayloadAction<OpenAIChat>) => {
      state.openAIChat.unshift(action.payload);
    },
    addNewChatSession: (state, action: PayloadAction<ChatSessionData>) => {
      state.chatSessions.unshift({
        ...action.payload,
        last_question_at: new Date().toISOString(),
      } as ChatSession);
    }
  },
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

        const newChatSessions = payload.results.filter(
          (newChatSession) =>
            !state.chatSessions.some(
              (existingChatSession) =>
                existingChatSession.id === newChatSession.id,
            ),
        );

        state.chatSessions.push(...newChatSessions);

        state.chatSessionsNextPage = getPageNumber(payload.next);
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
          state.chatSessions.splice(index, 1);
          state.chatSessions.unshift(payload);
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

        if (state.chatSession === payload) {
          state.chatSession = undefined;
        }
      })
      .addCase(deleteChatSession.rejected, (state, action) => {
        state.chatSessionsStatus = DataStatus.FAILED;
        state.chatSessionsError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
      })

      // create chat session
      .addCase(createChatSession.pending, (state) => {
        state.chatSessionStatus = DataStatus.LOADING;
      })
      .addCase(createChatSession.fulfilled, (state, { payload }) => {
        state.chatSessionsStatus = DataStatus.SUCCEEDED;
        state.newChatSessionCreated = payload.chat_session;
        state.chatSessions[0].id = payload.chat_session;
      })
      .addCase(createChatSession.rejected, (state, action) => {
        state.chatSessionStatus = DataStatus.FAILED;
        state.chatSessionError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
      })

      // chat with AI
      .addCase(chatWithAI.pending, (state) => {
        state.chatAIStatus = DataStatus.LOADING;
      })
      .addCase(chatWithAI.fulfilled, (state, { payload }) => {
        state.chatAIStatus = DataStatus.SUCCEEDED;

        if (state.openAIChat.length > 0) {
          state.openAIChat[0].assistant_content = payload.AI;
        }
      })
      .addCase(chatWithAI.rejected, (state, action) => {
        state.chatAIStatus = DataStatus.FAILED;
        state.chatSessionsError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
      })

      // Get persona
      .addCase(getPersona.pending, (state) => {
        state.personaStatus = DataStatus.LOADING;
      })
      .addCase(getPersona.fulfilled, (state, { payload }) => {
        state.personaStatus = DataStatus.SUCCEEDED;
        state.persona.push(...payload.results);
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
      })
      .addCase(getTone.rejected, (state, action) => {
        state.toneStatus = DataStatus.FAILED;
        state.toneError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
      })

      // Delete all chat sessions
      .addCase(deleteAllChatSessions.pending, (state) => {
        state.deleteAllChatSessionsStatus = DataStatus.LOADING;
      })
      .addCase(deleteAllChatSessions.fulfilled, (state) => {
        state.deleteAllChatSessionsStatus = DataStatus.SUCCEEDED;
        state.chatSessions = [];
      })
      .addCase(deleteAllChatSessions.rejected, (state, action) => {
        state.deleteAllChatSessionsStatus = DataStatus.FAILED;
        state.deleteAllChatSessionsError =
          action.error?.message ?? AN_ERROR_TRY_AGAIN;
      })

      // Get openAI chat
      .addCase(getOpenAIChat.pending, (state) => {
        state.openAIChatStatus = DataStatus.LOADING;
      })
      .addCase(getOpenAIChat.fulfilled, (state, { payload }) => {
        state.openAIChatStatus = DataStatus.SUCCEEDED;

        if (
          state.openAIChat.length > 0 &&
          payload.results.length > 0 &&
          payload.results[0].chat_session !== state.openAIChat[0].chat_session
        ) {
          state.openAIChat = [];
        }

        const newChats = payload.results.filter(
          (newChat) =>
            !state.openAIChat.some((existingChat) => {
              if (!existingChat.id) {
                return true;
              }

              return existingChat.id === newChat.id;
            }),
        );

        state.openAIChat.push(...newChats);

        state.openAIChatFilters = { page: getPageNumber(payload.next) };
      })
      .addCase(getOpenAIChat.rejected, (state, action) => {
        state.openAIChatStatus = DataStatus.FAILED;
        state.openAIChatError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
      });
  },
});

export const aiChatReducer = aiChatSlice.reducer;
export default aiChatSlice.reducer;
