import { useAuth } from "store/app/selectors";
import { ACCESS_TOKEN_STORAGE_KEY } from "constant/index";
import { useEffect } from "react";
import { clientStorage } from "utils/storage";
import { CHAT_EVENT_TYPE, CHAT_EVENT_TYPE_V2 } from "store/chat/type";
import { useChat } from "store/chat/selectors";
import { useDispatch } from "react-redux";
export const useWSChatConnect = () => {
  const { user } = useAuth();
  const { onSetWsClient } = useChat();
  const aT = clientStorage.get(ACCESS_TOKEN_STORAGE_KEY);
  const dispatch = useDispatch();
  const connectSocket = () => {
    const wsClient = new WebSocket(
      `wss://app.taskcover.com:6830/api/v2/chat/ws?language=vi&token=${aT}`
      // `${process.env.NEXT_APP_WS_URL}/${user?.company}?token=${aT}` || "",
      // `${process.env.NEXT_APP_WS_URL}/${user?.company}?token=${aT}` || "",
    );

  
    wsClient.onopen = () => {
      onSetWsClient(wsClient);
      wsClient.send(
        JSON.stringify({
          "code": "room.getList",
          "data": {
            "size": 20,
            "page": 1
          }
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
    if (user && aT) connectSocket();
  }, [user, aT]);

  return {};
};
