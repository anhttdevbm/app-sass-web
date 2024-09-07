import { Pending } from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";
import { Box, Button, Stack } from "@mui/material";
import Avatar from "components/Avatar";
import { Text } from "components/shared";
import { WSMessagePayload, WSMessageType } from "components/sn-meeting/type";
import useTheme from "hooks/useTheme";
import React, { useState } from "react";
import { useAuth } from "store/app/selectors";
import { store } from "store/configureStore";
import { MessageItem } from "store/meeting/types";

const Conversation = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [inputValue, setInputValue] = useState("");
  const { meetingWsClient, messages } = store.getState().meeting;

  const sendMessage = () => {
    if (inputValue === "") return;
    const payload: WSMessagePayload = {
      event: "signal",
      type: WSMessageType.NEW_MESSAGE,
      message: {
        sender: {
          id: user?.id || "",
          avatar: user?.avatar?.link || "",
          fullname: user?.fullname || "",
          position: user?.position?.name || "",
          username: user?.name || "",
        },
        content: inputValue,
        sended_at: new Date().toISOString(),
      },
    };
    meetingWsClient?.send(JSON.stringify(payload));
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
            {messages.map((message) => (
              <Box
                key={`${message.sender.id}_${message.sended_at}`}
                sx={message.sender.id === user?.id ? userStyle : guessStyle}
              >
                {message.sender.id === user?.id ? (
                  <UserMessages message={message} isDarkMode={isDarkMode} />
                ) : (
                  <GuessMessages message={message} isDarkMode={isDarkMode} />
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
              outline: "none",
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
  message,
  isDarkMode,
}: {
  message: MessageItem;
  isDarkMode: boolean;
}) => {
  return (
    <>
      {/* <Text variant={"body2"}>{content.time}</Text> */}
      <Box
        sx={{
          bgcolor: isDarkMode ? "#3a3b3c" : "#fff",
          padding: 1.5,
          borderRadius: "12px 12px 0 12px",
        }}
      >
        <Text sx={{ fontWeight: 600 }}>You</Text>
        <Text>{message.content}</Text>
      </Box>
      <Avatar
        src={message.sender.avatar}
        alt={message.sender.fullname}
        size={32}
      />
    </>
  );
};

const GuessMessages = ({
  message,
  isDarkMode,
}: {
  message: MessageItem;
  isDarkMode: boolean;
}) => {
  return (
    <>
      <Avatar
        src={message.sender.avatar}
        alt={message.sender.fullname}
        size={32}
      />
      <Box
        sx={{
          bgcolor: isDarkMode ? "#3a3b3c" : "#fff",
          padding: 1.5,
          borderRadius: "12px 12px 12px 0",
        }}
      >
        <Text sx={{ fontWeight: 600 }}>{message.sender.fullname}</Text>
        <Text>{message.content}</Text>
      </Box>
      {/* <Text variant={"body2"}>{content.time}</Text> */}
    </>
  );
};
