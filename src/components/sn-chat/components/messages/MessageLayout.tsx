import Box, { BoxProps } from "@mui/material/Box";
import Avatar from "components/Avatar";
import Forward from "icons/Forward";
import { useCallback, useState } from "react";
import { useChat } from "store/chat/selectors";
import { CHAT_EVENT_TYPE, MessageInfoV2, STEP } from "store/chat/type";
import "../../../Editor/style.css";
import useTheme from "hooks/useTheme";
import ForwardSmall from "icons/ForwardSmall";
import { useTranslations } from "next-intl";
import { NS_CHAT_BOX } from "constant/index";
import { useWSChat } from "store/chat/helpers";

interface MessageLayoutProps {
  sessionId: string | undefined;
  message: MessageInfoV2;
  children: React.ReactNode;
  avatarPartner: string | undefined;
  hasNextMessageFromSameUser: boolean;
  messageProps: BoxProps;
  callBackForward?: () => void;
}

const MessageLayout = ({
  sessionId,
  message,
  children,
  hasNextMessageFromSameUser,
  messageProps,
}: MessageLayoutProps) => {
  const isCurrentUser = message?.sender === sessionId;
  const { sx, ...props } = messageProps || {};
  const [isForward, setIsForward] = useState(true);
  const commonChatBox = useTranslations(NS_CHAT_BOX);
  const {
    onSetStep,
    dataTransfer,
    isChatDesktop,
    onSetDataTransfer,
    onSetDrawerType,
    members,
  } = useChat();
  const { sendMessage } = useWSChat();
  const { isDarkMode } = useTheme();
  const avatarPartner = dataTransfer?.members?.find(
    (mem) => mem?.id === message?.sender,
  );
  const userForward = useCallback(() => {
    if (
      dataTransfer?.members?.find(
        (item) => item?.id === message?.forwarded_from,
      )
    ) {
      return dataTransfer?.members?.find(
        (item) => item?.id === message?.forwarded_from,
      )?.fullname;
    }

    if (members?.find((item) => item?.id === message?.forwarded_from)) {
      return members?.find((item) => item?.id === message?.forwarded_from)
        ?.fullname;
    } else {
      sendMessage({
        event: CHAT_EVENT_TYPE.DETAIL_MEMBER,
        memberId: message?.forwarded_from,
      });
    }
  }, [members]);

  return (
    <>
      <Box
        className="message-layout"
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          gap: "0.5rem",
          alignItems: "flex-end",
          justifyContent: isCurrentUser ? "flex-end" : "flex-start",
          "&:last-child": {
            paddingBottom: "1rem",
          },
          ...sx,
        }}
        {...props}
      >
        {isForward && (
          <>
            <Box
              className="forward-icon"
              order={isCurrentUser ? "1" : "3"}
              sx={{
                display: "flex",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Box
                className="mouse-pointer"
                onClick={() => {
                  if (isChatDesktop) {
                    onSetDataTransfer({ ...dataTransfer, message });
                    onSetDrawerType("forward");
                  } else {
                    onSetStep(STEP.CHAT_FORWARD, { ...dataTransfer, message });
                  }
                }}
                sx={{
                  backgroundColor: isDarkMode ? "#3a3b3c" : "#ECECF3",
                  height: "32px",
                  width: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Forward />
              </Box>
            </Box>
          </>
        )}
        {/* Message content */}
        {message?.forwarded_from ? (
          <Box order={"2"}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: "#3699FF",
                fontSize: "12px",
              }}
            >
              <ForwardSmall />
              {commonChatBox("chatBox.group.forwardMsg")} {userForward()}
            </Box>
            {children}
          </Box>
        ) : (
          <>{children}</>
        )}
        {/* Avartar partner */}
        {!isCurrentUser && (
          <Box
            order={isCurrentUser ? "2" : "1"}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {!isCurrentUser && (
              <Avatar
                alt="Avatar"
                size={30}
                src={avatarPartner?.avatar}
                style={{
                  // borderRadius: "10px",
                  visibility: hasNextMessageFromSameUser ? "hidden" : "visible",
                }}
              />
            )}
          </Box>
        )}
      </Box>
    </>
  );
};

export default MessageLayout;
