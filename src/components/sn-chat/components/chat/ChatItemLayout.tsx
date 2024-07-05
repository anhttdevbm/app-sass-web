import Box, { BoxProps } from "@mui/material/Box";
import { Typography } from "@mui/material";
import { IChatItemInfo } from "store/chat/type";
import ChatItemRender from "./ChatItemRender";
import { renderTimeDiff } from "utils/index";
import useTheme from "hooks/useTheme";
import { useMemo } from "react";
import { TimeMessage } from "components/sn-chat/components/messages/MessageContent";
import { useAuth } from "store/app/selectors";

interface ChatItemProp {
  sessionId: string | undefined;
  chatInfo: IChatItemInfo;
  chatItemProps?: BoxProps;
  onClickConvention: (data: IChatItemInfo) => void;
  isActive?: boolean;
}
const ChatItemLayout = ({
  chatItemProps,
  sessionId,
  chatInfo,
  onClickConvention,
  isActive,
}: ChatItemProp) => {
  const { user } = useAuth();
  const { sx, ...props } = chatItemProps || {};
  const { lastmsg_at, unseen_message_count, owner, lastmsg } = chatInfo || {};
  const { isDarkMode } = useTheme();

  const renderColorByType = useMemo(() => {
    if (isDarkMode) {
      if (isActive) return "#313130";
      return "#3a3b3c";
    } else {
      if (isActive) return "#F7F7FD";
      return "white";
    }
  }, [isActive, isDarkMode]);

  return (
    <Box
      onClick={() => onClickConvention(chatInfo)}
      sx={{
        padding: "8px 0px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        marginBottom: 1,
        cursor: "pointer",
        position: "relative",
        background: renderColorByType,
        ":hover": {
          backgroundColor: isDarkMode ? "#313130" : "#F7F7FD",
        },
        borderBottom: "1px solid #E1F0FF",
        ...sx,
      }}
      {...props}
    >
      <ChatItemRender chatInfo={chatInfo} sessionId={sessionId} />
      <Box>
        <Typography
          variant="caption"
          color="#999999"
          ml="auto"
          whiteSpace="nowrap"
        >
          {renderTimeDiff(lastmsg_at)}
        </Typography>
        <br />
        {unseen_message_count > 0 ? (
          <Typography
            variant="caption"
            color="#999999"
            ml="auto"
            whiteSpace="nowrap"
            sx={{
              width: "20px",
              height: "20px",
              display: "flex",
              backgroundColor: "red",
              color: "white",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
            }}
          >
            {unseen_message_count >= 10 ? "9+" : unseen_message_count}
          </Typography>
        ) : (
          <TimeMessage
            isShowTime={false}
            isCurrentUser={lastmsg?.sender?.id === user?.id}
            isRead={lastmsg?.seen_user_count > 0}
            time={lastmsg_at}
          />
        )}
      </Box>
    </Box>
  );
};

export default ChatItemLayout;
