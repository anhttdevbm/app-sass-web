import { useCallback, useEffect } from "react";
import { useAuth, useSnackbar } from "store/app/selectors";
import { useChat } from "./selectors";
import {
  CHAT_EVENT_TYPE,
  CHAT_ROOM_TYPE,
  IWsChatRespMessage,
  MESSAGE_TYPE,
  STEP,
} from "./type";
import { AN_ERROR_TRY_AGAIN, NS_COMMON } from "constant/index";
import { useEmployeesOfCompany } from "store/manager/selectors";
import { debounce } from "utils/index";
import { useTranslations } from "next-intl";
import { initPagingV2 } from "store/chat/reducer";

const PAGE_INITIAL = 1;

const isRelatedGroup = (members: string[], userId = "") => {
  return members?.find((memberId) => memberId === userId);
};

export const isExitsInList = (list, item) => {
  return list?.find((elm) => elm?.id === item?.id);
};

export const isOwnerGroup = (groupCreatorId = "", userId = "") => {
  return groupCreatorId === userId;
};

export const isAdminGroup = (admins, userId) => {
  return admins?.find((item) => item === userId);
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
    onSetListMessages,
    onCalling,
    onEndMeeting,
  } = useChat();
  const { items } = useEmployeesOfCompany();
  const commonT = useTranslations(NS_COMMON);
  const { onAddSnackbar, onAddNotification } = useSnackbar();

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
    onSetListMessages([]);
  };

  const sendMessage = (message) => {
    if (ws) {
      ws.send(JSON.stringify(message));
    }
  };

  const handleMessageSystem = (resp) => {
    const senderId =
      resp?.data?.detailMember?.id || resp?.data?.detailAdmin?.id;
    if (senderId && !members?.find((mem) => mem?.id === senderId)) {
      sendMessage({
        event: CHAT_EVENT_TYPE.DETAIL_MEMBER,
        memberId: senderId,
      });
    }
    if (!isExitsInList(messages, resp?.data?.systemMessage)) {
      const newMessage = {
        id: resp?.data?.systemMessage?.id,
        content: resp?.data?.systemMessage?.type,
        sender: senderId,
        files: [],
        links: [],
        type: "system",
        created_at: new Date().getTime(),
      };
      onSetListMessages([...messages, newMessage]);
    }
  };

  const isCurrentUserInRoom = (roomSelect, userId) => {
    return roomId === roomSelect && userId !== user?.id;
  };

  const handleReceiveMsg = async (resp) => {
    const msg = resp?.data?.message;
    const newMsg = {
      ...msg,
      seen_by: isCurrentUserInRoom(resp?.data?.room?.id, msg?.sender)
        ? [user?.id]
        : [],
    };
    await handleDisplayNewMessage(resp);
    if (newMsg?.room !== roomId) return;
    if (!isExitsInList(messages, newMsg)) {
      await onSetListMessages([...messages, newMsg]);
    }
  };

  const handleDisplayNewMessage = async (resp) => {
    const newMsg = resp?.data?.message;
    const sysMsg = resp?.data?.systemMessage;
    const newRoomMsg = resp?.data?.room;
    if (isExitsInList(convention, newRoomMsg)) {
      const conversationUpdate = convention.map((item) => {
        if (item?.id === newRoomMsg?.id) {
          return {
            ...item,
            files: newMsg?.files,
            unseen_message_count:
              user?.id === newMsg?.sender ? 0 : item?.unseen_message_count + 1,
            lastmsg: {
              id: newRoomMsg?.lastmsg,
              type: sysMsg ? MESSAGE_TYPE.SYSTEM : newMsg?.type,
              content: sysMsg ? sysMsg?.type : newMsg?.content,
              seen_user_count: 0,
              sender: sysMsg
                ? resp?.data?.detailMember
                : resp?.data?.detailSenderMember,
            },
          };
        }
        return item;
      });

      if (isCurrentUserInRoom(newRoomMsg?.id, newMsg?.sender)) {
        sendMessage({
          event: CHAT_EVENT_TYPE.MESSAGE_SEEN,
          messageId: newRoomMsg?.lastmsg,
        });
      }

      await onSetListConvention(conversationUpdate);
    }
  };

  const handleNotiMsg = (resp) => {
    const msg = resp?.data?.message;
    if (resp?.data?.systemMessage) return;

    if (!isRelatedGroup(resp?.data?.room?.members, user?.id)) return;

    if (resp?.data?.detailSenderMember?.id !== user?.id) {
      onAddNotification({
        id: msg?.id,
        msg,
        sender: resp?.data?.detailSenderMember,
        room: resp?.data?.room,
      });
    }
  };

  const handleNotiMeeting = (data) => {
    if (!isRelatedGroup(data.room.members, user?.id)) return;
    if (data.host.id !== user?.id) {
      onCalling(true);
    }
  };

  // Connect message websocket
  const connectMessage = useCallback(
    async (ws: WebSocket | null) => {
      if (ws) {
        ws.onmessage = async (event) => {
          const resp: IWsChatRespMessage = JSON.parse(event.data);
          console.info("resp", resp);

          if (resp.data.event === "start_meet") {
            //incoming call noti
            handleNotiMeeting(resp.data);
            onSetDataTransfer(resp.data);
          } else if (resp.data.event === "cancel_meet") {
            onCalling(false);
          } else {
            // onEndMeeting(true);
            onCalling(false);
          }

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
                onSetListMessages([]);
                onSetRoomId(room?.id);
                sendMessage({
                  event: CHAT_EVENT_TYPE.DETAIL_ROOM,
                  roomId: room?.id,
                });
              }
              if (!isExitsInList(convention, room)) {
                onSetConvention([room, ...convention]);
              }
              return;

            case CHAT_EVENT_TYPE.PERSONAL_ROOM:
              const roomIdPersonal = resp?.data?.room?.id;
              sendMessage({
                event: CHAT_EVENT_TYPE.DETAIL_ROOM,
                roomId: roomIdPersonal,
              });
              return;

            case CHAT_EVENT_TYPE.DETAIL_ROOM:
              let roomDetail = resp?.data;
              await onSetMessagePaging(initPagingV2);
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
              const newRoomAvatar = {
                avatar: resp?.data?.avatar,
              };

              if (roomId === resp?.data?.id) {
                onSetDataTransfer({ ...dataTransfer, ...newRoomAvatar });
                onSetConversationInfo({
                  ...conversationInfo,
                  ...newRoomAvatar,
                });
              }
              if (
                isRelatedGroup(resp?.data?.members, user?.id) &&
                isExitsInList(convention, resp?.data)
              ) {
                const newConversations = convention?.map((item) => {
                  if (item?.id === resp?.data?.id) {
                    return { ...item, ...newRoomAvatar };
                  }
                  return item;
                });
                onSetConvention(newConversations);
              }
              return;

            case CHAT_EVENT_TYPE.GROUP_ADD_MEMBER:
              handleDisplayNewMessage(resp);
              if (resp?.data?.detailMember?.id === user?.id) {
                onSetListConvention([resp?.data?.room, ...convention]);
              }
              if (resp?.data?.room?.id === roomId) {
                if (
                  !isExitsInList(
                    dataTransfer?.members,
                    resp?.data?.detailMember,
                  )
                ) {
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
              }
              return;

            case CHAT_EVENT_TYPE.GROUP_REMOVE_MEMBER:
            case CHAT_EVENT_TYPE.GROUP_REMOVE_ADMIN:
              handleDisplayNewMessage(resp);
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
              handleDisplayNewMessage(resp);
              if (resp?.data?.room?.id !== roomId) {
                return;
              }
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
              if (roomId === resp?.data?.id) {
                resetData();
                resetDataRoom();
                onSetStep(STEP.CONVENTION);
              }
              return;

            case CHAT_EVENT_TYPE.MESSAGE_LIST:
              await onSetMessagePaging({
                current: resp?.data?.prev + 1,
                ...resp?.data,
              });
              resp?.data?.result?.forEach((item) => {
                if (
                  item?.type === "system" &&
                  item?.sender &&
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
            case CHAT_EVENT_TYPE.MESSAGE_SEND_FILE:
            case CHAT_EVENT_TYPE.MESSAGE_SEND_MEDIA:
              handleReceiveMsg(resp);
              handleNotiMsg(resp);
              return;

            case CHAT_EVENT_TYPE.MESSAGE_FORWARD:
              handleDisplayNewMessage(resp);
              if (
                resp?.data?.room?.id === roomId &&
                !isExitsInList(messages, resp?.data?.message)
              ) {
                onSetListMessages([...messages, resp?.data?.message]);
              }
              return;

            case CHAT_EVENT_TYPE.MESSAGE_SEARCH:
              onSetMessageSearch(resp.data?.result || []);
              return;

            case CHAT_EVENT_TYPE.MESSAGE_SEEN:
              if (isExitsInList(convention, { id: resp?.data?.roomId })) {
                if (roomId === resp?.data?.roomId) {
                  const newMsg = messages?.map((msg) => {
                    if (
                      resp?.data?.listMessageId?.length &&
                      resp?.data?.listMessageId?.includes(msg?.id)
                    ) {
                      return {
                        ...msg,
                        seen_by: [...msg?.seen_by, resp?.data?.userId],
                      };
                    }
                    return msg;
                  });
                  await onSetListMessages(newMsg);
                }
                const newConversation = convention.map((item) => {
                  if (item?.id === resp?.data?.roomId) {
                    return {
                      ...item,
                      unseen_message_count:
                        user?.id === resp?.data?.userId
                          ? 0
                          : item?.unseen_message_count,
                      lastmsg: {
                        ...item.lastmsg,
                        seen_user_count: 1,
                      },
                    };
                  }
                  return item;
                });

                await onSetListConvention(newConversation);
              }
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
