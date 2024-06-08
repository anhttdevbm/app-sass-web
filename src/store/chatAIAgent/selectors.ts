import { useAppDispatch, useAppSelector } from "store/hooks";
import { shallowEqual } from "react-redux";
import { useCallback, useMemo } from "react";
import { DataStatus } from "constant/enums";


export const useChatAIAgent = () => {
  const dispatch = useAppDispatch();

  const {
    chatData,
    chatAIStatus,
    page
  } = useAppSelector((state) => state.chatAIAgent, shallowEqual);

  const onChat = useCallback(async (queries: any) => {

  }, [dispatch]);

  const onGetChat = useCallback(async (queries: any) => {

  }, [dispatch]);
  const isGetChatFetching = useMemo(() => chatAIStatus === DataStatus.LOADING, [chatAIStatus])

  return {
    chatData,
    page,

    onChat,
    onGetChat,

    isGetChatFetching,
  };
}
