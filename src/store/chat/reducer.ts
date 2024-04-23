/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addMembersToDirectMessageGroup,
  createDirectMessageGroup,
  getAllConvention,
  getLatestMessages,
  getUserInfoById,
  leftDirectMessageGroup,
  fetchGroupMembers,
  getChatAttachments,
  deleteConversation,
  sendMessages,
  searchChatText,
  getUnreadMessages,
} from "./actions";
import { DataStatus } from "constant/enums";
import {
  ChatGroup,
  ChatState,
  MessageInfo,
  MessageSearchInfo,
  UnReadMessageInfo,
  STEP,
  TYPE_LIST,
  UserInfo,
  MediaPreviewItem,
  IChatInfo,
  SetParamConversationProps,
} from "./type";
import { getChatRoomFile, getChatUrls } from "./media/actionMedia";
import { ChatLinkType, MediaResponse, MediaType } from "./media/typeMedia";
import dayjs from "dayjs";
const initalPage = {
  pageIndex: 0,
  pageSize: 10,
  isRefetchPage: false,
  pageSizeDefault: 10,
};

export const initPagingV2 = {
  current: 1,
  next: null,
  prev: null,
  count: 0,
};
const initialState: ChatState = {
  convention: [],
  mediaListConversation: [],
  conversationStatus: DataStatus.IDLE,
  conversationPaging: { ...initalPage, textSearch: "" },
  conversationPagingV2: { ...initPagingV2 },
  isSearchConversation: false,
  roomId: "",
  conversationInfo: null,
  currStep: STEP.CONVENTION,
  prevStep: STEP.CONVENTION,
  messageInfo: [],
  messages: [],
  messagePagingV2: { ...initPagingV2 },
  messageStatus: DataStatus.IDLE,
  messagePaging: initalPage,
  //Partner Infomation
  partnerInfo: null,
  partnerInfoStatus: DataStatus.IDLE,
  //chatLinks
  chatLinks: [],
  chatLinksStatus: DataStatus.IDLE,
  //ListSearchConversation
  listSearchMessage: [],
  statusListSearchMessage: DataStatus.IDLE,
  //media list
  mediaList: [],
  mediaListStatus: DataStatus.IDLE,
  //stateSendMessage
  stateSendMessage: {
    filePreview: null,
    status: DataStatus.IDLE,
  },
  stateSearchMessage: null,
  unReadMessage: null,
  statusUnReadMessage: DataStatus.IDLE,

  newGroupData: {},
  createGroupStatus: DataStatus.IDLE,
  addMembers2GroupStatus: DataStatus.IDLE,
  leftGroupStatus: DataStatus.IDLE,
  removeMemberGroupStatus: DataStatus.IDLE,
  typeList: TYPE_LIST.MEDIA_LIST,
  groupMembers: [],
  chatAttachments: [],
  deleteConversationStatus: DataStatus.IDLE,
  dataTransfer: {},
  // param allChat,
  paramsConversation: {},
  paramsLastMessage: {},
  paramsUnreadMessage: {},
  typeDrawerChat: "info",
  isOpenInfoChat: false,
  isChatDesktop: false,
  detailConversationStatus: DataStatus.IDLE,
  selectSearchIndex: 0,
};

const isConversation = (type: string) => {
  return type === "d" || type === "c" || type === "p";
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    reset: () => initialState,
    setChatDesktop: (state, action) => {
      state.isChatDesktop = action.payload;
    },
    setSelectSearchIndex: (state, action) => {
      state.selectSearchIndex = action.payload;
    },
    resetConversationInfo: (state) => {
      state.conversationInfo = null;
    },
    setTypeDrawerChatDesktop: (state, action) => {
      state.typeDrawerChat = action.payload;
      state.isOpenInfoChat = true;
    },
    setCloseDrawerChatDesktop: (state, action) => {
      state.typeDrawerChat = action.payload;
      state.isOpenInfoChat = false;
    },
    setStep: (state, action) => {
      const prevStep = Number(action.payload.step) - 1;
      state.prevStep = prevStep === STEP.IDLE ? STEP.CONVENTION : prevStep;
      state.currStep = action.payload.step;
      if (!action?.payload?.dataTransfer?.isDesktop) {
        state.messageInfo = [];
      }

      if (
        action.payload.dataTransfer !== undefined &&
        Object.keys(action.payload.dataTransfer).length > 0
      ) {
        state.dataTransfer = action.payload.dataTransfer;
      }
    },
    setRoomId: (state, action) => {
      state.roomId = action.payload;
    },

    //---Handle in groups ---//
    setGroupMembers: (state, action: PayloadAction<[]>) => {
      state.groupMembers = action.payload;
    },
    removeGroupMember: (state, action) => {
      state.groupMembers = state.groupMembers.filter(
        (groupMember) => groupMember.id !== action.payload,
      );
    },
    //------------------------//

    setTypeList: (state, action) => {
      state.typeList = action.payload;
    },
    setDataTransfer: (state, action) => {
      if (action?.payload && Object.keys(action.payload).length > 0) {
        state.dataTransfer = action.payload;
      }
    },
    resetDataTransfer: (state) => {
      state.dataTransfer = {};
    },
    setConversationInfo: (state, action) => {
      state.conversationInfo = action.payload;
    },
    setConversation: (state, action) => {
      if (state.conversationPagingV2.current === 1) {
        state.convention = action.payload;
      } else {
        state.convention = [...state.convention, ...action.payload];
      }
    },
    setConversationPaging: (state, action) => {
      state.conversationPagingV2 = action.payload;
    },
    setIsSearchConversation: (state, action) => {
      state.isSearchConversation = action.payload;
    },
    setMessages: (state, action) => {
      if (state.messagePagingV2.current === 1) {
        state.messages = action.payload;
      } else {
        state.messages = [...action.payload, ...state.messages];
      }
    },
    setMessagePaging: (state, action) => {
      state.messagePagingV2 = action.payload;
    },
    setMessage: (state, action: PayloadAction<MessageInfo | null>) => {
      if (action.payload) {
        if (
          state.messageInfo.findIndex(
            (message) => message._id === action.payload?._id,
          ) === -1
        ) {
          state.messageInfo.push(action.payload);
        }

        if (action.payload.attachments?.length > 0) {
          const mediaMessages: MediaPreviewItem[] = action.payload.attachments
            .filter(
              (item) =>
                item.hasOwnProperty("video_url") ||
                item.hasOwnProperty("image_url"),
            )
            .map((item) => {
              return {
                link: item.image_url ?? item.video_url ?? "",
                name: item.name || "",
                object: "",
                ts: item.ts || "",
                type: item.image_url ? "image_url" : "video_url",
              };
            });

          state.mediaListConversation = state.mediaListConversation = [
            ...state.mediaListConversation,
            ...mediaMessages,
          ];
        }
      }
    },
    setStateSendMessage: (
      state,
      action: PayloadAction<{
        files: File | File[] | null;
        status: DataStatus;
      }>,
    ) => {
      state.stateSendMessage = {
        filePreview: action.payload.files,
        status: action.payload.status,
      };
    },
    setListNewConversation: (state, action) => {
      state.convention = action.payload;
    },

    setLastMessage: (
      state,
      action: PayloadAction<{
        roomId: string;
        lastMessage: MessageInfo;
        unreadCount: number;
        unreadsFrom: string;
      }>,
    ) => {
      const newConversation = state.convention
        .map((item) => {
          if (item._id === action.payload.roomId) {
            return {
              ...item,
              lastMessage: action.payload.lastMessage,
              unreadCount: action.payload.unreadCount,
              unreadsFrom: action.payload.unreadsFrom,
            };
          }
          return item;
        })
        .sort((a, b) => {
          if (a.lastMessage && b.lastMessage) {
            const aDate = new Date(a.lastMessage.ts);
            const bDate = new Date(b.lastMessage.ts);
            const compareTime = dayjs(aDate).isBefore(dayjs(bDate));
            return compareTime ? 1 : -1;
          } else {
            return 1;
          }
        });
      state.convention = [...newConversation];
    },
    updateUnSeenMessage: (state, action) => {
      const index = state.convention.findIndex((i) => i._id === action.payload);
      if (index > -1) {
        const updateConversation = {
          ...state.convention[index],
          unreadCount: 0,
          unreadsFrom: "",
        };
        state.convention.splice(index, 1, updateConversation);
      }
    },
    setStateSearchMessage: (
      state,
      action: PayloadAction<MessageSearchInfo | null>,
    ) => {
      state.messagePaging.pageIndex = 0;
      state.messagePaging.pageSize = (action.payload?.offset || 0) + 10;
      state.stateSearchMessage = action.payload;
      state.messageInfo = [];
    },
    //     getUpdateConversation: (state, action) => {
    // log
    //     },
    clearConversation: (state) => {
      state.convention = [];
      state.conversationPaging = { ...initalPage, textSearch: "" };
    },
    clearMessageList: (state) => {
      state.messageInfo = [];
      state.messagePaging = initalPage;
    },
    setParamsState: (
      state,
      action: PayloadAction<SetParamConversationProps>,
    ) => {
      state[action.payload.type] = action.payload.value;
    },
    resetSearchChatText: (state) => {
      state.listSearchMessage = [];
    },
  },
  extraReducers: (builder) =>
    builder
      //getAllConvention
      .addCase(getAllConvention.pending, (state, action) => {
        state.conversationStatus = DataStatus.LOADING;
        state.conversationPaging = {
          ...state.conversationPaging,
          pageIndex: action.meta.arg.offset || 0,
          pageSize: action.meta.arg.count || 20,
          textSearch: action.meta.arg.text,
        };
      })
      .addCase(
        getAllConvention.fulfilled,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (state, action: PayloadAction<any[]>) => {
          const conversationNew =
            action.payload?.filter((item) =>
              isConversation(item["t"]) ? item : undefined,
            ) || [];

          if (state.conversationPaging.pageIndex === 0) {
            state.convention = conversationNew;
          } else {
            state.convention = [...state.convention, ...conversationNew];
          }
          if (action.payload?.length < state.conversationPaging.pageSize) {
            state.conversationPaging.pageIndex =
              state.conversationPaging.pageIndex -
              state.conversationPaging.pageSize +
              action.payload?.length;
          }
          state.conversationPaging.pageSize = state.conversationPaging.pageSize;
          state.conversationStatus = DataStatus.SUCCEEDED;
        },
      )
      .addCase(getAllConvention.rejected, (state, action) => {
        state.conversationStatus = DataStatus.FAILED;
        state.conversationPaging.pageIndex =
          state.conversationPaging.pageIndex -
            state.conversationPaging.pageSize ===
          0
            ? 0
            : state.conversationPaging.pageIndex -
              state.conversationPaging.pageSize;
        state.conversationPaging.pageSize = state.conversationPaging.pageSize;
      })
      // getLatestMessages
      .addCase(getLatestMessages.pending, (state, action) => {
        // state.messageInfo = []
        state.messageStatus = DataStatus.LOADING;
        state.messagePaging = {
          ...state.messagePaging,
          pageIndex: action.meta.arg.offset || 0,
          pageSize: action.meta.arg.count || 10,
        };
      })
      .addCase(
        getLatestMessages.fulfilled,
        (state, action: PayloadAction<MessageInfo[]>) => {
          // state.messageInfo = []
          if (action.payload) {
            const messageNew = action.payload?.reverse() || [];

            //Save media message
            const attachments = messageNew
              .filter((item) => item?.attachments?.length > 0)
              .map((item) => item.attachments)
              .flat();
            const mediaMessages: MediaPreviewItem[] = attachments
              .filter(
                (item) =>
                  item.hasOwnProperty("video_url") ||
                  item.hasOwnProperty("image_url"),
              )
              .map((item) => {
                return {
                  link: item.downloadlink as string,
                  name: item.name as string,
                  object: "",
                  ts: item.ts as string,
                  type: item.image_url ? "image_url" : "video_url",
                };
              });

            /* The above code is checking if the last element of the `action.payload` array has the
            same `rid` value as the last element of the `state.messageInfo` array. If they have the
            same `rid` value, it appends the `messageNew` array to the `state.messageInfo` array.
            Otherwise, it assigns the `messageNew` array to the `state.messageInfo` array. 
            
            - Fix bug duplicate messages when switch from single chat to group chat */
            if (state.messagePaging.pageIndex === 0) {
              state.messageInfo = messageNew;
              state.mediaListConversation = mediaMessages;
            } else if (
              [...action?.payload]?.pop()?.rid ==
              [...state?.messageInfo]?.pop()?.rid
            ) {
              state.messageInfo = [...messageNew, ...state.messageInfo];
              state.mediaListConversation = [
                ...mediaMessages,
                ...state.mediaListConversation,
              ];
            }
            if (action.payload?.length < state.messagePaging.pageSize) {
              state.messagePaging.pageIndex =
                state.messagePaging.pageIndex +
                action.payload?.length -
                state.messagePaging.pageSizeDefault;
            }
          } else {
            state.messagePaging.pageIndex =
              state.messagePaging.pageIndex -
              state.messagePaging.pageSizeDefault;
          }
          state.messageStatus = DataStatus.SUCCEEDED;
        },
      )
      .addCase(getLatestMessages.rejected, (state, action) => {
        state.messageStatus = DataStatus.FAILED;
        state.messagePaging.pageIndex =
          state.messagePaging.pageIndex - state.messagePaging.pageSize === 0
            ? 0
            : state.messagePaging.pageIndex - state.messagePaging.pageSize;
        state.messagePaging.pageSize = state.messagePaging.pageSize;
        state.messagePaging.isRefetchPage = false;
      })
      // sendMessages
      .addCase(sendMessages.pending, (state, action) => {
        state.stateSendMessage.status = DataStatus.LOADING;
      })
      .addCase(sendMessages.fulfilled, (state, action) => {
        state.stateSendMessage.status = DataStatus.SUCCEEDED;
      })
      .addCase(sendMessages.rejected, (state, action) => {
        state.stateSendMessage.status = DataStatus.FAILED;
      })
      // getPartnerInfoById
      .addCase(getUserInfoById.pending, (state, action) => {
        state.detailConversationStatus = DataStatus.LOADING;
        state.partnerInfoStatus = DataStatus.LOADING;
      })
      .addCase(
        getUserInfoById.fulfilled,
        (state, action: PayloadAction<UserInfo>) => {
          state.partnerInfo = action.payload || null;
          state.detailConversationStatus = DataStatus.SUCCEEDED;
          state.partnerInfoStatus = DataStatus.SUCCEEDED;
        },
      )
      .addCase(getUserInfoById.rejected, (state, action) => {
        state.partnerInfo = null;
        state.detailConversationStatus = DataStatus.FAILED;
        state.partnerInfoStatus = DataStatus.FAILED;
      })
      // getChatUrls
      .addCase(getChatUrls.pending, (state) => {
        state.chatLinksStatus = DataStatus.LOADING;
      })
      .addCase(
        getChatUrls.fulfilled,
        (state, action: PayloadAction<{ links: ChatLinkType[] }>) => {
          state.chatLinks = action.payload.links;
          state.chatLinksStatus = DataStatus.SUCCEEDED;
        },
      )
      .addCase(getChatUrls.rejected, (state, action) => {
        state.chatLinksStatus = DataStatus.FAILED;
      })
      //searchChatText
      .addCase(searchChatText.pending, (state) => {
        state.statusListSearchMessage = DataStatus.LOADING;
      })
      .addCase(
        searchChatText.fulfilled,
        (state, action: PayloadAction<{ matches: MessageSearchInfo[] }>) => {
          state.listSearchMessage = action.payload.matches;
          state.statusListSearchMessage = DataStatus.SUCCEEDED;
        },
      )
      .addCase(searchChatText.rejected, (state, action) => {
        state.statusListSearchMessage = DataStatus.FAILED;
      })
      // getUnreadMessages
      .addCase(getUnreadMessages.pending, (state) => {
        state.statusUnReadMessage = DataStatus.LOADING;
      })
      .addCase(
        getUnreadMessages.fulfilled,
        (state, action: PayloadAction<UnReadMessageInfo>) => {
          state.unReadMessage = action.payload;
          state.statusUnReadMessage = DataStatus.SUCCEEDED;
        },
      )
      .addCase(getUnreadMessages.rejected, (state, action) => {
        state.statusUnReadMessage = DataStatus.FAILED;
      })
      // createDirectMessageGroup
      .addCase(createDirectMessageGroup.pending, (state, action) => {
        state.createGroupStatus = DataStatus.LOADING;
      })
      .addCase(
        createDirectMessageGroup.fulfilled,
        (state, action: PayloadAction<ChatGroup>) => {
          state.newGroupData = action.payload;
          state.createGroupStatus = DataStatus.SUCCEEDED;
        },
      )
      .addCase(createDirectMessageGroup.rejected, (state, action) => {
        state.newGroupData = {};
        state.createGroupStatus = DataStatus.FAILED;
      })
      // addMembersToDirectMessageGroup
      .addCase(addMembersToDirectMessageGroup.pending, (state, action) => {
        state.messageInfo = [];
        state.addMembers2GroupStatus = DataStatus.LOADING;
      })
      .addCase(
        addMembersToDirectMessageGroup.fulfilled,
        (state, action: PayloadAction<ChatGroup>) => {
          state.addMembers2GroupStatus = DataStatus.SUCCEEDED;
        },
      )
      .addCase(addMembersToDirectMessageGroup.rejected, (state, action) => {
        state.addMembers2GroupStatus = DataStatus.FAILED;
      })
      // leftDirectMessageGroup
      .addCase(leftDirectMessageGroup.pending, (state, action) => {
        state.leftGroupStatus = DataStatus.LOADING;
      })
      .addCase(
        leftDirectMessageGroup.fulfilled,
        (state, action: PayloadAction<ChatGroup>) => {
          state.leftGroupStatus = DataStatus.SUCCEEDED;
        },
      )
      .addCase(leftDirectMessageGroup.rejected, (state, action) => {
        state.leftGroupStatus = DataStatus.FAILED;
      })
      // groupMembers
      .addCase(
        fetchGroupMembers.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.groupMembers = action.payload;
        },
      )
      .addCase(getChatRoomFile.pending, (state) => {
        state.mediaListStatus = DataStatus.LOADING;
      })
      // getChatAttachments
      .addCase(
        getChatAttachments.fulfilled,
        (state, action: PayloadAction<MediaResponse<MediaType>>) => {
          state.leftGroupStatus = DataStatus.SUCCEEDED;
          state.mediaList = action.payload.files;
          state.chatAttachments = action.payload.files;
          state.mediaListStatus = DataStatus.SUCCEEDED;
        },
      )
      // deleteConversation
      .addCase(deleteConversation.pending, (state, action) => {
        state.deleteConversationStatus = DataStatus.LOADING;
      })
      .addCase(
        deleteConversation.fulfilled,
        (state, action: PayloadAction<ChatGroup>) => {
          state.deleteConversationStatus = DataStatus.SUCCEEDED;
        },
      )
      .addCase(deleteConversation.rejected, (state, action) => {
        state.deleteConversationStatus = DataStatus.FAILED;
      }),
});

export const {
  reset,
  setStep,
  setRoomId,
  setMessage,
  setConversationInfo,
  setConversation,
  setConversationPaging,
  setIsSearchConversation,
  setMessages,
  setMessagePaging,
  setTypeList,
  setDataTransfer,
  setStateSendMessage,
  setLastMessage,
  clearConversation,
  clearMessageList,
  setStateSearchMessage,
  updateUnSeenMessage,
  setTypeDrawerChatDesktop,
  setCloseDrawerChatDesktop,
  resetConversationInfo,
  setChatDesktop,
  setListNewConversation,
  resetSearchChatText,
  setSelectSearchIndex,
  resetDataTransfer,
} = chatSlice.actions;

export default chatSlice.reducer;
