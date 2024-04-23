import { Box, CircularProgress } from "@mui/material";
import { Text } from "components/shared";
import { useEffect, useRef, useState } from "react";
import { useChatSession } from "store/aiChat/selectors";
import { ChatSession } from "store/aiChat/type";
import ItemChat from "../ItemChat";

const ChatList = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const {
    chatSessions,
    onGetChatSessions,
    isIdle,
    isFetching,
    nextPage,
    status,
  } = useChatSession();
  const intersectionObserverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isIdle || isFetching) {
      onGetChatSessions({});
    }
  }, []);

  function handleIntersection(entries, observer) {
    for (const entry of entries) {
      if (entry.isIntersecting && nextPage) {
        onGetChatSessions({ pageIndex: nextPage + 1 });
      }
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
    });
    if (intersectionObserverRef.current)
      observer.observe(intersectionObserverRef.current);
    return () => {
      if (intersectionObserverRef.current)
        observer.unobserve(intersectionObserverRef.current);
    };
  }, [intersectionObserverRef, nextPage, onGetChatSessions]);

  const chatSessionsGroupedByDate = groupChatSessionsByDate(chatSessions);

  function groupChatSessionsByDate(chatSessions: ChatSession[]) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    return chatSessions.reduce((groups, chat) => {
      const chatDate = new Date(chat.last_question_at);
      let dateGroup = "";

      if (chatDate.toDateString() === today.toDateString()) {
        dateGroup = "Today";
      } else if (chatDate.toDateString() === yesterday.toDateString()) {
        dateGroup = "Yesterday";
      } else if (chatDate > thirtyDaysAgo) {
        dateGroup = "Previous 30 days";
      } else {
        dateGroup = "Older";
      }

      if (!groups[dateGroup]) {
        groups[dateGroup] = [];
      }
      groups[dateGroup].push(chat);
      return groups;
    }, {});
  }

  return (
    <Box sx={scrollableSx}>
      {Object.entries(chatSessionsGroupedByDate).map(([date, chats], index) => {
        const chatsByDate = chats as ChatSession[];
        return (
          <Box key={index}>
            <Text sx={titleSx}>{date}</Text>
            {chatsByDate.map((chat, index) => (
              <Box key={index} sx={listChatSx}>
                <ItemChat
                  key={index}
                  title={chat.chatname}
                  id={chat.id}
                  selectedChat={selectedChatId}
                  setSelectedChat={() => setSelectedChatId(chat.id)}
                />
              </Box>
            ))}
            <div ref={intersectionObserverRef} style={{ opacity: 0 }}>
              .
            </div>
          </Box>
        );
      })}
      {isFetching && (
        <Box
          sx={{ display: "flex", justifyContent: "center", padding: "10px" }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default ChatList;

const scrollableSx = {
  marginTop: "20px",
  overflowY: "auto",
  padding: "0px 8px",
  width: "100%",
  height: "100vh",
};

const listChatSx = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
};

const titleSx = {
  fontSize: "12px",
  fontWeight: "400",
  color: "grey.400",
  marginBottom: "8px",
};
