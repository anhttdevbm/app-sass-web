// hooks/useWebSocket.ts
import { Permission } from "constant/enums";
import { ACCESS_TOKEN_STORAGE_KEY } from "constant/index";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "store/app/selectors";
import { setListAgentOnline } from "store/ticket-agent/actions";
import { clientStorage } from "utils/storage";

interface WebSocketMessage {
  action: string;
  [key: string]: string;
}

const useWebSocket = (): WebSocket | null => {
  const { user } = useAuth();
  const isAuthorized = user?.roles?.some(
    (role) => role == Permission.SA || role == Permission.SP,
  );

  const [ws, setWs] = useState<WebSocket | null>(null);
  const dispatch = useDispatch();

  const handleMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
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
        break;
    }
  };

  useEffect(() => {
    const token = clientStorage.get(ACCESS_TOKEN_STORAGE_KEY);
    if (isAuthorized) {
      const connectSocket = () => {
        const wsClient = new WebSocket(
          `${process.env.NEXT_APP_WS_URL_TICKET!}?token=${token!}&language=vi`,
        );
  
        wsClient.onopen = () => {
          // Send authentication message with the token
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
    }


  }, []);

  return ws;
};

export default useWebSocket;
