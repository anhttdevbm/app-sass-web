import { Pending } from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";
import { Avatar, Box, Button, Stack } from "@mui/material";
import { Text } from "components/shared";
import React, { useState } from "react";
import { useAuth } from "store/app/selectors";
import useTheme from "hooks/useTheme";

interface Message {
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  time: string;
  id: string;
}

interface ConversationProps {
  messages: Message[];
}

const Conversation: React.FC<ConversationProps> = ({
  messages,
}: ConversationProps) => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [inputValue, setInputValue] = useState("");

  const sendMessage = () => {
    if (inputValue === "") return;
    setInputValue("");
  };

  const handleInputText = (e: any) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleChange = (e: any) => {
    setInputValue(e.target.value);
  };

  return (
    <>
      <Box p={2} overflow={"auto"} flexGrow={1}>
        <Stack
          sx={{
            flexGrow: 1,
            height: "100%",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <div>
            {[...messages, ...messages, ...messages].map((mes: Message) => (
              <Box key={mes.id} sx={mes.id === "2" ? userStyle : guessStyle}>
                {mes.id === "2" ? (
                  <UserMessages content={mes} isDarkMode={isDarkMode} />
                ) : (
                  <GuessMessages content={mes} isDarkMode={isDarkMode} />
                )}
              </Box>
            ))}
          </div>
        </Stack>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 0.5,
          bgcolor: isDarkMode ? "var(--mui-palette-grey-50)" : "#F5F5FD",
          padding: 2,
        }}
      >
        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
          <textarea
            id="tour-chatmb-textarea"
            placeholder="Type your message"
            style={{
              background: isDarkMode ? "#3a3b3c" : "#fff",
              height: "100%",
              resize: "none",
              padding: "10px 16px",
              appearance: "none",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontFamily: "inherit",
              width: "100%",
            }}
            rows={1}
            onKeyDown={handleInputText}
            value={inputValue}
            onChange={handleChange}
            autoFocus
          />
          <SendIcon
            color="primary"
            sx={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-60%) rotate(-45deg)",
            }}
            onClick={sendMessage}
          />
        </Box>
        <Button
          sx={{
            bgcolor: "#fff",
            borderRadius: "50%",
            minWidth: "44px",
            height: "44px",
          }}
        >
          <Pending />
        </Button>
      </Box>
    </>
  );
};

export default Conversation;

const guessStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "end",
  gap: 0.75,
  marginTop: 2,
};

const userStyle = {
  ...guessStyle,
  justifyContent: "flex-end",
};

const UserMessages = ({
  content,
  isDarkMode,
}: {
  content: Message;
  isDarkMode: boolean;
}) => {
  return (
    <>
      <Text variant={"body2"}>{content.time}</Text>
      <Box
        sx={{
          bgcolor: isDarkMode ? "#3a3b3c" : "#fff",
          padding: 1.5,
          borderRadius: "12px 12px 0 12px",
        }}
      >
        <Text sx={{ fontWeight: 600 }}>You</Text>
        <Text>{content.content}</Text>
      </Box>
      <Avatar src="public/images/avatar1.png" sx={{ borderRadius: 2 }} />
    </>
  );
};

const GuessMessages = ({
  content,
  isDarkMode,
}: {
  content: Message;
  isDarkMode: boolean;
}) => {
  return (
    <>
      <Avatar src="public/images/avatar1.png" sx={{ borderRadius: 2 }} />
      <Box
        sx={{
          bgcolor: isDarkMode ? "#3a3b3c" : "#fff",
          padding: 1.5,
          borderRadius: "12px 12px 12px 0",
        }}
      >
        <Text sx={{ fontWeight: 600 }}>{content.user.name}</Text>
        <Text>{content.content}</Text>
      </Box>
      <Text variant={"body2"}>{content.time}</Text>
    </>
  );
};
