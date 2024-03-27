import Box, { BoxProps } from "@mui/material/Box";
import Avatar from "components/Avatar";
import Forward from "icons/Forward";
import { useState } from "react";
import { useChat } from "store/chat/selectors";
import { MessageInfo, STEP } from "store/chat/type";
import "../../../Editor/style.css";
import useTheme from "hooks/useTheme";
import ForwardSmall from "icons/ForwardSmall";

interface MessageLayoutProps {
  sessionId: string;
  message: MessageInfo;
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
  avatarPartner,
  hasNextMessageFromSameUser,
  messageProps,
}: MessageLayoutProps) => {
  const isCurrentUser = message.u.username === sessionId;
  const { sx, ...props } = messageProps || {};
  const [isForward, setIsForward] = useState(true);
  const {
    onSetStep,
    dataTransfer,
    isChatDesktop,
    onSetDataTransfer,
    onSetDrawerType,
  } = useChat();
  const { isDarkMode } = useTheme();

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
        {message?.alias ? (
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
              {message?.alias}
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
                src={avatarPartner}
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
