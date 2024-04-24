import { useCallback, useEffect, useState } from "react";
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
  return members.find((memberId) => memberId === userId);
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
    roomId,
    convention,
    onSetConvention,
    onSetRoomId,
    dataTransfer,
    onSetDataTransfer,
    onSetConversationInfo,
    onSetConversationPaging,
    onSetStateSearchMessage,
    onResetSearchChatText,
    onSetStep,
    messagePagingV2,
    onSetMessagePaging,
    messages,
    onSetMessages,
    onSetChatLinks,
    onSetChatMedias,
    onSetChatFiles,
  } = useChat();
  const { items } = useEmployeesOfCompany();
  const commonT = useTranslations(NS_COMMON);
  const { onAddSnackbar } = useSnackbar();

  const [ws, setWs] = useState<WebSocket | null>(null);
  const aT = clientStorage.get(ACCESS_TOKEN_STORAGE_KEY);

  const sendMessage = (message) => {
    if (ws) {
      ws.send(JSON.stringify(message));
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
              if (isOwnerGroup(room?.creator, user?.id)) {
                onSetRoomId(room?.id);
                onSetDataTransfer(room);
                onSetConversationInfo(room);
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
              if (roomDetail?.type === CHAT_ROOM_TYPE.PERSONAL) {
                roomDetail = {
                  ...roomDetail,
                  peer_detail: roomDetail?.members?.[1],
                };
              }
              onSetRoomId(roomDetail?.id);
              onSetDataTransfer(roomDetail);
              onSetConversationInfo(roomDetail);
              onSetStateSearchMessage(null);
              onResetSearchChatText();
              onSetChatFiles([]);
              onSetChatLinks([]);
              onSetChatMedias([]);
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
              onSetDataTransfer(resp?.data);
              onSetConversationInfo(resp?.data);
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

            case CHAT_EVENT_TYPE.MESSAGE_LIST:
              onSetMessagePaging({
                current: resp?.data?.prev + 1,
                ...resp?.data,
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

  const connectSocket = () => {
    const wsClient = new WebSocket(
      `${process.env.NEXT_APP_WS_URL}/${user?.company}?token=${aT}` || "",
    );

    wsClient.onopen = () => {
      setWs(wsClient);
      wsClient.send(
        JSON.stringify({
          event: CHAT_EVENT_TYPE.ROOM_LIST,
          page: PAGE_INITIAL,
        }),
      );
    };

    wsClient.onerror = () => wsClient.close();

    wsClient.onclose = () => {
      setTimeout(() => {
        connectSocket();
      }, 3000);
    };
  };

  useEffect(() => {
    connectSocket();

    return () => {
      if (ws) ws.close();
    };
  }, []);

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

  return {
    isGroup,
    searchConversation,
    loadMoreConversation,
    loadMoreMessages,
    handleGetChatMedias,
    handleGetChatFiles,
    handleGetChatLinks,
  };
};
