import { ChatAIAgentState, ChatResponse, GetChatPayload } from "store/chatAIAgent/types";
import { DataStatus } from "constant/enums";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { chat, getChat } from "store/chatAIAgent/actions";

const initialState: ChatAIAgentState = {
  chatData: [],
  chatAIStatus: DataStatus.IDLE,
  hasNextPage: false,
  page: 0,
};

const chatAIAgent = createSlice({
  name: "chatAIAgent",
  initialState,
  reducers: {
    addChat: (state, action: PayloadAction<ChatResponse>) => {
      state.chatData.unshift(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder

      // chat
      .addCase(chat.pending, (state) => {
        state.chatAIStatus = DataStatus.LOADING;
      })
      .addCase(chat.fulfilled, (state, action: PayloadAction<ChatResponse>) => {
        state.chatAIStatus = DataStatus.SUCCEEDED;
        if(action.payload?.assistant_content) {
          state.chatData[0].assistant_content = action.payload?.assistant_content;
        } else {
          state.chatData.shift();
        }
      })
      .addCase(chat.rejected, (state) => {
        state.chatAIStatus = DataStatus.FAILED;
      })

      // getChat
      .addCase(getChat.fulfilled, (state, action: PayloadAction<GetChatPayload>) => {
        const { messages, page, has_next_page } = action.payload;
        const shouldReplaceChatData = state.chatData.length > 0 && state.chatData[0].agentId !== messages[0]?.agentId;

        const newChatData = shouldReplaceChatData ? messages : [...state.chatData, ...messages];

        // Remove duplicate chats
        state.chatData = newChatData.filter((chat, index, self) =>
            index === self.findIndex((t) => (
              t.id === chat.id
            ))
        );
        state.page = page;
        state.hasNextPage = has_next_page;
      });
  },
});

export const chatAIAgentReducer = chatAIAgent.reducer;
export default chatAIAgent.reducer;
