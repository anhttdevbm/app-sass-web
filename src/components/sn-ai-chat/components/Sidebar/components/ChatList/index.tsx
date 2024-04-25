import { Box } from "@mui/material";
import { Text } from "components/shared";
import { useEffect, useRef, useState } from "react";
import { useChatSession } from "store/aiChat/selectors";
import { ChatSession } from "store/aiChat/type";
import ItemChat from "../ItemChat";

const TODAY = "Today";
const YESTERDAY = "Yesterday";
const PREVIOUS_30_DAYS = "Previous 30 days";
const OLDER = "Older";

function groupChatSessionsByDate(chatSessions: ChatSession[]) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  return chatSessions.reduce((groups, chat) => {
    let dateGroup = "";

    if (chat.last_question_at === null) {
      dateGroup = TODAY;
    } else {
      const chatDate = new Date(chat.last_question_at);

      if (chatDate.toDateString() === today.toDateString()) {
        dateGroup = TODAY;
      } else if (chatDate.toDateString() === yesterday.toDateString()) {
        dateGroup = YESTERDAY;
      } else if (chatDate > thirtyDaysAgo) {
        dateGroup = PREVIOUS_30_DAYS;
      } else {
        dateGroup = OLDER;
      }
    }

    if (!groups[dateGroup]) {
      groups[dateGroup] = [];
    }
    groups[dateGroup].push(chat);
    return groups;
  }, {});
}

const ChatList = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(undefined);
  const [chatSessionsGroupedByDate, setChatSessionsGroupedByDate] = useState<Record<string, ChatSession[]>>({});

  const {
    chatSessions,
    onGetChatSessions: fetchChatSessions,
    isChatSessionsIdle: isIdle,
    isChatSessionsFetching: isFetching,
    chatSessionsNextPage: nextPage,
    chatSessionStatus: status,
    onSelectChatId,
    chatSession,
    newChatSessionCreated
  } = useChatSession();

  const intersectionObserverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onSelectChatId(selectedChatId);
  }, [selectedChatId]);

  useEffect(() => {
      fetchChatSessions({});
      onSelectChatId(newChatSessionCreated);
  }, [newChatSessionCreated]);

  useEffect(() => {
    if (chatSession) {
      setSelectedChatId(chatSession);
    } else {
      setSelectedChatId(undefined);
    }
  }, [chatSession]);

  useEffect(() => {
   setChatSessionsGroupedByDate(groupChatSessionsByDate(chatSessions));
  }, [chatSessions])



  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && nextPage) {
            fetchChatSessions({ pageIndex: nextPage + 1 });
          }
        }
      },
      {
        threshold: 0.5,
      },
    );
    if (intersectionObserverRef.current)
      observer.observe(intersectionObserverRef.current);
    return () => {
      if (intersectionObserverRef.current)
        observer.unobserve(intersectionObserverRef.current);
    };
  }, [intersectionObserverRef, nextPage, fetchChatSessions]);

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
          {/* <CircularProgress /> */}
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
