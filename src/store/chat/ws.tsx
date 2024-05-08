import { useAuth } from "store/app/selectors";
import { ACCESS_TOKEN_STORAGE_KEY } from "constant/index";
import { useEffect, useState } from "react";
import { clientStorage } from "utils/storage";
import { CHAT_EVENT_TYPE } from "store/chat/type";
import { useChat } from "store/chat/selectors";

export const useWSChatConnect = () => {
  const { user } = useAuth();
  const { onSetWsClient } = useChat();
  const aT = clientStorage.get(ACCESS_TOKEN_STORAGE_KEY);

  const connectSocket = () => {
    const wsClient = new WebSocket(
      `${process.env.NEXT_APP_WS_URL}/${user?.company}?token=${aT}` || "",
    );

    wsClient.onopen = () => {
      onSetWsClient(wsClient);
      wsClient.send(
        JSON.stringify({
          event: CHAT_EVENT_TYPE.ROOM_LIST,
          page: 1,
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
  }, []);

  return {};
};
