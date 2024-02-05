import NoData from "components/NoData";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useAuth, useSnackbar } from "store/app/selectors";
import ChatItemLayout from "components/sn-chat/components/chat/ChatItemLayout";
import { DirectionChat, IChatItemInfo, STEP } from "store/chat/type";
import { useDeepCompareMemo } from "hooks/useDeepCompare";
import useTheme from "hooks/useTheme";
import { useChat } from "store/chat/selectors";
import { useTranslations } from "next-intl";
import { AN_ERROR_TRY_AGAIN, NS_COMMON } from "constant/index";

const ChatList = () => {
  const {
    dataTransfer: currentConversation,
    convention: conversations,
    onSetRoomId,
    onSetDataTransfer,
    onSetConversationInfo,
    onGetAllConvention,
    onResetSearchChatText,
    conversationPaging: { pageIndex, pageSize, textSearch: initText },
    onSetStep,
    onSetStateSearchMessage,
    isFetching,
  } = useChat();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  const { onAddSnackbar } = useSnackbar();
  const commonT = useTranslations(NS_COMMON);

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
          handleGetConversation(initText, "a", pageRef.current, pageSize);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);

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

  const _conversations = useDeepCompareMemo(() => {
    return conversations
      .filter((item) => item.username !== user?.["username"])
      .map((item) => {
        if (item.t !== "d") return item;
        return {
          ...item,
          ...(item?.statuses?.length > 0
            ? {
                status:
                  item.statuses?.[0].username === user?.["username"]
                    ? item.statuses?.[1]?.status
                    : item.statuses?.[0]?.status,
              }
            : {}),
          ...(item?.usernames?.length > 0
            ? {
                username:
                  item.usernames?.[0] === user?.["username"]
                    ? item.usernames?.[1]
                    : item.usernames?.[0],
              }
            : {}),
        };
      });
  }, [conversations, user]);

  const handleClickConversation = (chatInfo: IChatItemInfo) => {
    try {
      onSetRoomId(chatInfo._id);
      onSetDataTransfer(chatInfo);
      onSetConversationInfo(chatInfo);
      onSetStateSearchMessage(null);
      onResetSearchChatText();
      if (chatInfo?.t)
        if (chatInfo?.t !== "d") {
          onSetStep(STEP.CHAT_GROUP, chatInfo);
        } else {
          onSetStep(STEP.CHAT_ONE, chatInfo);
        }
    } catch (error) {}
  };

  const renderConversation = (idActive: string) => {
    return _conversations.map((conversation, index) => (
      <ChatItemLayout
        chatInfo={conversation}
        sessionId={user?.["username"]}
        key={conversation._id}
        onClickConvention={handleClickConversation}
        isActive={idActive === conversation._id || false}
        chatItemProps={{
          ...(index === _conversations?.length - 1 && {
            ref: setLastElement,
          }),
        }}
      />
    ));
  };

  const renderConversations = (idActive: string) => {
    if (_conversations.length <= 0 && !isFetching) {
      return <NoData />;
    }

    return (
      <>
        {isFetching && <LinearProgress color="primary" />}
        <Box
          display="flex"
          flexDirection="column"
          width="100%"
          height="90vh"
          sx={{
            overflowX: "scroll",
            bgcolor: isDarkMode ? "var(--mui-palette-grey-50)" : "white",
            paddingLeft: '10px',
            paddingRight: '10px',
          }}
          ref={chatListRef}
        >
          {renderConversation(idActive)}
        </Box>
      </>
    );
  };

  return <>{renderConversations(currentConversation?._id as string)}</>;
};

export default ChatList;
