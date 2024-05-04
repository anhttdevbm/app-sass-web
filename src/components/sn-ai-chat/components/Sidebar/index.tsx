"use client";

import { Box } from "@mui/material";
import { NewButton } from "components/shared";
import { NS_AI_CHAT } from "constant/index";
import useGetScreenMode from "hooks/useGetScreenMode";
import useTheme from "hooks/useTheme";
import PlusFillIcon from "icons/PlusFillIcon";
import TrashFillIcon from "icons/TrashFillIcon";
import { HEADER_HEIGHT } from "layouts/Header";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import ChatList from "./components/ChatList";
import { useChatSession } from "store/aiChat/selectors";
import { useAuth } from "store/app/selectors";

export const Sidebar = () => {
  const { mobileMode } = useGetScreenMode();
  const t = useTranslations(NS_AI_CHAT);
  const theme = useTheme();

  const { user } = useAuth();

  const { onDeleteAllChatSessions, onNewChat } = useChatSession();

  const styles = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      height: `calc(100vh - ${HEADER_HEIGHT}px)`,
      boxShadow: `2px 2px 20px 0px ${
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.18)"
          : "rgba(0, 0, 0, 0.085)"
      }`,
      bgcolor: "background.paper",
      ...(mobileMode
        ? { width: "100%" }
        : { minWidth: "300px", maxWidth: "300px" }),
    }),
    [mobileMode, theme.palette.mode],
  );


  const handleCloseAllChatSession = () => {
    if (user) {
      onDeleteAllChatSessions({ userId: user.id });
    }
  }

  return (
    <Box sx={styles}>
      <NewButton
        sx={addNewBtnSx}
        startIcon={<PlusFillIcon style={{ fontSize: "24px" }} />}
        onClick={onNewChat}
      >
        {t("sideBar.newChat")}
      </NewButton>
      <ChatList />
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
  backgroundColor: "error.light",
  width: "100%",
};
