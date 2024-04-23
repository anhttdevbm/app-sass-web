import { Box } from "@mui/material";
import { Text } from "components/shared";
import { NS_AI_CHAT } from "constant/index";
import { HEADER_HEIGHT } from "layouts/Header";
import { useTranslations } from "next-intl";
import Image from "next/image";
import GIFAIChat from "public/images/gif-ai-chat.gif";
import { useEffect, useState } from "react";
import { useChatWithAI, useExamplePrompt } from "store/aiChat/selectors";
import ChatInput from "./components/Chat/ChatInput";
import { ListPrompt } from "./components/ListPrompt";
import { MessageLayout, MessageList } from "./components/Message";
import { SelectAIChat } from "./components/Select";

export const BoxChat = () => {
  const t = useTranslations(NS_AI_CHAT);

  const {
    persona: personaList,
    onGetPersona,
    tone: toneList,
    onGetTone,
    isToneIdle,
    isPersonaIdle,
    isToneFetching,
    isPersonaFetching,
    toneFilters,
    personaFilters,
  } = useChatWithAI();

  const [persona, setPersona] = useState("");
  const [tone, setTone] = useState("");
  const [prompt, setPrompt] = useState("");
  const [chatData, setChatData] = useState([]);

  const {
    examplePrompts,
    isExamplePromptIdle,
    isExamplePromptFetching,
    onGetExamplePrompt,
  } = useExamplePrompt();

  useEffect(() => {
    if (isExamplePromptIdle || isExamplePromptFetching) {
      onGetExamplePrompt({ number_prompt: 6 });
    }
  }, [isExamplePromptIdle, isExamplePromptFetching, onGetExamplePrompt]);

  useEffect(() => {
    if (isPersonaIdle || isPersonaFetching) {
      onGetPersona({});
    }

    if (isToneIdle || isToneFetching) {
      onGetTone({});
    }
  }, []);

  const onLoadMorePersona = () => {
    if (personaFilters.pageIndex && personaFilters.pageIndex > 0) {
      onGetPersona({ pageIndex: personaFilters.pageIndex + 1 });
    }
  };

  const onLoadMoreTone = () => {
    if (toneFilters.pageIndex && toneFilters.pageIndex > 0) {
      onGetTone({ pageIndex: toneFilters.pageIndex + 1 });
    }
  };

  const handleSetPrompt = (value: string) => {
    setPrompt(value);
  };

  const renderChatData = () => (
    <MessageLayout>
      <MessageList chatData={chatData} />
    </MessageLayout>
  );

  const renderEmptyChat = () => (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      padding={"40px"}
      flexDirection={"column"}
    >
      <Image src={GIFAIChat} alt="AI Chat" width={80} height={80} />
      <Text variant={"h3"} marginTop={3}>
        {t("boxChat.title")}
      </Text>
      {examplePrompts && (
        <ListPrompt prompts={examplePrompts} handleClick={handleSetPrompt} />
      )}
    </Box>
  );

  const toTitleCase = (str: string) => {
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const personaOptions = Array.isArray(personaList)
    ? personaList.map((item) => ({
        label: toTitleCase(item.name),
        value: item.id,
      }))
    : [];

  const toneOptions = Array.isArray(toneList)
    ? toneList.map((item) => ({
        label: item.name,
        value: item.name,
      }))
    : [];

  return (
    <Box sx={boxChatContainerSx}>
      {chatData.length > 0 ? renderChatData() : renderEmptyChat()}
      <Box padding={"0 24px"}>
        <Box sx={selectContainerSx}>
          <SelectAIChat
            placeholder={t("boxChat.persona")}
            options={personaOptions}
            selectedValue={persona}
            onOptionChange={(e) => setPersona(e.target.value)}
            onLoadMore={onLoadMorePersona}
          />
          <SelectAIChat
            placeholder={t("boxChat.tone")}
            options={toneOptions}
            selectedValue={tone}
            onOptionChange={(e) => setTone(e.target.value)}
            onLoadMore={onLoadMoreTone}
          />
        </Box>
        <ChatInput
          isLoading={false}
          initialMessage=""
          files={[]}
          onMessageSubmit={(message: string) => console.log(message)}
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
};

const selectContainerSx = {
  display: "flex",
  justifyContent: "space-around",
  marginBottom: "8px",
  gap: "8px",
};
