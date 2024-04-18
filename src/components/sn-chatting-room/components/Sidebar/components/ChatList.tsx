import NoData from "components/NoData";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, LinearProgress } from "@mui/material";
import { useAuth } from "store/app/selectors";
import ChatItemLayout from "components/sn-chat/components/chat/ChatItemLayout";
import { CHAT_ROOM_TYPE, IChatItemInfo, STEP } from "store/chat/type";
import { useDeepCompareMemo } from "hooks/useDeepCompare";
import useTheme from "hooks/useTheme";
import { useChat } from "store/chat/selectors";
import { useChatHelpers } from "store/chat/helpers";

const ChatList = () => {
  const {
    dataTransfer: currentConversation,
    convention: conversations,
    onSetRoomId,
    onSetDataTransfer,
    onSetConversationInfo,
    onResetSearchChatText,
    conversationPagingV2: paging,
    onSetStep,
    onSetStateSearchMessage,
    isFetching,
  } = useChat();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  const { loadMoreConversation } = useChatHelpers();
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
    return conversations;
  }, [conversations, user]);

  const handleClickConversation = (chatInfo: IChatItemInfo) => {
    try {
      onSetRoomId(chatInfo.id);
      onSetDataTransfer(chatInfo);
      onSetConversationInfo(chatInfo);
      onSetStateSearchMessage(null);
      onResetSearchChatText();
      if (chatInfo?.type)
        if (chatInfo?.type === CHAT_ROOM_TYPE.GROUP) {
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
        key={conversation.id}
        onClickConvention={handleClickConversation}
        isActive={idActive === conversation.id || false}
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
            paddingLeft: "10px",
            paddingRight: "10px",
          }}
          ref={chatListRef}
        >
          {renderConversation(idActive)}
        </Box>
      </>
    );
  };

  return <>{renderConversations(currentConversation?.id as string)}</>;
};

export default ChatList;
