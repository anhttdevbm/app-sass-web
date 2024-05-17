"use client";

import { Box, useMediaQuery } from "@mui/material";
import { NewButton } from "components/shared";
import { NS_AI_CHAT } from "constant/index";
import useTheme from "hooks/useTheme";
import PlusFillIcon from "icons/PlusFillIcon";
import TrashFillIcon from "icons/TrashFillIcon";
import { HEADER_HEIGHT } from "layouts/Header";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useChatSession } from "store/aiChat/selectors";
import { useAuth } from "store/app/selectors";
import ChatList from "./components/ChatList";

interface SidebarProps {
  popupMode?: boolean;
  onSwitchToBoxChat?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  popupMode,
  onSwitchToBoxChat,
}) => {
  const t = useTranslations(NS_AI_CHAT);
  const theme = useTheme();

  const { onDeleteAllChatSessions, onNewChat } = useChatSession();

  const mobileMode = useMediaQuery("(max-width:600px)");

  const styles = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      bgcolor: "background.paper",
      ...(mobileMode
        ? { width: "100%", height: `calc(100vh - ${HEADER_HEIGHT}px)` }
        : popupMode
        ? {
            width: "100%",
            height: "92.5%",
          }
        : {
            minWidth: "300px",
            maxWidth: "300px",
            boxShadow: `2px 2px 20px 0px ${
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.18)"
                : "rgba(0, 0, 0, 0.085)"
            }`,
            height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          }),
    }),
    [mobileMode, theme.palette.mode],
  );

  const handleCloseAllChatSession = () => {
    onDeleteAllChatSessions();
  };

  const handleNewChat = () => {
    if (onSwitchToBoxChat) {
      onSwitchToBoxChat();
    }
    onNewChat();
  };

  return (
    <Box sx={styles}>
      <NewButton
        sx={{ ...addNewBtnSx, background: mobileMode ? "#EEF8FF" : "white" }}
        startIcon={<PlusFillIcon style={{ fontSize: "24px" }} />}
        onClick={handleNewChat}
      >
        {t("sideBar.newChat")}
      </NewButton>
      <ChatList popupMode={popupMode} onSwitchToBoxChat={onSwitchToBoxChat} />
      <NewButton
        startIcon={<TrashFillIcon />}
        sx={clearAllBtnSx}
        onClick={handleCloseAllChatSession}
      >
        {t("sideBar.clearConversations")}
      </NewButton>
    </Box>
  );
};

const addNewBtnSx = {
  "&.MuiButton-root": {
    borderRadius: "0",
    justifyContent: "flex-start",
    fontSize: "14px",
    fontWeight: "400",
    color: "primary.main",
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
    borderBottomColor: "primary.light",
    padding: "16px 8px",
  },
};

const clearAllBtnSx = {
  borderRadius: "0",
  justifyContent: "center",
  fontSize: "14px",
  fontWeight: "400",
  color: "error.main",
  width: "100%",
  background: "#FFF0F1",
};
