import { Box, IconButton, SelectChangeEvent } from "@mui/material";
import { NS_AI_CHAT } from "constant/index";
import { HEADER_HEIGHT } from "layouts/Header";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useChatSession,
  useChatWithAI,
  useExamplePrompt,
} from "store/aiChat/selectors";
import { ChatWithAIData, OpenAIChat } from "store/aiChat/type";
import ChatInput from "./components/Chat/ChatInput";
import { RenderEmptyChat } from "./components/Chat/EmptyChat";
import { MessageLayout, MessageList } from "./components/Message";
import { SelectAIChat } from "./components/Select";
import { AxiosError } from "axios";
import { useMediaQuery } from "@mui/material";
import BackTabIcon from "icons/BackTabIcon";

interface BoxChatProps {
  popupMode?: boolean;
  onBackToSidebar?: () => void;
}

export const BoxChat: React.FC<BoxChatProps> = ({
  popupMode,
  onBackToSidebar,
}) => {
  const t = useTranslations(NS_AI_CHAT);

  const {
    persona: personaList,
    onGetPersona,
    isPersonaIdle,
    isPersonaFetching,
    personaFilters,

    tone: toneList,
    onGetTone,
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
    isFetchingChatAI,
    isIdleChatAI
  } = useChatWithAI();

  const {
    examplePrompts,
    isExamplePromptIdle,
    isExamplePromptFetching,
    onGetExamplePrompt,
  } = useExamplePrompt();

  const {
    chatSession,
    onCreateChatSession,
    newChatSessionCreated,
    onSelectChatId,
  } = useChatSession();

  const locale = useLocale();

  const [persona, setPersona] = useState("");
  const [tone, setTone] = useState("");
  const [prompt, setPrompt] = useState("");
  const [chatData, setChatData] = useState<OpenAIChat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showPersonaError, setShowPersonaError] = useState(false);
  const [showToneError, setShowToneError] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const chatInputRef = useRef<HTMLInputElement | null>(null);

  const isMobile = useMediaQuery("(max-width:600px)") || popupMode;

  const boxChatContainerSx = {
    position: "relative",
    width: "100%",
    height: useMediaQuery("(max-width:600px)")
      ? `calc(100vh - ${HEADER_HEIGHT}px)`
      : popupMode
      ? "89.8%"
      : `calc(100vh - ${HEADER_HEIGHT}px)`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: isMobile ? "0" : "24px 0",
    boxSizing: "border-box",
  };

  const selectContainerSx = {
    display: "flex",
    justifyContent: isMobile ? "center" : "space-around",
    marginBottom: "8px",
    gap: "8px",
  };

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleSubmitMessage = async (message: string) => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    if (!persona) {
      setPersona(personaList[0].id);
    }

    if (!tone) {
      setTone(toneList[0].id);
    }

    const data: ChatWithAIData = {
      user_prompt: message,
      persona,
      tone,
      chat_session: "",
      lang: locale,
      files,
    };

    if (chatSession) {
      try {
        data.chat_session = chatSession;
        onChatWithAI(data);
        setFiles([]);
      } catch (error) {
        if (error instanceof Error) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 400) {
            setError("You didn't upload any files!");
          } else {
            console.error(error);
          }
        }
      }
    } else {
      onCreateChatSession({ chatname: message });
      setPrompt(message);
    }
  };

  const handleToneChange = (e: SelectChangeEvent<string>) => {
    setTone(e.target.value as string);
    setError(null);
  };

  const handlePersonaChange = (e: SelectChangeEvent<string>) => {
    setPersona(e.target.value as string);
    setError(null);
  };

  const onLoadMoreOpenAIChat = useCallback(() => {
    if (openAIChatFilters?.page && openAIChatFilters.page > 0) {
      onGetOpenAIChat({
        id: chatSession,
        page: openAIChatFilters.page,
      });
    }
  }, [openAIChatFilters]);

  const personaOptions = useMemo(
    () =>
      Array.isArray(personaList)
        ? personaList.map((item) => {
            return {
              label: item.name[locale],
              value: item.id,
              icon: item.icon,
            };
          })
        : [],
    [personaList, locale],
  );

  const toneOptions = useMemo(
    () =>
      Array.isArray(toneList)
        ? toneList.map((item) => {
            return {
              label: item.name[locale],
              value: item.id,
              icon: item.icon,
            };
          })
        : [],
    [toneList, locale],
  );

  const handleSelectPrompt = (prompt: string) => {
    setPrompt(prompt);
    chatInputRef.current?.focus();
  }

  useEffect(() => {
    if (!isFetchingChatAI && !isIdleChatAI) {
      setIsSubmitting(false)
      setTimeout(() => {
        chatInputRef.current?.focus();
      }, 0);
    }
  }, [isFetchingChatAI, isIdleChatAI]);

  useEffect(() => {
    const sendChat = async () => {
      try {
        if (
          newChatSessionCreated &&
          prompt &&
          persona &&
          tone &&
          prompt.length > 0
        ) {
          onChatWithAI({
            user_prompt: prompt,
            persona,
            tone,
            chat_session: newChatSessionCreated,
            lang: locale,
            files,
          });
          setPrompt("");
          setFiles([]);
          if (isMobile) {
            onSelectChatId(newChatSessionCreated);
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 400) {
            setError("You didn't upload any files!");
          } else {
            console.error(error);
          }
        }
      }
    };

    sendChat();
  }, [newChatSessionCreated]);

  useEffect(() => {
    setShowPersonaError(false);
  }, [persona]);

  useEffect(() => {
    setShowToneError(false);
  }, [tone]);

  useEffect(() => {
    if (isExamplePromptIdle || isExamplePromptFetching) {
      onGetExamplePrompt({ number_prompt: 6 });
    }

    if (isPersonaIdle || isPersonaFetching) {
      onGetPersona({});
    }

    if (isToneIdle || isToneFetching) {
      onGetTone({});
    }
  }, []);

  useEffect(() => {
    if (chatSession) {
      onGetOpenAIChat({ id: chatSession });
    } else {
      setChatData([]);
      setPersona("");
      setTone("");
      setFiles([]);
    }
  }, [chatSession]);

  useEffect(() => {
    if (!isIdleOpenAIChat || !isFetchingOpenAIChat) {
      if (openAIChat && openAIChat.length > 0) {
        setChatData(openAIChat);
        setPersona(openAIChat[0].persona);
        setTone(openAIChat[0].tone);
      }
    }
  }, [openAIChat, isIdleOpenAIChat, isFetchingOpenAIChat]);

  return (
    <Box sx={boxChatContainerSx}>
      {useMediaQuery("(max-width:600px)") && (
        <IconButton
          onClick={onBackToSidebar}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            margin: "10px",
          }}
        >
          <BackTabIcon />
        </IconButton>
      )}
      {chatData.length > 0 ? (
        <MessageLayout>
          <MessageList
            mobileMode={isMobile}
            regenerateResponse={handleSubmitMessage}
            onLoadMore={onLoadMoreOpenAIChat}
            chatData={chatData}
            page={openAIChatFilters?.page}
          />
        </MessageLayout>
      ) : (
        <RenderEmptyChat
          t={t}
          mobileMode={popupMode || isMobile}
          prompts={examplePrompts}
          handleClick={handleSelectPrompt}
        />
      )}
      <Box padding={isMobile ? "0 4px" : "0 24px"}>
        {/* {error && <div style={{ color: "red" }}>{error}</div>} */}
        <Box sx={selectContainerSx}>
          <SelectAIChat
            key={"persona"}
            placeholder={t("boxChat.persona")}
            options={personaOptions}
            selectedValue={persona}
            onOptionChange={handlePersonaChange}
            isError={showPersonaError}
          />
          <SelectAIChat
            key={"tone"}
            placeholder={t("boxChat.tone")}
            options={toneOptions}
            selectedValue={tone}
            onOptionChange={handleToneChange}
            isError={showToneError}
          />
        </Box>
        <ChatInput
          ref={chatInputRef}
          isLoading={isSubmitting}
          initialMessage={prompt}
          files={files}
          onMessageSubmit={handleSubmitMessage}
          onFileChange={handleFileChange}
          wrapperInputStyles={{}}
          isMobile={isMobile}
        />
      </Box>
    </Box>
  );
};
