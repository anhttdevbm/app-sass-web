import { Skeleton, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import ChatItemLayout from "./ChatItemLayout";
import { useChat } from "store/chat/selectors";
import { CHAT_EVENT_TYPE, IChatItemInfo, STEP } from "store/chat/type";
import { useAuth } from "store/app/selectors";
import { useEffect, useMemo, useRef, useState } from "react";
import NewGroupIcon from "icons/NewGroupIcon";
import SearchRoundIcon from "icons/SearchRoundIcon";
import { NS_CHAT_BOX, NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import { useChatHelpers, useWSChat } from "store/chat/helpers";
import useTheme from "hooks/useTheme";
import { useWSChatConnect } from "store/chat/ws";

const ChatList = ({ onCloseChatBox }) => {
  const { user } = useAuth();
  const {
    isError,
    convention,
    conversationPaging: { pageIndex, pageSize, textSearch: initText },
    conversationPagingV2: paging,
    isFetching,
    isSearchConversation,
    onSetStep,
  } = useChat();

  useWSChatConnect();
  const { searchConversation, loadMoreConversation, isGroup } =
    useChatHelpers();
  const commonT = useTranslations(NS_COMMON);
  const commonChatBox = useTranslations(NS_CHAT_BOX);
  const { isDarkMode } = useTheme();
  const { sendMessage } = useWSChat();
  const [textSearch, setTextSearch] = useState(initText);
  const [lastElement, setLastElement] = useState(null);
  const chatListRef = useRef<HTMLDivElement>(null);
  const scrollHeightRef = useRef(0);
  const observer = useMemo(() => {
    return new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        scrollHeightRef.current = chatListRef.current?.scrollHeight || 0;
        const clientHeight = (chatListRef.current?.clientHeight || 0) + 100;

        if (scrollHeightRef.current > clientHeight && !!paging.next) {
          loadMoreConversation(paging.current);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatListRef.current?.scrollHeight]);

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

  const handleClickConversation = (chatInfo: IChatItemInfo) => {
    if (!chatInfo.id) return;
    if (isSearchConversation && !isGroup(chatInfo?.type)) {
      sendMessage({
        event: CHAT_EVENT_TYPE.PERSONAL_ROOM,
        userId: chatInfo.id,
      });
    } else {
      sendMessage({
        event: CHAT_EVENT_TYPE.DETAIL_ROOM,
        roomId: chatInfo.id,
      });
    }

    if (chatInfo?.unseen_message_count > 0) {
      sendMessage({
        event: CHAT_EVENT_TYPE.MESSAGE_SEEN,
        messageId: chatInfo?.lastmsg,
      });
    }
  };

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

  const handleSearch = (textSearch: string) => {
    setTextSearch(textSearch);
    searchConversation(textSearch);
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
          onChange={(e) => handleSearch(e.target.value)}
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
