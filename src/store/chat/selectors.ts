/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  addMembersToDirectMessageGroup,
  createDirectMessageGroup,
  getAllConvention,
  getLatestMessages,
  getUserInfoById,
  leftDirectMessageGroup,
  changeGroupRole,
  fetchGroupMembers,
  removeUserFromGroup,
  getChatAttachments,
  deleteConversation,
  sendMessages,
  renameGroup,
  searchChatText,
  getUnreadMessages,
  getConventionById,
  forwardMessage,
  changeGroupAvatar,
} from "./actions";
import { DataStatus, PayStatus } from "constant/enums";
import { useMemo, useCallback, useEffect } from "react";
import { shallowEqual } from "react-redux";
import {
  AddMember2GroupRequest,
  ChatConventionItemRequest,
  IChatItemInfo,
  CreateGroupRequest,
  LastMessagesRequest,
  LeftGroupRequest,
  RemoveGroupMemberRequest,
  STEP,
  TYPE_LIST,
  RemoveMemberRequest,
  FetchGroupMemberRequest,
  ChangeRoleRequest,
  ChatAttachmentsRequest,
  DeleteConversationGroup,
  MessageBodyRequest,
  RoomType,
  RenameGroupRequest,
  MessageSearchInfoRequest,
  MessageSearchInfo,
  UnReadMessageRequest,
  MessageInfo,
  ForwardMessageGroup,
  ChangeGroupAvatar,
  TypeDrawerChat,
  IChatInfo,
  IChatItemV2,
  MessageInfoV2,
} from "./type";
import { useAuth } from "store/app/selectors";
import {
  setRoomId,
  setStep,
  setMessage,
  setConversationInfo,
  setTypeList,
  setDataTransfer,
  setStateSendMessage,
  setLastMessage,
  clearConversation,
  clearMessageList,
  reset,
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
  setConversation,
  setConversationPaging,
  setIsSearchConversation,
  setMessagePaging,
  setMessages,
  setChatLinks,
  setChatMedias,
  setChatFiles,
  setListConversation,
  setMembers,
  setMessageSearch,
  setWsClient,
  setListMessage,
} from "./reducer";
import { Attachment, UrlsQuery } from "./media/typeMedia";
import { getChatUrls, uploadFile } from "./media/actionMedia";
import { FILE_ACCEPT, IMAGES_ACCEPT } from "constant/index";

export const useChat = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const {
    wsClient,
    convention,
    mediaListConversation,
    messageInfo,
    messageStatus,

    roomId,
    conversationInfo,
    conversationPaging,
    conversationPagingV2,
    isSearchConversation,
    messagePaging,
    conversationStatus,
    messages,
    messagePagingV2,
    members,
    currStep,
    prevStep,
    partnerInfo,
    partnerInfoStatus,

    chatLinks,
    chatLinksStatus,
    chatMedias,
    chatMediasStatus,
    chatFiles,
    chatFilesStatus,
    //ListSearchTextMessage
    listSearchMessage,
    statusListSearchMessage,
    //StateUnReadMessage
    unReadMessage,
    statusUnReadMessage,

    mediaList,
    mediaListStatus,

    stateSendMessage,
    stateSearchMessage,

    createGroupStatus,
    newGroupData,
    addMembers2GroupStatus,
    leftGroupStatus,
    removeMemberGroupStatus,
    typeList,
    dataTransfer,
    groupMembers,
    chatAttachments,
    typeDrawerChat,
    isOpenInfoChat,
    isChatDesktop,
    detailConversationStatus,
    selectSearchIndex,
  } = useAppSelector((state) => state.chat, shallowEqual);

  const { pageIndex, pageSize, totalItems, totalPages } = useAppSelector(
    (state) => state.chat.conversationPaging,
    shallowEqual,
  );

  const isIdle = useMemo(
    () => conversationStatus === DataStatus.IDLE,
    [conversationStatus],
  );
  const isFetching = useMemo(
    () => conversationStatus === DataStatus.LOADING,
    [conversationStatus],
  );
  const isError = useMemo(
    () => conversationStatus === DataStatus.FAILED,
    [conversationStatus],
  );

  const isFetchingDetail = useMemo(
    () => detailConversationStatus === DataStatus.LOADING,
    [detailConversationStatus],
  );

  const onGetAllConvention = useCallback(
    async ({
      count = 20,
      offset = 0,
      ...rest
    }: Omit<ChatConventionItemRequest, "authToken" | "userId">) => {
      const authToken = user?.["authToken"] ?? "";
      const userId = user?.["id_rocket"] ?? "";
      return await dispatch(
        getAllConvention({
          count,
          offset,
          authToken,
          userId,
          ...rest,
        }),
      ).unwrap();
    },
    [dispatch, user],
  );

  const onGetConventionById = useCallback(
    async ({
      count = 1,
      offset = 0,
      ...rest
    }: Omit<ChatConventionItemRequest, "authToken" | "userId">) => {
      const authToken = user?.["authToken"] ?? "";
      const userId = user?.["id_rocket"] ?? "";
      return await dispatch(
        getConventionById({
          count,
          offset,
          authToken,
          userId,
          ...rest,
        }),
      ).unwrap();
    },
    [dispatch, user],
  );

  const onGetLastMessages = useCallback(
    async ({
      count,
      offset,
      ...rest
    }: Omit<LastMessagesRequest, "authToken" | "userId">) => {
      const authToken = user?.["authToken"] ?? "";
      const userId = user?.["id_rocket"] ?? "";
      return await dispatch(
        getLatestMessages({
          count: count ?? 10,
          offset: offset ?? 0,
          authToken,
          userId,
          ...rest,
        }),
      ).unwrap();
    },
    [dispatch, user],
  );

  const onGetChatUrls = useCallback(
    async (params?: Omit<UrlsQuery, "userId" | "authToken">) => {
      const authToken = user?.["authToken"] ?? "";
      const userId = user?.["id_rocket"] ?? "";
      if (!params) return;
      if (isChatDesktop) {
        if (dataTransfer._id?.length === 0) return;
        return await dispatch(
          getChatUrls({
            roomId: dataTransfer?._id,
            type: dataTransfer?.t,
            authToken,
            userId,
          }),
        ).unwrap();
      }
      await dispatch(
        getChatUrls({
          roomId: params?.roomId ?? roomId,
          type: params?.type ?? conversationInfo?.t,
          authToken,
          userId,
        }),
      ).unwrap();
    },
    [
      conversationInfo?.t,
      dataTransfer?._id,
      dataTransfer?.t,
      dispatch,
      isChatDesktop,
      roomId,
      user,
    ],
  );

  const onSendMessage = useCallback(
    async (message: Partial<MessageBodyRequest>) => {
      await dispatch(
        sendMessages({
          sender_userId: user?.["id_rocket"] || "",
          userId: user?.["id_rocket"] || "",
          sender_authToken: user?.["authToken"] || "",
          authToken: user?.["authToken"] || "",
          receiverUsername:
            conversationInfo?.username || dataTransfer?.username,
          roomId: dataTransfer?._id || conversationInfo?._id || roomId,
          t: dataTransfer?.t || conversationInfo?.t,
          channel: dataTransfer?.name || conversationInfo?.name || "",
          ...message,
        }),
      );
    },
    [
      dispatch,
      user,
      conversationInfo?.username,
      conversationInfo?._id,
      conversationInfo?.t,
      conversationInfo?.name,
      dataTransfer?.username,
      dataTransfer?._id,
      dataTransfer?.t,
      dataTransfer?.name,
      roomId,
    ],
  );

  const onResetSearchChatText = useCallback(async () => {
    dispatch(resetSearchChatText());
    return;
  }, [dispatch]);

  const onSearchChatText = useCallback(
    async (params: Omit<MessageSearchInfoRequest, "authToken" | "userId">) => {
      const authToken = user?.["authToken"] ?? "";
      const userId = user?.["id_rocket"] ?? "";
      if (params?.text?.length === 0) {
        dispatch(resetSearchChatText());
        return;
      }
      return await dispatch(
        searchChatText({
          authToken,
          userId,
          roomId: params?.roomId ?? roomId,
          text: params?.text,
          type: params?.type,
        }),
      ).unwrap();
    },
    [dispatch, roomId, user],
  );

  const onGetUnReadMessages = useCallback(
    async (paramReq?: Partial<UnReadMessageRequest>) => {
      const { type = "d" } = paramReq || {};
      const authToken = user?.["authToken"] ?? "";
      const userId = user?.["id_rocket"] ?? "";
      await dispatch(
        getUnreadMessages({
          authToken,
          userId,
          roomId,
          type,
        }),
      );

      await dispatch(updateUnSeenMessage(roomId));
    },
    [dispatch, roomId, user],
  );

  const onGetUserInfo = useCallback(
    async (username: string) => {
      await dispatch(getUserInfoById(username)).unwrap();
    },
    [dispatch],
  );

  const onSetStep = useCallback(
    (step: STEP, dataTransfer?: any) => {
      dispatch(setStep({ step, dataTransfer }));
    },
    [dispatch],
  );

  const onSetIndexSearch = useCallback(
    (index) => {
      dispatch(setSelectSearchIndex(index));
    },
    [dispatch],
  );

  const onSetTypeList = useCallback(
    (type: TYPE_LIST) => {
      dispatch(setTypeList(type));
    },
    [dispatch],
  );

  const onSetDataTransfer = useCallback(
    (data: any) => {
      dispatch(setDataTransfer(data));
    },
    [dispatch],
  );

  const onSetRoomId = (id: string) => {
    dispatch(setRoomId(id));
  };

  const onResetDataTransfer = () => {
    dispatch(resetDataTransfer());
  };
  const onSetStateSearchMessage = useCallback(
    async (message: MessageInfoV2 | null) => {
      const messageSearch = message ? { ...message } : null;
      dispatch(setStateSearchMessage(messageSearch));
    },
    [dispatch],
  );

  const onCreateDirectMessageGroup = useCallback(
    async ({
      type = "d",
      ...rest
    }: Omit<CreateGroupRequest, "authToken" | "userId">) => {
      const authToken = user?.["authToken"] ?? "";
      const userId = user?.["id_rocket"] ?? "";
      return await dispatch(
        createDirectMessageGroup({
          type,
          authToken,
          userId,
          ...rest,
        }),
      );
    },
    [dispatch, user],
  );

  const onAddMembers2Group = useCallback(
    async (params: Omit<AddMember2GroupRequest, "authToken" | "userId">) => {
      const authToken = user?.["authToken"] ?? "";
      const userId = user?.["id_rocket"] ?? "";
      return await dispatch(
        addMembersToDirectMessageGroup({
          authToken,
          userId,
          ...params,
        }),
      );
    },
    [dispatch, user],
  );

  const onRenameGroup = useCallback(
    async (params: Omit<RenameGroupRequest, "authToken" | "userId">) => {
      const authToken = user?.["authToken"] ?? "";
      const userId = user?.["id_rocket"] ?? "";
      return await dispatch(
        renameGroup({
          authToken,
          userId,
          ...params,
        }),
      );
    },
    [dispatch, user],
  );

  const onLeftGroup = useCallback(
    async (params: Omit<LeftGroupRequest, "authToken" | "userId">) => {
      const authToken = user?.["authToken"] ?? "";
      const userId = user?.["id_rocket"] ?? "";
      return await dispatch(
        leftDirectMessageGroup({
          authToken,
          userId,
          ...params,
        }),
      );
    },
    [dispatch, user],
  );

  const onRemoveGroupMember = useCallback(
    async (params: Omit<RemoveMemberRequest, "authToken" | "userId">) => {
      const authToken = user?.["authToken"] ?? "";
      const userId = user?.["id_rocket"] ?? "";
      return await dispatch(
        removeUserFromGroup({
          authToken,
          userId,
          ...params,
        }),
      );
    },
    [dispatch, user],
  );

  const onFetchGroupMembersMember = useCallback(
    async (params: Omit<FetchGroupMemberRequest, "authToken" | "userId">) => {
      const authToken = user?.["authToken"] ?? "";
      const userId = user?.["id_rocket"] ?? "";
      console.log("params: " + params);

      return await dispatch(
        fetchGroupMembers({
          authToken,
          userId,
          ...params,
        }),
      );
    },
    [dispatch, user],
  );

  const onChangeGroupRole = useCallback(
    async (params: Omit<ChangeRoleRequest, "authToken" | "userId">) => {
      const authToken = user?.["authToken"] ?? "";
      const userId = user?.["id_rocket"] ?? "";
      return await dispatch(
        changeGroupRole({
          authToken,
          userId,
          ...params,
        }),
      );
    },
    [dispatch, user],
  );

  const onGetChatAttachments = useCallback(
    async (params: Omit<ChatAttachmentsRequest, "authToken" | "userId">) => {
      const authToken = user?.["authToken"] ?? "";
      const userId = user?.["id_rocket"] ?? "";
      if (!(params?.roomType ?? (conversationInfo?.t as RoomType))) return;
      if ((params?.roomId ?? roomId ?? dataTransfer?._id).length === 0) return;

      if (isChatDesktop) {
        return await dispatch(
          getChatAttachments({
            authToken,
            userId,
            roomId: dataTransfer?._id,
            roomType: (dataTransfer?.t ?? "d") as RoomType,
            fileType: params?.fileType ?? "media",
          }),
        ).unwrap();
      } else {
        return await dispatch(
          getChatAttachments({
            authToken,
            userId,
            roomId: params?.roomId ?? roomId,
            roomType:
              params?.roomType ?? (conversationInfo?.t as RoomType) ?? "c",
            fileType: params?.fileType ?? "media",
          }),
        ).unwrap();
      }
    },
    [
      conversationInfo?.t,
      dataTransfer?._id,
      dataTransfer?.t,
      dispatch,
      isChatDesktop,
      roomId,
      user,
    ],
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSetMessage = (message: any) => {
    dispatch(setMessage(message));
  };

  const onSetConversationInfo = (conversationInfo) => {
    dispatch(setConversationInfo(conversationInfo));
  };

  const onSetLastMessage = (newMessage: {
    roomId: string;
    lastMessage: MessageInfo;
    unreadCount: number;
    unreadsFrom: string;
  }) => {
    dispatch(setLastMessage(newMessage));
  };

  const onClearConversation = () => {
    dispatch(clearConversation());
  };

  const onClearMessageList = () => {
    dispatch(clearMessageList());
  };

  const onDeleteConversationGroup = useCallback(
    async (params: Omit<DeleteConversationGroup, "authToken" | "userId">) => {
      const authToken = user?.["authToken"] ?? "";
      const userId = user?.["id_rocket"] ?? "";
      return await dispatch(
        deleteConversation({
          authToken,
          userId,
          ...params,
        }),
      );
    },
    [dispatch, user],
  );

  const onSetStateSendMessage = useCallback(
    (state: { files: File | File[] | null; status: DataStatus }) => {
      dispatch(setStateSendMessage(state));
    },
    [dispatch],
  );

  const onReset = () => {
    dispatch(reset());
  };

  const onForwardMessage = useCallback(
    async (params: Omit<ForwardMessageGroup, "authToken" | "userId">) => {
      const authToken = user?.["authToken"] ?? "";
      const userId = user?.["id_rocket"] ?? "";
      return await dispatch(
        forwardMessage({
          authToken,
          userId,
          ...params,
        }),
      );
    },
    [dispatch, user],
  );

  const onChangeListConversations = useCallback(
    (newConversations: IChatInfo[]) => {
      dispatch(setListNewConversation(newConversations ?? []));
    },
    [dispatch],
  );

  const onChangeGroupAvatar = useCallback(
    async (file: File, roomId: string) => {
      const result = await dispatch(
        uploadFile({ endpoint: "files/upload-link", file }),
      );
      const authToken = user?.["authToken"] ?? "";
      const userId = user?.["id_rocket"] ?? "";
      await dispatch(
        changeGroupAvatar({
          authToken,
          userId,
          roomId,
          avatarUrl: result?.payload?.download ?? "",
        }),
      );
      onSetDataTransfer({ ...dataTransfer, avatar: result?.payload?.download });
      const newConversations = convention?.map((item) => {
        if (item._id === roomId) {
          return { ...item, avatar: result?.payload?.download };
        }
        return item;
      });
      dispatch(setListNewConversation(newConversations ?? []));
      return;
    },
    [convention, dataTransfer, dispatch, onSetDataTransfer, user],
  );

  const onUploadAndSendFile = useCallback(
    async ({ endpoint, files }: { endpoint: string; files: File[] }) => {
      onSetStateSendMessage({ files, status: DataStatus.LOADING });
      try {
        const promises: Promise<any>[] = [];
        for (let index = 0; index < files.length; index++) {
          promises.push(
            dispatch(
              uploadFile({
                endpoint,
                file: files[index],
              }),
            ),
          );
        }
        const urlFiles = await Promise.all(promises);
        const listFileUrl: {
          download: string;
          object: string;
          upload: string;
          type: string;
          title: string;
        }[] = urlFiles.map((item) => {
          return item.payload;
        });

        if (listFileUrl.length > 0) {
          const attachments = listFileUrl.map((item) => {
            const obj: Attachment = {};
            if (IMAGES_ACCEPT.includes(item.type)) {
              obj.image_url = item.download;
            }

            if (item.type === "video/mp4") {
              obj.video_url = item.download;
            }

            if (FILE_ACCEPT.includes(item.type)) {
              obj.title = item.title;
              obj.title_link = item.download;
              obj.title_link_download = true;
            }
            obj.name = item.title;
            return obj;
          });
          await onSendMessage({ attachments });
          onSetStateSendMessage({ files: [], status: DataStatus.SUCCEEDED });
        }
      } catch (error) {
        onSetStateSendMessage({ files: [], status: DataStatus.FAILED });
      }
    },
    [dispatch, onSendMessage, onSetStateSendMessage],
  );

  const onSetDrawerType = useCallback(
    async (type: TypeDrawerChat) => {
      return dispatch(setTypeDrawerChatDesktop(type));
    },
    [dispatch],
  );

  const onCloseDrawer = useCallback(
    async (type: TypeDrawerChat) => {
      return dispatch(setCloseDrawerChatDesktop(type));
    },
    [dispatch],
  );

  const onResetConversationInfo = useCallback(async () => {
    return dispatch(resetConversationInfo());
  }, [dispatch]);

  const onSetChatDesktop = useCallback(
    async (valid = true) => {
      return dispatch(setChatDesktop(valid));
    },
    [dispatch],
  );

  const onSetConvention = useCallback(
    async (conversations) => {
      return dispatch(setConversation(conversations));
    },
    [dispatch],
  );

  const onSetConversationPaging = useCallback(
    async (pagingInfo) => {
      return dispatch(setConversationPaging(pagingInfo));
    },
    [dispatch],
  );

  const onSetListConvention = useCallback(
    async (conversations) => {
      return dispatch(setListConversation(conversations));
    },
    [dispatch],
  );

  const onSetIsSearchConversation = useCallback(
    async (searchFlg) => {
      return dispatch(setIsSearchConversation(searchFlg));
    },
    [dispatch],
  );

  const onSetMessages = useCallback(
    async (messages) => {
      return dispatch(setMessages(messages));
    },
    [dispatch],
  );

  const onSetListMessages = useCallback(
    async (messages) => {
      return dispatch(setListMessage(messages));
    },
    [dispatch],
  );

  const onSetMessageSearch = useCallback(
    async (messages) => {
      return dispatch(setMessageSearch(messages));
    },
    [dispatch],
  );

  const onSetMessagePaging = useCallback(
    async (newPaging) => {
      return dispatch(setMessagePaging(newPaging));
    },
    [dispatch],
  );

  const onSetChatLinks = useCallback(
    async (data) => {
      return dispatch(setChatLinks(data));
    },
    [dispatch],
  );

  const onSetChatMedias = useCallback(
    async (data) => {
      return dispatch(setChatMedias(data));
    },
    [dispatch],
  );

  const onSetChatFiles = useCallback(
    async (data) => {
      return dispatch(setChatFiles(data));
    },
    [dispatch],
  );

  const onSetMembers = useCallback(
    async (data) => {
      return dispatch(setMembers(data));
    },
    [dispatch],
  );

  const onSetWsClient = useCallback(
    async (ws) => {
      return dispatch(setWsClient(ws));
    },
    [dispatch],
  );

  return {
    wsClient,
    onSetWsClient,
    convention,
    onSetConvention,
    mediaListConversation,
    conversationPaging,
    conversationPagingV2,
    onSetConversationPaging,
    onSetListConvention,
    isSearchConversation,
    onSetIsSearchConversation,
    messages,
    onSetMessages,
    onSetMessageSearch,
    onSetListMessages,
    messagePagingV2,
    onSetMessagePaging,
    onSetChatLinks,
    onSetChatMedias,
    onSetChatFiles,
    members,
    onSetMembers,
    messagePaging,
    messageInfo,
    messageStatus,
    isError,
    isIdle,
    isFetching,
    isFetchingDetail,
    pageIndex,
    pageSize,
    totalItems,
    totalPages,
    roomId,
    conversationInfo: conversationInfo as IChatInfo,
    currStep,
    prevStep,
    partnerInfo,
    partnerInfoStatus,

    chatLinks,
    chatLinksStatus,
    listSearchMessage,
    statusListSearchMessage,

    mediaList,
    mediaListStatus,
    chatMedias,
    chatMediasStatus,
    chatFiles,
    chatFilesStatus,

    stateSendMessage,
    stateSearchMessage,
    unReadMessage,

    createGroupStatus,
    newGroupData,
    addMembers2GroupStatus,
    leftGroupStatus,
    removeMemberGroupStatus,
    typeList,
    dataTransfer,
    groupMembers,
    onGetAllConvention,
    chatAttachments,
    onGetLastMessages,
    onSetStep,
    onSetRoomId,
    onCreateDirectMessageGroup,
    onAddMembers2Group,
    onLeftGroup,
    onRenameGroup,
    onRemoveGroupMember,
    onSetTypeList,
    onSetDataTransfer,
    onFetchGroupMembersMember,
    onChangeGroupRole,
    onGetChatAttachments,
    onSetConversationInfo,
    onSetMessage,
    onClearConversation,
    onClearMessageList,
    onGetUserInfo,
    onGetChatUrls,
    onDeleteConversationGroup,
    onReset,
    onUploadAndSendFile,
    onSendMessage,
    onSetStateSendMessage,
    onSetLastMessage,
    onSearchChatText,
    onSetStateSearchMessage,
    onGetUnReadMessages,
    onGetConventionById,
    onForwardMessage,
    onChangeGroupAvatar,
    onSetDrawerType,
    onCloseDrawer,
    typeDrawerChat,
    isOpenInfoChat,
    onResetConversationInfo,
    isChatDesktop,
    onSetChatDesktop,
    onChangeListConversations,
    onResetSearchChatText,
    selectSearchIndex,
    onSetIndexSearch,
    onResetDataTransfer,
  };
};
