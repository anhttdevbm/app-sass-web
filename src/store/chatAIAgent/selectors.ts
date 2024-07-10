import { useAppDispatch, useAppSelector } from "store/hooks";
import { shallowEqual } from "react-redux";
import { useCallback, useMemo } from "react";
import { DataStatus } from "constant/enums";
import { ChatFilter, GetChatRequest, SendChatData } from "store/chatAIAgent/types";
import { addChat, chat, getChat } from "store/chatAIAgent/actions";


export const useChatAIAgent = () => {
  const dispatch = useAppDispatch();

  const {
    chatData,
    chatAIStatus,
    page,
    hasNextPage
  } = useAppSelector((state) => state.chatAIAgent, shallowEqual);

  const onChat = useCallback(async (data: SendChatData) => {
    dispatch(addChat({
      ...data,
      assistant_content: "",
    }));
    dispatch(chat(data));
  }, [dispatch]);
  const isChatFetching = useMemo(() => chatAIStatus === DataStatus.LOADING, [chatAIStatus])

  const onGetChat = useCallback(async ({agentId, queries}: GetChatRequest) => {
    dispatch(getChat({agentId, queries}));
  }, [dispatch]);
  const isGetChatFetching = useMemo(() => chatAIStatus === DataStatus.LOADING, [chatAIStatus])

  return {
    chatData,
    page,
    hasNextPage,

    onChat,
    onGetChat,

    isGetChatFetching,
    isChatFetching
  };
}
