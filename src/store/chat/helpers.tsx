import { useEffect, useState } from "react";
import { useAuth } from "store/app/selectors";
import { useChat } from "./selectors";
import { CHAT_EVENT_TYPE, IWsChatRespMessage } from "./type";
import { clientStorage } from "utils/storage";
import { ACCESS_TOKEN_STORAGE_KEY } from "constant/index";

const PAGE_INITIAL = 1;

export const useWSChat = () => {
  const { user } = useAuth();
  const { onSetConvention } = useChat();

  const [ws, setWs] = useState<WebSocket | null>(null);
  const aT = clientStorage.get(ACCESS_TOKEN_STORAGE_KEY);

  const sendMessage = (message) => {
    if (ws) {
      ws.send(JSON.stringify(message));
    }
  };

  // Connect message websocket
  const connectMessage = (ws: WebSocket | null) => {
    if (ws) {
      ws.onmessage = async (event) => {
        const resp: IWsChatRespMessage = JSON.parse(event.data);

        switch (resp.event) {
          case CHAT_EVENT_TYPE.ROOM_LIST:
          case CHAT_EVENT_TYPE.GROUP_SEARCH:
            return onSetConvention(resp.data?.result || []);

          case CHAT_EVENT_TYPE.GROUP_CREATE:
            console.info(resp);
            break;

          case CHAT_EVENT_TYPE.PERSONAL_ROOM:
            console.info(resp);
            break;
          default:
            return [];
        }
      };
    }
  };
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
