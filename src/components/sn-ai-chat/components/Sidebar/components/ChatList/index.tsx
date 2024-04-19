import { Box } from "@mui/material";
import { Text } from "components/shared";
import React, { useState } from "react";
import ItemChat from "../ItemChat";

export interface Chat {
  id: string;
  chatname: string;
  last_question_at: string;
}

interface ChatListProps {
  chats: Chat[];
}

const ChatList: React.FC<ChatListProps> = ({ chats }) => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const groupedChats = chats.reduce((groups, chat) => {
    const date = new Date(chat.last_question_at).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(chat);
    return groups;
  }, {});

  return (
    <Box sx={scrollableSx}>
      {Object.entries(groupedChats).map(([date, chats], index) => {
        const typedChats = chats as Chat[];
        return (
          <Box key={index}>
            <Text sx={titleSx}>{date}</Text>
            {typedChats.map((chat, index) => (
              <Box key={index} sx={listChatSx}>
                <ItemChat  key={index} title={chat.chatname} id={chat.id} selectedChat={selectedChat} setSelectedChat={() => setSelectedChat(chat.id)} />
              </Box>
            ))}
          </Box>
        )
      })}
    </Box>
  );
};

export default ChatList;

const scrollableSx = {
  marginTop: '20px',
  overflowY: 'auto',
  padding: '0px 8px',
  width: '100%',
  height: '100vh'
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
