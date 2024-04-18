import { useCallback, useEffect, useState } from "react";
import { useAuth, useSnackbar } from "store/app/selectors";
import { useChat } from "./selectors";
import { CHAT_EVENT_TYPE, CHAT_ROOM_TYPE, IWsChatRespMessage } from "./type";
import { clientStorage } from "utils/storage";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  AN_ERROR_TRY_AGAIN,
  NS_COMMON,
} from "constant/index";
import { useEmployeesOfCompany } from "store/manager/selectors";
import { debounce } from "utils/index";
import { useTranslations } from "next-intl";
import { initPaging } from "store/chat/reducer";

const PAGE_INITIAL = 1;

const isRelatedGroup = (members: string[], userId = "") => {
  return members.find((memberId) => memberId === userId);
};

const isGroupCreator = (groupCreatorId = "", userId = "") => {
  return groupCreatorId === userId;
};

export const useWSChat = () => {
  const { user } = useAuth();
  const {
    convention,
    onSetConvention,
    onSetRoomId,
    onSetDataTransfer,
    onSetConversationInfo,
    onSetConversationPaging,
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
    (ws: WebSocket | null) => {
      if (ws) {
        ws.onmessage = async (event) => {
          const resp: IWsChatRespMessage = JSON.parse(event.data);
          console.info(resp);

          switch (resp.event) {
            case CHAT_EVENT_TYPE.ROOM_LIST:
              const { data } = resp;
              onSetConversationPaging({ current: data?.prev + 1, ...data });
              onSetConvention(data?.result || []);
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
              if (isGroupCreator(room?.creator, user?.id)) {
                onSetRoomId(room?.id);
                onSetDataTransfer(room);
                onSetConversationInfo(room);
              }
              return onSetConvention([room, ...convention]);

            case CHAT_EVENT_TYPE.PERSONAL_ROOM:
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
  const { onSetConversationPaging } = useChat();
  const { onGetEmployees } = useEmployeesOfCompany();

  const isGroup = (type: string) => type === CHAT_ROOM_TYPE.GROUP;

  const loadMoreConversation = (currentPage: number) => {
    sendMessage({
      event: CHAT_EVENT_TYPE.ROOM_LIST,
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
        onSetConversationPaging(initPaging);
        sendMessage({
          event: CHAT_EVENT_TYPE.GROUP_SEARCH,
          roomName: text,
          page: PAGE_INITIAL,
        });
      });
    } else {
      sendMessage({
        event: CHAT_EVENT_TYPE.ROOM_LIST,
        page: PAGE_INITIAL,
      });
    }
  }, TIME_DEBOUNCE_SEARCH);

  return {
    isGroup,
    searchConversation,
    loadMoreConversation,
  };
};
