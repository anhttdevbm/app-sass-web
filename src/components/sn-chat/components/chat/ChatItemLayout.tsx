import Box, { BoxProps } from "@mui/material/Box";
import { Typography } from "@mui/material";
import { IChatItemInfo } from "store/chat/type";
import ChatItemRender from "./ChatItemRender";
import { renderTimeDiff } from "utils/index";
import useTheme from "hooks/useTheme";
import { useMemo } from "react";

interface ChatItemProp {
  sessionId: string;
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
  const { sx, ...props } = chatItemProps || {};
  const { lastMessage } = chatInfo || {};
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
      <Typography
        variant="caption"
        color="#999999"
        ml="auto"
        whiteSpace="nowrap"
      >
        {renderTimeDiff(lastMessage?.ts)}
      </Typography>
    </Box>
  );
};

export default ChatItemLayout;
