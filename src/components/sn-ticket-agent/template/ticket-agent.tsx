"use client";
import Wrapper from "components/Wrapper";
import Actions from "../Actions";
import { Stack } from "@mui/material";
import TicketAgentList from "../TicketAgentList";
import useWebSocket from "hooks/web-socket/useWebSocket";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setListAgentOnline } from "store/ticket-agent/actions";

const TicketAgent = () => {
  const ws = useWebSocket();
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("v", ws);
    if (!ws) return;

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
        <TicketAgentList />
      </Stack>
    </Wrapper>
  );
};

export default TicketAgent;
