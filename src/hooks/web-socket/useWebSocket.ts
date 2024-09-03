// hooks/useWebSocket.ts
import { useEffect, useState } from "react";
import { ACCESS_TOKEN_STORAGE_KEY } from "constant/index";
import { clientStorage } from "utils/storage";

interface WebSocketMessage {
  action: string;
  [key: string]: string;
}

const useWebSocket = (): WebSocket | null => {
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const token = clientStorage.get(ACCESS_TOKEN_STORAGE_KEY);

    const connectSocket = () => {
      const wsClient = new WebSocket(
        `${process.env.NEXT_APP_WS_URL_TICKET!}?token=${token!}&language=vi`,
      );

      wsClient.onopen = () => {
        console.log("WebSocket connection opened");
        // Send authentication message with the token
        // Send any other initial messages if needed
        // wsClient.send(
        //   JSON.stringify({
        //     event: "ListOnline",
        //   }),
        // );
        // wsClient.send(
        //   JSON.stringify({
        //     event: "ReplyTicket",
        //   }),
        // );
      };
      wsClient.onerror = (error) => {
        console.error("WebSocket error:", error);
        wsClient.close();
      };

      wsClient.onmessage = (event) => {
        console.log("event", event);
      };
      wsClient.onclose = () => {
        console.log("WebSocket connection closed, reconnecting...");
        setTimeout(() => {
          connectSocket();
        }, 3000);
      };

      setWs(wsClient);
    };

    connectSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return ws;
};

export default useWebSocket;
