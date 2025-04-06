import NoData from "components/NoData";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, LinearProgress } from "@mui/material";
import { useAuth } from "store/app/selectors";
import ChatItemLayout from "components/sn-chat/components/chat/ChatItemLayout";
import {
  CHAT_EVENT_TYPE,
  CHAT_EVENT_TYPE_V2,
  CHAT_ROOM_TYPE,
  IChatItemInfo,
  STEP,
} from "store/chat/type";
import { useDeepCompareMemo } from "hooks/useDeepCompare";
import useTheme from "hooks/useTheme";
import { useChat } from "store/chat/selectors";
import { PAGE_INITIAL, useChatHelpers, useWSChat } from "store/chat/helpers";
import { send } from "process";
import { initPagingV2 } from "store/chat/reducer";

const ChatList = () => {
  const {
    dataTransfer: currentConversation,
    convention: conversations,
    conversationPagingV2: paging,
    isFetching, onSetRoomId,
    onSetDataTransfer,
    onSetConversationInfo,
    onSetStep,
    isSearchConversation, onSetMessagePaging,
    onSetMembers
  } = useChat();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { sendMessage, resetData, resetDataRoom} = useWSChat();
  const { loadMoreConversation, isGroup } = useChatHelpers();
  const [lastElement, setLastElement] = useState(null);
  const chatListRef = useRef<HTMLDivElement>(null);
  const scrollHeightRef = useRef(0);
  const observer = useMemo(() => {
    return new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        scrollHeightRef.current = chatListRef.current?.scrollHeight || 0;
        const clientHeight = chatListRef.current?.clientHeight || 0;
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
    return  conversations.map((item)=>{
      let roomDetail = item
      // if (item?.type === CHAT_ROOM_TYPE.PERSONAL) {
        roomDetail = {
          ...roomDetail,
          peer_detail: roomDetail?.lstMember?.find(
            (item) => item?.id != user?.id,
          ),
        // };
      }
      return roomDetail
    })
  }, [conversations, user]);

  const handleClickConversation = async (chatInfo: IChatItemInfo) => {
    try {
      if (!chatInfo.id) return;

      if (isSearchConversation && !isGroup(chatInfo?.type)) {
        sendMessage({

          "code": "message.getListMessage",
          "data": {
            "id": chatInfo.id
          }

        })

        sendMessage({
          event: CHAT_EVENT_TYPE.PERSONAL_ROOM,
          userId: chatInfo.id,
        });
      } else {
        sendMessage({

          "code": "message.getListMessage",
          "data": {
            "id": chatInfo.id
          }

        })
        // sendMessage({
        //   event: CHAT_EVENT_TYPE.DETAIL_ROOM,
        //   roomId: chatInfo.id,
        // });
      }
      await onSetMessagePaging(initPagingV2);
      // if (roomId === roomDetail?.id) return;
      let roomDetail = chatInfo
      
      // if (chatInfo?.type === CHAT_ROOM_TYPE.PERSONAL) {
      //   roomDetail = {
      //     ...roomDetail,
      //     peer_detail: roomDetail?.lstMember?.find(
      //       (item) => item?.id != user?.id,
      //     ),
      //   };
      // }
      onSetRoomId(roomDetail?.id);
      onSetDataTransfer(roomDetail);
      onSetConversationInfo(roomDetail);
      resetData();
      onSetMembers(roomDetail?.lstMember);

      if (roomDetail?.type === CHAT_ROOM_TYPE.GROUP) {
        onSetStep(STEP.CHAT_GROUP, roomDetail);
      } else {
        onSetStep(STEP.CHAT_ONE, roomDetail);
      }
      sendMessage({
        event: CHAT_EVENT_TYPE.MESSAGE_LIST,
        roomId: roomDetail?.id,
        page: PAGE_INITIAL,
      });
      if (chatInfo?.unseen_message_count > 0) {
        sendMessage({
          event: CHAT_EVENT_TYPE.MESSAGE_SEEN,
          messageId: chatInfo?.lastmsg?.id,
        });
      }


    } catch (error) { }
  };

  const renderConversation = (idActive: string) => {
    return _conversations.map((conversation, index) => (
      <>
        <ChatItemLayout
          chatInfo={conversation}
          sessionId={user?.["id"]}
          key={conversation.id}
          onClickConvention={handleClickConversation}
          isActive={idActive === conversation.id || false}
          chatItemProps={{
            ...(index === _conversations?.length - 1 && {
              ref: setLastElement,
            }),
          }}
        /></>
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
