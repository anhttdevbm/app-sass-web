import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  InputBase,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import useTheme from "hooks/useTheme";
import ProfileAdd from "icons/ProfileAdd";
import SearchIcon from "icons/SearchIcon";
import SidebarIcon from "icons/SidebarIcon";
import VideoCallIcon from "icons/VideoCallIcon";
import colorSchemes from "utils/colorSchemes";
import ChatDetailInfo from "./ChatDetailInfo";
import CloseIcon from "icons/CloseIcon";
import useGetScreenMode from "hooks/useGetScreenMode";
import _ from "lodash";
import { AN_ERROR_TRY_AGAIN, NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import { useSnackbar } from "store/app/selectors";
import { useChat } from "store/chat/selectors";
import { debounce } from "utils/index";
import { Text } from "components/shared";
import { ArrowCircleDown, ArrowCircleUp } from "@mui/icons-material";
import { RoomType, STEP } from "store/chat/type";

const RoomHeader = () => {
  const { isDarkMode } = useTheme();
  const t = useTranslations(NS_COMMON);
  const { mobileMode } = useGetScreenMode();
  const { onAddSnackbar } = useSnackbar();

  const {
    onSearchChatText,
    listSearchMessage,
    onSetStateSearchMessage,
    onSetDrawerType,
    dataTransfer: currentConversation,
    onResetConversationInfo,
    onCloseDrawer,
    roomId,
    onSetDataTransfer,
    isFetchingDetail,
    onSetIndexSearch,
    selectSearchIndex,
  } = useChat();
  const [search, setSearchText] = useState({
    text: "",
    isOpen: false,
  });

  const inputRef = useRef<any>(null);

  const onResetSearchText = useCallback(() => {
    setSearchText((prev) => ({
      ...prev,
      text: "",
      isOpen: false,
    }));
    onSetIndexSearch(0);
  }, []);

  const handleSearchChatText = useCallback(async () => {
    try {
      await onSearchChatText({
        text: search?.text,
        type: currentConversation?.t as RoomType,
        roomId: currentConversation?._id,
      });
    } catch (error) {
      onAddSnackbar(
        typeof error === "string" ? error : t(AN_ERROR_TRY_AGAIN),
        "error",
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.isOpen, search.text]);

  const debounceSearchText = debounce((text: string) => {
    setSearchText({ ...search, text });
  }, 1000);

  const onOpenSearchMessage = () => {
    setSearchText({ isOpen: !search.isOpen, text: "" });
  };

  useEffect(() => {
    handleSearchChatText();
  }, [handleSearchChatText]);

  const onDirectToMessage = useCallback(
    (type) => {
      if (
        selectSearchIndex < 0 ||
        selectSearchIndex > listSearchMessage.length - 1
      )
        return;
      const newIndex =
        type === "up" ? selectSearchIndex + 1 : selectSearchIndex - 1;
      if (newIndex === -1 || newIndex > listSearchMessage.length - 1) return;
      onSetIndexSearch(newIndex);
      const message = listSearchMessage[newIndex];
      // if (newIndex < 5) return;
      onSetStateSearchMessage(message);
    },
    [
      listSearchMessage,
      onSetIndexSearch,
      onSetStateSearchMessage,
      selectSearchIndex,
    ],
  );

  useEffect(() => {
    if (listSearchMessage?.length > 0) {
      onSetIndexSearch(listSearchMessage?.length - 1);
    }
  }, [listSearchMessage?.length, onSetIndexSearch]);

  useEffect(() => {
    onResetSearchText();
    onCloseDrawer("info");
  }, [onResetSearchText, onResetConversationInfo, onCloseDrawer, roomId]);

  return (
    <>
      <Box
        width="100%"
        display="flex"
        justifyContent="space-between"
        height="77px"
        padding="10px"
        bgcolor={isDarkMode ? "#3a3b3c" : "var(--Gray0, #F7F7FD)"}
      >
        <Box
          width="100%"
          display="flex"
          padding="10px"
          gap="20px"
          alignItems="center"
        >
          <Box display="flex" alignItems="center" gap={"10px"} minWidth={200}>
            <Avatar
              src={currentConversation?.avatar}
              sx={{ height: "56px", width: "56px", borderRadius: "10px" }}
            />
            <Box display="flex" flexDirection="column" gap="4px">
              <Typography
                variant="h6"
                color={isDarkMode ? "white" : "var(--Black, #212121)"}
                textOverflow="ellipsis"
                overflow="hidden"
              >
                {currentConversation?.t !== "d"
                  ? currentConversation?.name?.replaceAll("_", " ")
                  : currentConversation?.name}
              </Typography>
              <Typography variant="body2" color="var(--Gray3, #999)">
                {currentConversation?.status}
              </Typography>
            </Box>
          </Box>
          {search?.isOpen && (
            <Box
              display="flex"
              gap="10px"
              sx={{
                width: "70%",
              }}
            >
              <Paper
                component="form"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  height: "40px",
                  borderRadius: "8px",
                  boxShadow: "none",
                  ...(isDarkMode
                    ? { background: "#1e1e1e", color: "white" }
                    : {}),
                  ...(!mobileMode
                    ? { width: "200px" }
                    : { width: "80%", border: "1px solid" }),
                }}
              >
                <IconButton sx={{ p: "10px" }} aria-label="search">
                  <SearchIcon onClick={() => inputRef?.current?.focus()} />
                </IconButton>

                <InputBase
                  inputRef={inputRef}
                  size="small"
                  placeholder="Search text"
                  onChange={(e) => debounceSearchText(e.target.value)}
                  sx={{
                    width: "100%",
                    ...(isDarkMode
                      ? { background: "#1e1e1e", color: "white" }
                      : { background: "white" }),
                    fontSize: 14,
                    "& .MuiInputBase-input": {
                      padding: "0px !important",
                    },
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                />
              </Paper>
              {search?.text?.length > 0 && listSearchMessage?.length > 0 && (
                <Box
                  display="flex"
                  gap="10px"
                  width="240px"
                  alignItems="center"
                >
                  <Text variant="body2" className="text-option">
                    {listSearchMessage?.length - selectSearchIndex} of{" "}
                    {listSearchMessage?.length} matches
                  </Text>
                  <IconButton
                    sx={{ p: "5px", bgcolor: isDarkMode ? "#3a3b3c" : "white" }}
                    aria-label="search"
                    onClick={() => onDirectToMessage("up")}
                  >
                    <ArrowCircleUp />
                  </IconButton>
                  <IconButton
                    sx={{ p: "5px", bgcolor: isDarkMode ? "#3a3b3c" : "white" }}
                    aria-label="search"
                    onClick={() => onDirectToMessage("down")}
                  >
                    <ArrowCircleDown />
                  </IconButton>
                </Box>
              )}
            </Box>
          )}
        </Box>
        <Box
          justifyContent="flex-end"
          width="100%"
          display="flex"
          padding="10px"
          gap="4px"
          alignItems="center"
        >
          <IconButton
            sx={{
              color:
                colorSchemes[isDarkMode ? "dark" : "light"].palette.secondary
                  .main,
            }}
            onClick={onOpenSearchMessage}
          >
            {search?.isOpen ? <CloseIcon /> : <SearchIcon />}
          </IconButton>
          <IconButton
            sx={{
              color: "transparent",
            }}
            onClick={() => {
              onSetDrawerType("group");
              onSetDataTransfer({
                ...currentConversation,
                isNew: currentConversation?.t === "d",
              });
            }}
          >
            <ProfileAdd />
          </IconButton>
          <IconButton
            sx={{
              color: "transparent",
            }}
          >
            <VideoCallIcon />
          </IconButton>
          <IconButton
            sx={{
              color: "transparent",
            }}
            onClick={() => onSetDrawerType("info")}
          >
            <SidebarIcon />
          </IconButton>
        </Box>
        <ChatDetailInfo />
      </Box>
      {isFetchingDetail && <LinearProgress color="primary" />}
    </>
  );
};

export default RoomHeader;
