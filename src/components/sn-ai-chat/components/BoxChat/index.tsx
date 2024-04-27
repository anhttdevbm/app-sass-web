import { Box } from "@mui/material";
import { NS_AI_CHAT } from "constant/index";
import { HEADER_HEIGHT } from "layouts/Header";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
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

export const BoxChat = () => {
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
  } = useChatWithAI();

  const {
    examplePrompts,
    isExamplePromptIdle,
    isExamplePromptFetching,
    onGetExamplePrompt,
  } = useExamplePrompt();

  const { chatSession, onCreateChatSession, newChatSessionCreated } = useChatSession();

  const locale = useLocale();

  const [persona, setPersona] = useState("");
  const [tone, setTone] = useState("");
  const [prompt, setPrompt] = useState("");
  const [chatData, setChatData] = useState<OpenAIChat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showPersonaError, setShowPersonaError] = useState(false);
  const [showToneError, setShowToneError] = useState(false);

  const handleSubmitMessage = async (message: string) => {
    if (!persona || !tone) {
      setError("Persona and tone are required!");
      if (!persona) setShowPersonaError(true);
      if (!tone) setShowToneError(true);
      return;
    }

    const data: ChatWithAIData = {
      user_prompt: message,
      persona,
      tone,
      chat_session: "",
      lang: locale,
    };

    if (chatSession) {
      try {
        data.chat_session = chatSession;
        onChatWithAI(data);
      } catch (error) {
        console.error(error);
      }
    } else {
      onCreateChatSession({ chatname: message });
      setPrompt(message);
    }
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
            return { label: item.name[locale], value: item.id };
          })
        : [],
    [personaList, locale],
  );

  const toneOptions = useMemo(
    () =>
      Array.isArray(toneList)
        ? toneList.map((item) => {
            return { label: item.name[locale], value: item.id };
          })
        : [],
    [toneList, locale],
  );

  useEffect(() => {
    if (newChatSessionCreated && prompt && persona && tone && prompt.length > 0) {
      onChatWithAI({
        user_prompt: prompt,
        persona,
        tone,
        chat_session: newChatSessionCreated,
        lang: locale,
      });
      setPrompt("");
    }
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
     {chatData.length > 0 ? (
       <MessageLayout>
         <MessageList
           regenerateResponse={handleSubmitMessage}
           onLoadMore={onLoadMoreOpenAIChat}
           chatData={chatData}
           page={openAIChatFilters?.page}
         />
       </MessageLayout>
     ) : (
       <RenderEmptyChat
         t={t}
         prompts={examplePrompts}
         handleClick={setPrompt}
       />
     )}
     <Box padding={"0 24px"}>
       <Box sx={selectContainerSx}>
         <SelectAIChat
           key={"persona"}
           placeholder={t("boxChat.persona")}
           options={personaOptions}
           selectedValue={persona}
           onOptionChange={(e) => setPersona(e.target.value)}
           isError={showPersonaError}
         />
         <SelectAIChat
           key={"tone"}
           placeholder={t("boxChat.tone")}
           options={toneOptions}
           selectedValue={tone}
           onOptionChange={(e) => setTone(e.target.value)}
           isError={showToneError}
         />
       </Box>
       <ChatInput
         isLoading={false}
         initialMessage={prompt}
         files={[]}
         onMessageSubmit={handleSubmitMessage}
         onFileChange={(file: File[]) => console.log(file)}
         onResizeEvent={(num?: number) => console.log(num)}
         wrapperInputStyles={{}}
       />
     </Box>
   </Box>
 );
};

const boxChatContainerSx = {
  width: "100%",
  height: `calc(100vh - ${HEADER_HEIGHT}px)`,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  padding: "24px 0",
  boxSizing: "border-box",
  overflow: "hidden",
};

const selectContainerSx = {
  display: "flex",
  justifyContent: "space-around",
  marginBottom: "8px",
  gap: "8px",
};
