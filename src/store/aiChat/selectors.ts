import { DataStatus } from "constant/enums";
import { useCallback, useMemo } from "react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  deleteChatSession,
  editChatSession,
  getChatSessions,
  getExamplePrompt,
  getPersona,
  getTone,
} from "./actions";
import {
  ChatSessionData,
  GetChatSessionsQueries,
  GetExamplePromptQueries,
  GetPersonaQueries,
  GetToneQueries,
} from "./type";

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

  const onEditChatSession = useCallback(
    ({ id, ...data }: Partial<ChatSessionData> & { id: string }) => {
      dispatch(editChatSession({ id, ...data }));
    },
    [dispatch],
  );

  const onDeleteChatSession = useCallback(
    (id: string) => {
      dispatch(deleteChatSession(id));
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
    onEditChatSession,
    onDeleteChatSession,
  };
};

export const useChatWithAI = () => {
  const dispatch = useAppDispatch();
  const {
    persona,
    personaFilters,
    personaStatus,
    personaError,
    tone,
    toneFilters,
    toneStatus,
    toneError,
  } = useAppSelector((state) => state.aiChat, shallowEqual);

  const isPersonaIdle = useMemo(() => personaStatus === DataStatus.IDLE, [personaStatus]);
  const isPersonaFetching = useMemo(() => personaStatus === DataStatus.LOADING, [personaStatus]);

  const isToneIdle = useMemo(() => toneStatus === DataStatus.IDLE, [toneStatus]);
  const isToneFetching = useMemo(() => toneStatus === DataStatus.LOADING, [toneStatus]);

  const onGetPersona = useCallback((queries: GetPersonaQueries) => {
    dispatch(getPersona(queries));
  }, [dispatch]);

  const onGetTone = useCallback(
    (queries: GetToneQueries) => {
      dispatch(getTone(queries));
    },
    [dispatch],
  );

  return {
    persona,
    personaStatus,
    personaError,
    tone,
    toneStatus,
    toneError,
    isPersonaIdle,
    isPersonaFetching,
    isToneIdle,
    isToneFetching,
    dispatch,
    onGetPersona,
    onGetTone,
    personaFilters,
    toneFilters,
  };
};
