import { DataStatus } from "constant/enums";
import { useCallback, useMemo } from "react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  addChatWithAI,
  chatWithAI,
  createChatSession,
  deleteAllChatSessions,
  deleteChatSession,
  editChatSession,
  getChatSessions,
  getExamplePrompt,
  getOpenAIChat,
  getPersona,
  getTone,
  newChat,
  setSelectedChatId,
} from "./actions";
import {
  ChatSessionData,
  ChatWithAIData,
  DeleteAllChatSessionQueries,
  GetChatSessionsQueries,
  GetExamplePromptQueries,
  GetOpenAIChatQueries,
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
    chatSessionsFilters,
    chatSessionsStatus,
    chatSessionsError,
    chatSessionsNextPage,

    chatSession,
    chatSessionStatus,
    chatSessionError,
    chatSessionFilters,
    newChatSessionCreated
  } = useAppSelector((state) => state.aiChat, shallowEqual);

  const isChatSessionsIdle = useMemo(
    () => chatSessionsStatus === DataStatus.IDLE,
    [chatSessionsStatus],
  );

  const isChatSessionsFetching = useMemo(
    () => chatSessionsStatus === DataStatus.LOADING,
    [chatSessionsStatus],
  );

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

  const onDeleteAllChatSessions = useCallback(
    (queries: DeleteAllChatSessionQueries) => {
      dispatch(newChat());
      dispatch(deleteAllChatSessions(queries));
    },
    [dispatch],
  );

  const onCreateChatSession = useCallback(
    (data: ChatSessionData) => {
      dispatch(createChatSession(data));
    },  
    [dispatch],
  );

  const onSelectChatId = useCallback(
    (chatId?: string) => {
      dispatch(setSelectedChatId(chatId));
    },
    [dispatch],
  );

  const onNewChat = useCallback(() => {
    dispatch(newChat());
  }, [dispatch]);

  return {
    chatSessions,
    chatSessionStatus,
    chatSessionsError,
    chatSessionsFilters,
    onGetChatSessions,
    chatSessionsNextPage,
    isChatSessionsIdle,
    isChatSessionsFetching,
    onEditChatSession,
    onDeleteChatSession,
    onDeleteAllChatSessions,

    onCreateChatSession,
    chatSession,
    chatSessionError,
    chatSessionFilters, 
    newChatSessionCreated,

    onSelectChatId,
    onNewChat,
  };
};

export const useChatWithAI = () => {
  const dispatch = useAppDispatch();
  const {
    // persona selector
    persona,
    personaFilters,
    personaStatus,
    personaError,

    // tone selector
    tone,
    toneFilters,
    toneStatus,
    toneError,

    openAIChat,
    openAIChatStatus,
    openAIChatError,
    openAIChatFilters,
  } = useAppSelector((state) => state.aiChat, shallowEqual);

  const isPersonaIdle = useMemo(
    () => personaStatus === DataStatus.IDLE,
    [personaStatus],
  );
  const isPersonaFetching = useMemo(
    () => personaStatus === DataStatus.LOADING,
    [personaStatus],
  );

  const isToneIdle = useMemo(
    () => toneStatus === DataStatus.IDLE,
    [toneStatus],
  );
  const isToneFetching = useMemo(
    () => toneStatus === DataStatus.LOADING,
    [toneStatus],
  );

  const onGetPersona = useCallback(
    async (queries: GetPersonaQueries) => {
     await dispatch(getPersona(queries));
    },
    [dispatch],
  );

  const onGetTone = useCallback(
    async (queries: GetToneQueries) => {
      await dispatch(getTone(queries));
    },
    [dispatch],
  );

  const isIdleOpenAIChat = useMemo(
    () => openAIChatStatus === DataStatus.IDLE,
    [openAIChatStatus],
  );

  const isFetchingOpenAIChat = useMemo(
    () => openAIChatStatus === DataStatus.LOADING,
    [openAIChatStatus],
  );

  const onGetOpenAIChat = useCallback(
    (queries: GetOpenAIChatQueries) => {
      dispatch(getOpenAIChat(queries));
    },
    [dispatch],
  );

  const onChatWithAI = useCallback(
    (data: ChatWithAIData) => {
      dispatch(
        addChatWithAI({
          ...data,
          assistant_content: "",
        }),
      );
      dispatch(chatWithAI(data));
    },
    [dispatch],
  );

  return {
    persona,
    onGetPersona,
    personaStatus,
    personaError,
    isPersonaIdle,
    isPersonaFetching,
    personaFilters,

    tone,
    onGetTone,
    toneStatus,
    toneError,
    isToneIdle,
    isToneFetching,
    toneFilters,

    openAIChat,
    openAIChatStatus,
    openAIChatError,
    openAIChatFilters,
    isIdleOpenAIChat,
    isFetchingOpenAIChat,
    onGetOpenAIChat,
    onChatWithAI,
  };
};
