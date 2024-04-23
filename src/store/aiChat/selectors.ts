import { DataStatus } from "constant/enums";
import { useCallback, useMemo } from "react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getChatSessions, getExamplePrompt } from "./actions";
import { GetChatSessionsQueries, GetExamplePromptQueries } from "./type";

export const useExamplePrompt = () => {
  const dispatch = useAppDispatch();
  const {
    examplePrompts,
    examplePromptsFilters: filters,
    examplePromptsStatus: status,
    examplePromptsError: error,
  } = useAppSelector((state) => state.aiChat, shallowEqual);

  const isExamplePromptIdle = useMemo(
    () => status === DataStatus.IDLE,
    [status],
  );
  const isExamplePromptFetching = useMemo(
    () => status === DataStatus.LOADING,
    [status],
  );

  const onGetExamplePrompt = useCallback(
    (queries: GetExamplePromptQueries) => {
      dispatch(getExamplePrompt(queries));
    },
    [dispatch],
  );

  return {
    examplePrompts,
    status,
    error,
    filters,
    isExamplePromptIdle,
    isExamplePromptFetching,
    dispatch,
    onGetExamplePrompt,
  };
};

export const useChatSession = () => {
  const dispatch = useAppDispatch();
  const {
    chatSessions,
    chatSessionsFilters: filters,
    chatSessionsStatus: status,
    chatSessionsError: error,
    chatSessionsNextPage: nextPage,
  } = useAppSelector((state) => state.aiChat, shallowEqual);

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

  const onGetChatSessions = useCallback(
    (queries: GetChatSessionsQueries) => {
      dispatch(getChatSessions(queries));
    },
    [dispatch],
  );

  return {
    chatSessions,
    status,
    error,
    filters,
    isIdle,
    isFetching,
    dispatch,
    onGetChatSessions,
    nextPage,
  };
};
