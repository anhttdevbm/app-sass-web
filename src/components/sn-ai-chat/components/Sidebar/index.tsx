"use client";

import { Box } from "@mui/material";
import { NewButton } from "components/shared";
import useGetScreenMode from "hooks/useGetScreenMode";
import useTheme from "hooks/useTheme";
import PlusFillIcon from "icons/PlusFillIcon";
import TrashFillIcon from "icons/TrashFillIcon";
import { useMemo } from "react";
import ChatList, { Chat } from "./components/ChatList";
import { HEADER_HEIGHT } from "layouts/Header";
import { NS_AI_CHAT } from "constant/index";
import { useTranslations } from "next-intl";

const chats: Chat[] = [
  {
    id: "6621fa46b7a346dbc7a0a3be",
    chatname: "How are you?",
    last_question_at: "2024-04-19T05:00:08.614000Z",
  },
  {
    id: "6621fa02b7a346dbc7a0a3bc",
    chatname: "bạn là ai",
    last_question_at: "2024-04-19T04:59:08.992000Z",
  },
];

export const Sidebar = () => {
  const { mobileMode } = useGetScreenMode();
  const t = useTranslations(NS_AI_CHAT);
  const theme = useTheme();

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

  return (
    <Box sx={styles}>
      <NewButton
        sx={addNewBtnSx}
        startIcon={<PlusFillIcon style={{ fontSize: "24px" }} />}
      >
        {t("sideBar.newChat")}
      </NewButton>
      <ChatList chats={chats} />
      <NewButton startIcon={<TrashFillIcon />} sx={clearAllBtnSx}>
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
