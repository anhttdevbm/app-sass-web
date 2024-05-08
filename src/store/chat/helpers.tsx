import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth, useSnackbar } from "store/app/selectors";
import { useChat } from "./selectors";
import {
  CHAT_EVENT_TYPE,
  CHAT_ROOM_TYPE,
  IWsChatRespMessage,
  STEP,
} from "./type";
import { clientStorage } from "utils/storage";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  AN_ERROR_TRY_AGAIN,
  NS_COMMON,
} from "constant/index";
import { useEmployeesOfCompany } from "store/manager/selectors";
import { debounce } from "utils/index";
import { useTranslations } from "next-intl";
import { initPagingV2 } from "store/chat/reducer";

const PAGE_INITIAL = 1;

const isRelatedGroup = (members: string[], userId = "") => {
  return members?.find((memberId) => memberId === userId);
};

export const isOwnerGroup = (groupCreatorId = "", userId = "") => {
  return groupCreatorId === userId;
};

const sortASCArray = (list: any[], sortBy: string) => {
  if (list && list.length) {
    if (sortBy === "created_at") {
      return [...list]?.sort((a, b) => {
        return (
          new Date(a?.[sortBy])?.valueOf() - new Date(b?.[sortBy])?.valueOf()
        );
      });
    }
    return list;
  }
  return [];
};

export const useWSChat = () => {
  const { user } = useAuth();
  const {
    wsClient: ws,
    roomId,
    convention,
    onSetConvention,
    onSetRoomId,
    dataTransfer,
    conversationInfo,
    onSetDataTransfer,
    onSetConversationInfo,
    onSetConversationPaging,
    onSetStateSearchMessage,
    onResetSearchChatText,
    onResetDataTransfer,
    onResetConversationInfo,
    onSetStep,
    messagePagingV2,
    onSetMessagePaging,
    messages,
    onSetMessages,
    onSetChatLinks,
    onSetChatMedias,
    onSetChatFiles,
    onSetListConvention,
    members,
    onSetMembers,
    onSetMessageSearch,
  } = useChat();
  const { items } = useEmployeesOfCompany();
  const commonT = useTranslations(NS_COMMON);
  const { onAddSnackbar } = useSnackbar();

  const resetData = () => {
    onSetStateSearchMessage(null);
    onResetSearchChatText();
    onSetChatFiles([]);
    onSetChatLinks([]);
    onSetChatMedias([]);
  };

  const resetDataRoom = () => {
    onSetRoomId("");
    onResetDataTransfer();
    onResetConversationInfo();
    onSetMessagePaging(initPagingV2);
    onSetMessages([]);
  };

  const sendMessage = (message) => {
    if (ws) {
      ws.send(JSON.stringify(message));
    }
  };

  const handleMessageSystem = (resp) => {
    const senderId =
      resp?.data?.detailMember?.id || resp?.data?.detailAdmin?.id;
    if (!members?.find((mem) => mem?.id === senderId)) {
      sendMessage({
        event: CHAT_EVENT_TYPE.DETAIL_MEMBER,
        memberId: senderId,
      });
    }
    if (!messages?.find((msg) => msg?.id === resp?.data?.systemMessage?.id)) {
      const newMessage = {
        id: resp?.data?.systemMessage?.id,
        content: resp?.data?.systemMessage?.type,
        sender: senderId,
        files: [],
        links: [],
        type: "system",
        created_at: new Date().getTime(),
      };
      onSetMessages([...messages, newMessage]);
    }
  };

  // Connect message websocket
  const connectMessage = useCallback(
    async (ws: WebSocket | null) => {
      if (ws) {
        ws.onmessage = async (event) => {
          const resp: IWsChatRespMessage = JSON.parse(event.data);
          console.info(resp);

          switch (resp.event) {
            case CHAT_EVENT_TYPE.ROOM_LIST:
              onSetConversationPaging({
                current: resp?.data?.prev + 1,
                ...resp?.data,
              });
              onSetConvention(resp?.data?.result || []);
              break;

            case CHAT_EVENT_TYPE.GROUP_SEARCH:
              const groups = resp.data?.result;
              const users = items.map((item) => ({
                type: CHAT_ROOM_TYPE.PERSONAL,
                avatar: item?.avatar?.link,
                peer_detail: {
                  fullname: item?.fullname,
                  avatar: item?.avatar?.link,
                },
                ...item,
              }));
              return onSetConvention([...groups, ...users] || []);

            case CHAT_EVENT_TYPE.GROUP_CREATE:
              const { room } = resp.data;
              if (!isRelatedGroup(room?.members, user?.id)) {
                return;
              }
              if (isOwnerGroup(room?.owner, user?.id)) {
                onSetMessagePaging(initPagingV2);
                onSetMessages([]);
                onSetRoomId(room?.id);
                sendMessage({
                  event: CHAT_EVENT_TYPE.DETAIL_ROOM,
                  roomId: room?.id,
                });
              }
              if (convention.find((item) => item?.id === room?.id)) return;
              return onSetConvention([room, ...convention]);

            case CHAT_EVENT_TYPE.PERSONAL_ROOM:
              const roomIdPersonal = resp?.data?.room?.id;
              sendMessage({
                event: CHAT_EVENT_TYPE.DETAIL_ROOM,
                roomId: roomIdPersonal,
              });
              return;

            case CHAT_EVENT_TYPE.DETAIL_ROOM:
              let roomDetail = resp?.data;
              // if (roomId === roomDetail?.id) return;
              if (roomDetail?.type === CHAT_ROOM_TYPE.PERSONAL) {
                roomDetail = {
                  ...roomDetail,
                  peer_detail: roomDetail?.members?.find(
                    (item) => item?.id != user?.id,
                  ),
                };
              }
              onSetRoomId(roomDetail?.id);
              onSetDataTransfer(roomDetail);
              onSetConversationInfo(roomDetail);
              resetData();
              if (roomDetail?.type === CHAT_ROOM_TYPE.GROUP) {
                onSetStep(STEP.CHAT_GROUP, roomDetail);
              } else {
                onSetStep(STEP.CHAT_ONE, roomDetail);
              }
              sendMessage({
                event: CHAT_EVENT_TYPE.MESSAGE_LIST,
                roomId: roomDetail?.id,
                page: PAGE_INITIAL,
              });
              return;

            case CHAT_EVENT_TYPE.GROUP_UPDATE_NAME:
              if (roomId === resp?.data?.id) {
                const newInfoRoomName = {
                  ...conversationInfo,
                  name: resp?.data?.name,
                };

                onSetDataTransfer(newInfoRoomName);
                onSetConversationInfo(newInfoRoomName);
              }
              if (isRelatedGroup(resp?.data?.members, user?.id)) {
                convention?.map((item) => {
                  if (item.id === resp?.data?.id) {
                    return {
                      ...item,
                      name: resp?.data?.name,
                    };
                  }
                });
              }
              return;

            case CHAT_EVENT_TYPE.GROUP_UPDATE_AVATAR:
              const newRoom = {
                ...resp?.data,
                avatar: resp?.data?.avatar,
                members: dataTransfer?.members,
              };
              onSetDataTransfer({ ...dataTransfer, ...newRoom });
              const newConversations = convention?.map((item) => {
                if (item.id === newRoom?.id) {
                  return { ...item, ...newRoom };
                }
                return item;
              });
              onSetConvention(newConversations);
              return;

            case CHAT_EVENT_TYPE.GROUP_ADD_MEMBER:
              if (!isRelatedGroup(resp?.data?.room?.members, user?.id)) {
                return;
              }
              const isAlreadyInRoom = dataTransfer?.members?.find(
                (mem) => mem?.id === resp?.data?.detailMember?.id,
              );
              if (resp?.data?.room?.id === roomId && !isAlreadyInRoom) {
                const newRoomInfo = {
                  ...dataTransfer,
                  members: [
                    ...(dataTransfer?.members || []),
                    resp?.data?.detailMember,
                  ],
                };
                onSetDataTransfer(newRoomInfo);
                onSetConversationInfo(newRoomInfo);
              }
              handleMessageSystem(resp);
              if (convention.find((item) => item?.id === resp?.data?.room?.id))
                return;
              onSetListConvention([resp?.data?.room, ...convention]);
              return;

            case CHAT_EVENT_TYPE.GROUP_REMOVE_MEMBER:
            case CHAT_EVENT_TYPE.GROUP_REMOVE_ADMIN:
              if (resp?.data?.detailMember?.id === user?.id) {
                const roomIdOut = resp?.data?.room?.id;
                const newConversation = convention.filter(
                  (item) => item.id != roomIdOut,
                );
                onSetListConvention(newConversation);
                resetData();
                resetDataRoom();
                onSetStep(STEP.CONVENTION);
              }
              if (
                !isRelatedGroup(resp?.data?.room?.members, user?.id) ||
                resp?.data?.room?.id !== roomId
              ) {
                return;
              }
              handleMessageSystem(resp);
              const newInfoRoom = {
                ...dataTransfer,
                members: dataTransfer?.members?.filter(
                  (mem) => mem?.id != resp?.data?.detailMember?.id,
                ),
              };
              onSetDataTransfer(newInfoRoom);
              onSetConversationInfo(newInfoRoom);
              return;

            case CHAT_EVENT_TYPE.GROUP_ADD_ADMIN:
              if (
                !isRelatedGroup(resp?.data?.room?.members, user?.id) ||
                resp?.data?.room?.id !== roomId
              ) {
                return;
              }
              if (
                dataTransfer?.admins?.find(
                  (item) => item === resp?.data?.detailAdmin?.id,
                )
              )
                return;
              handleMessageSystem(resp);
              const newRoomAdmin = {
                ...dataTransfer,
                admins: [
                  ...(dataTransfer?.admins || []),
                  resp?.data?.detailAdmin?.id,
                ],
              };
              onSetDataTransfer(newRoomAdmin);
              onSetConversationInfo(newRoomAdmin);
              return;

            case CHAT_EVENT_TYPE.GROUP_REMOVE:
              if (!isRelatedGroup(resp?.data?.members, user?.id)) {
                return;
              }

              const roomIdRemove = resp?.data?.id;
              const conversationFilter = convention.filter(
                (item) => item.id != roomIdRemove,
              );
              onSetListConvention(conversationFilter);
              resetData();
              resetDataRoom();
              onSetStep(STEP.CONVENTION);
              return;

            case CHAT_EVENT_TYPE.MESSAGE_LIST:
              onSetMessagePaging({
                current: resp?.data?.prev + 1,
                ...resp?.data,
              });
              resp?.data?.result?.forEach((item) => {
                if (
                  item?.type === "system" &&
                  !members?.find((mem) => mem?.id === item?.sender)
                ) {
                  sendMessage({
                    event: CHAT_EVENT_TYPE.DETAIL_MEMBER,
                    memberId: item?.sender,
                  });
                }
              });
              onSetMessages(
                sortASCArray(resp?.data?.result, "created_at") || [],
              );
              return;

            case CHAT_EVENT_TYPE.MESSAGE_LIST_LINK:
              onSetChatLinks(resp?.data?.result || []);
              return;

            case CHAT_EVENT_TYPE.MESSAGE_LIST_FILE:
              onSetChatFiles(resp?.data?.result || []);
              return;

            case CHAT_EVENT_TYPE.MESSAGE_LIST_MEDIA:
              onSetChatMedias(resp?.data?.result || []);
              return;

            case CHAT_EVENT_TYPE.MESSAGE_SEND_TEXT:
              const newMsg = resp?.data?.message;
              if (newMsg?.room !== roomId) return;
              if (messages.find((item) => item?.id === newMsg?.id)) return;
              onSetMessages([...messages, newMsg]);
              return;

            case CHAT_EVENT_TYPE.MESSAGE_SEND_FILE:
              const newMsgFile = resp?.data?.message;
              if (newMsgFile?.room !== roomId) return;
              if (messages.find((item) => item?.id === newMsgFile?.id)) return;
              onSetMessages([...messages, newMsgFile]);
              return;

            case CHAT_EVENT_TYPE.MESSAGE_SEND_MEDIA:
              const newMsgMedia = resp?.data?.message;
              if (newMsgMedia?.room !== roomId) return;
              if (messages.find((item) => item?.id === newMsgMedia?.id)) return;
              onSetMessages([...messages, newMsgMedia]);
              return;

            case CHAT_EVENT_TYPE.MESSAGE_FORWARD:
              if (
                !isRelatedGroup(resp?.data?.room?.members, user?.id) ||
                resp?.data?.room?.id !== roomId
              ) {
                return;
              }
              if (messages.find((item) => item?.id === resp?.data?.message?.id))
                return;
              onSetMessages([...messages, resp?.data?.message]);
              return;

            case CHAT_EVENT_TYPE.MESSAGE_SEARCH:
              onSetMessageSearch(resp.data?.result || []);
              return;

            case CHAT_EVENT_TYPE.DETAIL_MEMBER:
              onSetMembers(resp?.data);
              return;

            case "error":
              return onAddSnackbar(
                resp?.message || commonT(AN_ERROR_TRY_AGAIN),
                "error",
              );
            default:
              return [];
          }
        };
      }
    },
    [sendMessage],
  );

  useEffect(() => {
    if (ws) {
      connectMessage(ws);
    }
  }, [connectMessage, ws]);

  const forceCloseSocket = (reason?: string) => {
    if (ws) {
      ws.close(undefined, reason);
    }
  };

  return {
    connectMessage,
    sendMessage,
    forceCloseSocket,
  };
};

const TIME_DEBOUNCE_SEARCH = 1000; //ms

export const useChatHelpers = () => {
  const { user } = useAuth();
  const { sendMessage } = useWSChat();
  const { roomId, onSetConversationPaging, onSetIsSearchConversation } =
    useChat();
  const { onGetEmployees } = useEmployeesOfCompany();

  const isGroup = (type: string) => type === CHAT_ROOM_TYPE.GROUP;

  const handleCreateGroupWS = (members: string[]) => {
    sendMessage({
      event: CHAT_EVENT_TYPE.GROUP_CREATE,
      members: members,
    });
  };

  const handleAddMemberToGroup = (users: string[]) => {
    users.map((user) => {
      sendMessage({
        event: CHAT_EVENT_TYPE.GROUP_ADD_MEMBER,
        roomId: roomId,
        userId: user,
      });
    });
  };

  const handleGetChatMedias = (currentPage: number) => {
    sendMessage({
      event: CHAT_EVENT_TYPE.MESSAGE_LIST_MEDIA,
      roomId: roomId,
      page: currentPage,
    });
  };

  const handleGetChatLinks = (currentPage: number) => {
    sendMessage({
      event: CHAT_EVENT_TYPE.MESSAGE_LIST_LINK,
      roomId: roomId,
      page: currentPage,
    });
  };

  const handleGetChatFiles = (currentPage: number) => {
    sendMessage({
      event: CHAT_EVENT_TYPE.MESSAGE_LIST_FILE,
      roomId: roomId,
      page: currentPage,
    });
  };

  const loadMoreConversation = (currentPage: number) => {
    sendMessage({
      event: CHAT_EVENT_TYPE.ROOM_LIST,
      page: currentPage + 1,
    });
  };

  const loadMoreMessages = (currentPage: number) => {
    sendMessage({
      event: CHAT_EVENT_TYPE.MESSAGE_LIST,
      roomId: roomId,
      page: currentPage + 1,
    });
  };

  const searchConversation = debounce((text: string) => {
    if (text) {
      const newQueries = {
        pageIndex: 1,
        pageSize: 50,
        fullname: text,
        email: text,
        username: text,
      };
      onGetEmployees(user?.company || "", newQueries).then(() => {
        onSetConversationPaging(initPagingV2);
        sendMessage({
          event: CHAT_EVENT_TYPE.GROUP_SEARCH,
          roomName: text,
          page: PAGE_INITIAL,
        });
      });
      onSetIsSearchConversation(true);
    } else {
      sendMessage({
        event: CHAT_EVENT_TYPE.ROOM_LIST,
        page: PAGE_INITIAL,
      });
      onSetIsSearchConversation(false);
    }
  }, TIME_DEBOUNCE_SEARCH);

  const groupUpdateName = (renameGroup = "") => {
    sendMessage({
      event: CHAT_EVENT_TYPE.GROUP_UPDATE_NAME,
      roomId: roomId,
      roomName: renameGroup,
    });
  };

  const groupUpdateAvatar = (avatarId = "") => {
    sendMessage({
      event: CHAT_EVENT_TYPE.GROUP_UPDATE_AVATAR,
      roomId: roomId,
      avatar: avatarId,
    });
  };

  const addNewAdmin = (id = "") => {
    sendMessage({
      event: CHAT_EVENT_TYPE.GROUP_ADD_ADMIN,
      roomId: roomId,
      userId: id,
    });
  };

  const memberLeftGroup = (userIdLeft = "") => {
    sendMessage({
      event: CHAT_EVENT_TYPE.GROUP_REMOVE_MEMBER,
      roomId: roomId,
      userId: userIdLeft,
    });
  };

  const adminLeftGroup = (adminIdLeft = "") => {
    sendMessage({
      event: CHAT_EVENT_TYPE.GROUP_REMOVE_ADMIN,
      roomId: roomId,
      userId: adminIdLeft,
    });
  };

  const deleteGroup = () => {
    sendMessage({
      event: CHAT_EVENT_TYPE.GROUP_REMOVE,
      roomId: roomId,
    });
  };

  return {
    isGroup,
    searchConversation,
    loadMoreConversation,
    loadMoreMessages,
    handleGetChatMedias,
    handleGetChatFiles,
    handleGetChatLinks,
    handleCreateGroupWS,
    handleAddMemberToGroup,
    groupUpdateName,
    groupUpdateAvatar,
    addNewAdmin,
    memberLeftGroup,
    adminLeftGroup,
    deleteGroup,
  };
};
