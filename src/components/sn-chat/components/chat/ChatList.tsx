import { Skeleton, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import ChatItemLayout from "./ChatItemLayout";
import { useChat } from "store/chat/selectors";
import { DirectionChat, IChatItemInfo, STEP } from "store/chat/type";
import { useAuth, useSnackbar } from "store/app/selectors";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import NewGroupIcon from "icons/NewGroupIcon";
import SearchRoundIcon from "icons/SearchRoundIcon";
import {
  AN_ERROR_TRY_AGAIN,
  NS_CHAT_BOX,
  NS_COMMON,
  NS_PROJECT,
} from "constant/index";
import { useTranslations } from "next-intl";
import { useWSChat } from "store/chat/helpers";
import useTheme from "hooks/useTheme";

const ChatList = ({ onCloseChatBox }) => {
  const { user } = useAuth();
  const {
    isError,
    convention,
    conversationPaging: { pageIndex, pageSize, textSearch: initText },
    isFetching,
    currStep,
    onSetRoomId,
    onSetConversationInfo,
    onGetAllConvention,
    onSetStep,
  } = useChat();

  useWSChat();
  const { onAddSnackbar } = useSnackbar();
  const commonT = useTranslations(NS_COMMON);
  const commonChatBox = useTranslations(NS_CHAT_BOX);
  const { isDarkMode } = useTheme();

  const [textSearch, setTextSearch] = useState(initText);
  const [lastElement, setLastElement] = useState(null);
  const pageRef = useRef(pageIndex);
  const chatListRef = useRef<HTMLDivElement>(null);
  const scrollHeightRef = useRef(0);
  const observer = useMemo(() => {
    return new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        pageRef.current = pageRef.current + pageSize;

        scrollHeightRef.current = chatListRef.current?.scrollHeight || 0;
        const clientHeight = (chatListRef.current?.clientHeight || 0) + 100;

        if (scrollHeightRef.current > clientHeight) {
          console.log(initText);

          handleGetConversation(initText, "a", pageRef.current, pageSize);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, initText]);

  const conversationList = useMemo(() => {
    return convention
      .filter((item) => item.username !== user?.["username"])
      .map((item) => {
        if (item.t === "d") {
          const itemClone = { ...item };
          if (item.statuses && item.statuses.length > 0) {
            const statusPartner =
              item.statuses?.[0].username === user?.["username"]
                ? item.statuses?.[1]?.status
                : item.statuses?.[0]?.status;
            itemClone.status = statusPartner;
          }

          if (item.usernames && item.usernames.length > 0) {
            const usernamePartner =
              item.usernames?.[0] === user?.["username"]
                ? item.usernames?.[1]
                : item.usernames?.[0];
            itemClone.username = usernamePartner;
          }

          return itemClone;
        }
        return item;
      });
  }, [convention, user]);

  const handleGetConversation = useCallback(
    async (
      text: string,
      type: DirectionChat,
      offset?: number,
      count?: number,
    ) => {
      try {
        await onGetAllConvention({
          type,
          text,
          offset: offset || 0,
          count: count || 10,
        });
      } catch (error) {
        onAddSnackbar(
          typeof error === "string" ? error : commonT(AN_ERROR_TRY_AGAIN),
          "error",
        );
      }
    },
    [onAddSnackbar, onGetAllConvention, commonT],
  );

  const handleClickConversation = (chatInfo: IChatItemInfo) => {
    onSetRoomId(chatInfo._id);
    onSetConversationInfo(chatInfo);

    if (chatInfo?.t)
      if (chatInfo?.t !== "d") {
        onSetStep(STEP.CHAT_GROUP, chatInfo);
      } else {
        onSetStep(STEP.CHAT_ONE, chatInfo);
      }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleGetConversation(event.target.value.toLowerCase(), "a");
    }
  };

  useEffect(() => {
    handleGetConversation("", "a");
  }, [currStep]);

  useEffect(() => {
    pageRef.current = pageIndex;
  }, [pageIndex]);

  useEffect(() => {
    const currentElement = lastElement;
    const currentObserver = observer;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [lastElement, observer]);

  const handleCloseChatBox = () => {
    onCloseChatBox();
  };

  return (
    <Box
      height="inherit"
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          padding: 2,
          backgroundColor: "#3699FF",
        }}
      >
        <Typography color="white" variant="h4" onClick={handleCloseChatBox}>
          {commonChatBox("chatBox.chat")}
        </Typography>

        <TextField
          size="small"
          sx={{
            backgroundColor: "white",
            borderRadius: "8px",
            "& .MuiInputBase-root": {
              color: "black",
              border: "1px solid transparent",
            },
            "& fieldset": {
              border: "unset",
            },

            flex: 1,
          }}
          inputProps={{
            sx: {
              paddingLeft: "5px",
              fontSize: "14px!important",
              fontWeight: 400,
              lineHeight: "22px",
              "&::-webkit-input-placeholder": {
                color: "#999999",
                opacity: 1,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <SearchRoundIcon
                sx={{
                  fill: "none",
                  filter: "opacity(0.8)",
                  height: "24px",
                  width: "24px",
                }}
              />
            ),
          }}
          placeholder={commonChatBox("chatBox.searchName")}
          fullWidth
          value={textSearch}
          onChange={(e) => setTextSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <Box
          onClick={() => {
            onSetStep(STEP.ADD_GROUP, { isNew: true });
          }}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
            cursor: "pointer",
            fontSize: "24rem!important",
            width: "38px",
            height: "100%",
            borderRadius: "8px",
          }}
        >
          <NewGroupIcon />
        </Box>
      </Box>
      <Box
        ref={chatListRef}
        overflow="auto"
        maxHeight="calc(600px - 74px - 15px)"
        bgcolor={isDarkMode ? "#303031" : "white"}
        sx={{
          padding: "0px 24px 24px 24px",
        }}
      >
        {(isFetching || isError) && pageIndex === 0 ? (
          Array.from({ length: 5 }, (_, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
              p={2}
            >
              <Skeleton variant="rounded" width={40} height={40} />
              <Box flex={1}>
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "1rem" }}
                  width="40%"
                />
              </Box>
            </Box>
          ))
        ) : (
          <>
            {conversationList?.length > 0 ? (
              conversationList.map((item, index) => {
                return (
                  <ChatItemLayout
                    chatInfo={item}
                    sessionId={user?.["username"]}
                    key={index}
                    onClickConvention={handleClickConversation}
                    chatItemProps={{
                      ...(index === conversationList?.length - 1 && {
                        ref: setLastElement,
                      }),
                    }}
                  />
                );
              })
            ) : (
              <Typography textAlign="center" marginTop={2}>
                {commonT("noData")}
              </Typography>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default ChatList;
