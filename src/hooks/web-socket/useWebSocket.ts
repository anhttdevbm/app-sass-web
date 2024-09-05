// hooks/useWebSocket.ts
import { useEffect, useState } from "react";
import { ACCESS_TOKEN_STORAGE_KEY } from "constant/index";
import { clientStorage } from "utils/storage";
import { useDispatch } from "react-redux";
import { setListAgentOnline } from "store/ticket-agent/actions";

interface WebSocketMessage {
  action: string;
  [key: string]: string;
}

const useWebSocket = (): WebSocket | null => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const dispatch = useDispatch();

  const handleMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    console.log("Unknown action:", data);
    switch (data?.code) {
      case "ListOnline":
        dispatch(setListAgentOnline(data?.data));
        break;
      // case 'Offline':
      //   setOnlineUsers((prev) => prev.filter(user => user.id !== data.userId));
      //   break;
      // case 'Assign':
      //   setNotifications((prev) => [...prev, `Ticket assigned: ${data.ticketId}`]);
      //   break;
      // case 'ReplyTicket':
      //   setNotifications((prev) => [...prev, `New reply on ticket: ${data.ticketId}`]);
      //   break;
      // case 'TagComment':
      //   setNotifications((prev) => [...prev, `Tagged in comment on ticket: ${data.ticketId}`]);
      //   break;
      // case 'ListOnline':
      //   setOnlineUsers(data.users || []);
      //   break;
      default:
        console.log("Unknown action:", data);
    }
  };

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

      wsClient.addEventListener("message", handleMessage);

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
        ws.removeEventListener("message", handleMessage);
      }
    };
  }, []);

  return ws;
};

export default useWebSocket;
