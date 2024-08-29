"use client";
import Wrapper from "components/Wrapper";
import Actions from "../Actions";
import TicketList from "../TicketList";
import { Stack } from "@mui/material";
import { useEffect } from "react";
import useWebSocket from "hooks/web-socket/useWebSocket";

const TicketTemplate = () => {
  const ws = useWebSocket();

  useEffect(() => {
    console.log("v", ws);
    if (!ws) return;

    const handleMessage = (event: MessageEvent) => {
      const data: Notification = JSON.parse(event.data);
      console.log("Unknown action:", data);
      console.log("event>>>>>", event);

      // switch (data.action) {
      //   case 'Online':
      //     // setOnlineUsers(data.users || []);
      //     break;
      //   // case 'Offline':
      //   //   setOnlineUsers((prev) => prev.filter(user => user.id !== data.userId));
      //   //   break;
      //   // case 'Assign':
      //   //   setNotifications((prev) => [...prev, `Ticket assigned: ${data.ticketId}`]);
      //   //   break;
      //   // case 'ReplyTicket':
      //   //   setNotifications((prev) => [...prev, `New reply on ticket: ${data.ticketId}`]);
      //   //   break;
      //   // case 'TagComment':
      //   //   setNotifications((prev) => [...prev, `Tagged in comment on ticket: ${data.ticketId}`]);
      //   //   break;
      //   // case 'ListOnline':
      //   //   setOnlineUsers(data.users || []);
      //   //   break;
      //   default:
      //     console.log('Unknown action:', data);
      // }
    };

    ws.addEventListener("message", handleMessage);

    return () => {
      ws.removeEventListener("message", handleMessage);
    };
  }, [ws]);
  return (
    <Wrapper overflow="auto" inFrame>
      <Stack
        sx={{
          overflowY: "auto",
          scrollbarWidth: "none",
          height: "calc(100vh - 100px)",
        }}
      >
        <Actions isProjectTabMode={false} />
        <TicketList />
      </Stack>
    </Wrapper>
  );
};

export default TicketTemplate;
