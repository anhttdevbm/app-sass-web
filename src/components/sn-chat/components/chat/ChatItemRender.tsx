import Box from "@mui/material/Box";
import Avatar from "components/Avatar";
import { ImageList, Typography } from "@mui/material";
import { IChatItemInfo } from "store/chat/type";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { NS_CHAT_BOX } from "constant/index";
import useTheme from "hooks/useTheme";

interface ChatItemRenderProps {
  sessionId: string;
  chatInfo: IChatItemInfo;
}
const ChatItemRender = ({ sessionId, chatInfo }: ChatItemRenderProps) => {
  const {
    lastMessage,
    name,
    avatar,
    t,
    usersCount,
    unreadCount,
    status: statusPartner,
  } = chatInfo || {};
  const commonChatBox = useTranslations(NS_CHAT_BOX);
  const { isDarkMode } = useTheme();

  const [avatarClone, setAvatarClone] = useState<string | undefined>(avatar);
  const isUnReadMessage = useMemo(() => unreadCount > 0, [unreadCount]);
  const isDirectMessage = useMemo(() => t === "d", [t]);
  const isMessageNotConnect = useMemo(() => lastMessage == null, [lastMessage]);
  const isGroup = useMemo(() => t !== "d", [t]);
  const isCurrentAccByLastMessage = useMemo(
    () => sessionId === lastMessage?.u?.username,
    [lastMessage, sessionId],
  );
  const lastMessageContent = useMemo(() => {
    const sendAttachment = lastMessage?.attachments?.length > 0;
    if (sendAttachment) {
      return isCurrentAccByLastMessage ? "You sent a file." : "Sent a file.";
    } else {
      return isCurrentAccByLastMessage
        ? `<p>${commonChatBox("chatBox.you")} ${lastMessage?.msg}</p>`
        : lastMessage?.msg;
    }
  }, [isCurrentAccByLastMessage, lastMessage]);

  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAvatarClone(avatar);
  }, [avatar]);
  useEffect(() => {
    if (lastMessageContent && lastMessageRef.current) {
      lastMessageRef.current.innerHTML = !isMessageNotConnect
        ? lastMessageContent
        : "";
    }
  }, [isMessageNotConnect, lastMessageContent]);

  const groupAvatar = useMemo(() => {
    if (!avatarClone && isGroup && usersCount > 3) {
      return (
        <ImageList
          sx={{ width: 56, height: 56, margin: 0 }}
          cols={2}
          rowHeight={164}
        >
          <Avatar
            alt="Avatar"
            size={25}
            style={{
              borderRadius: "5px",
            }}
          />
          <Avatar
            alt="Avatar"
            size={25}
            style={{
              borderRadius: "5px",
            }}
          />
          <Avatar
            alt="Avatar"
            size={25}
            style={{
              borderRadius: "5px",
            }}
          />
          {usersCount - 3 > 0 ? (
            <Box
              sx={{
                textAlign: "center",
                borderRadius: "5px",
                backgroundColor: "#3078F1",
                color: "white",
              }}
            >
              <Typography variant="caption">+ {usersCount - 3}</Typography>
            </Box>
          ) : null}
        </ImageList>
      );
    } else {
      return (
        <Avatar
          alt="Avatar"
          size={56}
          src={avatarClone || undefined}
          style={{
            borderRadius: "50%",
          }}
          onError={() => setAvatarClone(undefined)}
        />
      );
    }
  }, [avatarClone, isGroup, usersCount]);

  const switchChat = useMemo(() => {
    return (
      <>
        <Typography
          variant="inherit"
          fontWeight={isUnReadMessage ? 700 : 600}
          fontSize="14px"
          lineHeight="18px"
          color={isDarkMode ? "white" : "black"}
        >
          {isGroup ? name?.replaceAll("_", " ") : name}
        </Typography>
        <Typography
          ref={lastMessageRef}
          variant="caption"
          color="#999999"
          sx={{
            display: "flex",
            ...(isUnReadMessage && {
              fontWeight: 700,
              color: "black",
            }),
            "& *": {
              margin: 0,
              padding: 0,
              fontSize: "14px",
              lineHeight: "22px",
              fontWeight: "normal",
              pointerEvents: "none",
              ...(isUnReadMessage && {
                fontWeight: 700,
                color: "black",
              }),
            },
            "& p": {
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              ...(isCurrentAccByLastMessage && {
                "&:nth-of-type(1)": {
                  overflowWrap: "unset",
                  overflow: "initial",
                  marginRight: "0.3rem",
                },
              }),
            },
            "& a": {
              color: "#999999",
            },
            "& ol, & ul": {
              marginLeft: "1rem",
              display: "flex",
              gap: "2rem",
            },
            "& pre": {
              display: "-webkit-box",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            },
          }}
        />
      </>
    );
  }, [isCurrentAccByLastMessage, isUnReadMessage, name, isDarkMode]);

  return (
    <>
      <Box
        display={isUnReadMessage ? "block" : "none"}
        sx={{
          position: "absolute",
          left: "5px",
          top: "50%",
          width: "8px",
          height: "8px",
          backgroundColor: "#3699FF",
          borderRadius: "50%",
          transform: "translateY(-50%)",
        }}
      />
      <Box
        position="relative"
        sx={{
          "&::before": {
            content: `''`,
            position: "absolute",
            right: "-1px",
            bottom: "-1px",
            width: "16px",
            height: "16px",
            border: "2px solid #ffffff",
            backgroundColor: "#55C000",
            borderRadius: "50%",
            visibility: statusPartner === "online" ? "visible" : "hidden",
          },
        }}
      >
        {groupAvatar}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          gap: ".3rem",
        }}
      >
        {switchChat}
      </Box>
    </>
  );
};

export default ChatItemRender;
