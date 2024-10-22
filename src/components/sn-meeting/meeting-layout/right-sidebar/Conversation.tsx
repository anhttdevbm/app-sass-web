/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, IconButton, Stack } from "@mui/material";
import Avatar from "components/Avatar";
import { Text } from "components/shared";
import {
  WSParticipantActionPayload,
  WSParticipantActionType,
} from "components/sn-meeting/type";
import useTheme from "hooks/useTheme";
import { SendMessageIcon } from "icons/SendMessageIcon";
import ThreeDotsIcon from "icons/ThreeDotsIcon";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "store/app/selectors";
import { store } from "store/configureStore";
import { MessageItem } from "store/meeting/types";

const isLink = (str: string): boolean => {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i", // fragment locator
  );
  return !!urlPattern.test(str);
};

const extractLinks = (str: string) => {
  const urlPattern = new RegExp(
    "(https?:\\/\\/(?:www\\.|(?!www))[^\\s\\.]+\\.[^\\s]{2,}|www\\.[^\\s]+\\.[^\\s]{2,}|https?:\\/\\/(?:www\\.|(?!www))[^\\s]+|www\\.[^\\s]+)",
    "gi",
  );
  const parts = str.split(urlPattern);
  return parts.map((part) => ({
    text: part,
    isLink: urlPattern.test(part),
  }));
};

const Conversation = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [inputValue, setInputValue] = useState("");
  const { meetingWsClient, messages } = store.getState().meeting;

  const sendMessage = () => {
    if (inputValue === "") return;
    const type = isLink(inputValue.trim()) ? "link" : "text";
    const payload: WSParticipantActionPayload = {
      event: "signal",
      type: WSParticipantActionType.NEW_MESSAGE,
      payload: {
        sender: {
          id: user?.id || "",
          avatar: user?.avatar || "",
          fullname: user?.fullname || "",
          position: user?.position?.name || "",
          username: user?.name || "",
        },
        content: inputValue,
        type,
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
              padding: "10px 54px 10px 16px",
              appearance: "none",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontFamily: "inherit",
              width: "100%",
              outline: "none",
              display: "flex",
              alignItems: "center",
            }}
            rows={1}
            onKeyDown={handleInputText}
            value={inputValue}
            onChange={handleChange}
            autoFocus
          />
          <IconButton
            onClick={sendMessage}
            sx={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <SendMessageIcon />
          </IconButton>
        </Box>
        <Button
          sx={{
            bgcolor: "#fff",
            borderRadius: "50%",
            minWidth: "44px",
            height: "44px",
          }}
        >
          <ThreeDotsIcon
            sx={{
              rotate: "90deg",
            }}
          />
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
  const messagePart = extractLinks(message.content);

  return (
    <>
      <Box
        sx={{
          bgcolor: isDarkMode ? "#3a3b3c" : "#fff",
          padding: 1.5,
          borderRadius: "12px 12px 0 12px",
          width: "calc(100% - 74px)",
        }}
      >
        <Text sx={{ fontWeight: 600 }}>You</Text>
        {messagePart.map((part) => (
          <Box key={part.text}>
            {part.isLink ? (
              <Link href={part.text} target="_blank">
                <Text
                  sx={{
                    fontSize: "14px",
                    color: "#3699FF",
                    textDecoration: "underline",
                    wordBreak: "break-word",
                  }}
                >
                  {part.text}
                </Text>
              </Link>
            ) : (
              <Text
                sx={{
                  fontSize: "14px",
                  color: "#17171F",
                  wordBreak: "break-word",
                }}
              >
                {part.text}
              </Text>
            )}
          </Box>
        ))}
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
  const messagePart = extractLinks(message.content);
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
          // 74px = x2 image size + gap
          width: "calc(100% - 74px)",
        }}
      >
        <Text sx={{ fontWeight: 600 }}>{message.sender.fullname}</Text>
        {messagePart.map((part) => (
          <Box key={part.text}>
            {part.isLink ? (
              <Link href={part.text} target="_blank">
                <Text
                  sx={{
                    fontSize: "14px",
                    color: "#3699FF",
                    textDecoration: "underline",
                    wordBreak: "break-word",
                  }}
                >
                  {part.text}
                </Text>
              </Link>
            ) : (
              <Text
                sx={{
                  fontSize: "14px",
                  color: "#17171F",
                  wordBreak: "break-word",
                }}
              >
                {part.text}
              </Text>
            )}
          </Box>
        ))}
      </Box>
    </>
  );
};
