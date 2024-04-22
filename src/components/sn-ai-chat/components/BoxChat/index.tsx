import { Box } from "@mui/material";
import { Text } from "components/shared";
import { NS_AI_CHAT } from "constant/index";
import { HEADER_HEIGHT } from "layouts/Header";
import { useTranslations } from "next-intl";
import Image from "next/image";
import GIFAIChat from "public/images/gif-ai-chat.gif";
import { useEffect, useState } from "react";
import { useAIChat } from "store/aiChat/selectors";
import ChatInput from "./components/Chat/ChatInput";
import { ListPrompt } from "./components/ListPrompt";
import { MessageLayout, MessageList } from "./components/Message";
import { SelectAIChat } from "./components/Select";

const options = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];

export const BoxChat = () => {
  const t = useTranslations(NS_AI_CHAT);

  const [persona, setPersona] = useState("");
  const [tone, setTone] = useState("");
  const [prompt, setPrompt] = useState("");
  const [chatData, setChatData] = useState([]);

  const {
    examplePrompts,
    status,
    error,
    isIdle,
    isFetching,
    onGetExamplePrompt,
  } = useAIChat();

  useEffect(() => {
    if (isIdle || isFetching) {
      onGetExamplePrompt({ number_prompt: 6 });
    }
  }, [isIdle, isFetching, onGetExamplePrompt]);

  const handleSetPrompt = (value: string) => {
    setPrompt(value);
  };

  console.log("examplePrompts: ", examplePrompts);

  return (
    <Box sx={boxChatContainerSx}>
      {(chatData.length > 0 && (
        <MessageLayout>
          <MessageList chatData={chatData} />
        </MessageLayout>
      )) || (
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
            <ListPrompt
              prompts={examplePrompts}
              handleClick={handleSetPrompt}
            />
          )}
        </Box>
      )}
      <Box padding={"0 24px"}>
        <Box sx={selectContainerSx}>
          <SelectAIChat
            placeholder={t("boxChat.persona")}
            options={options}
            value={persona}
            handleOnChange={(e) => setPersona(e.target.value)}
          />
          <SelectAIChat
            placeholder={t("boxChat.tone")}
            options={options}
            value={tone}
            handleOnChange={(e) => setTone(e.target.value)}
          />
        </Box>
        <ChatInput
          isLoading={false}
          initialMessage=""
          files={[]}
          onEnterMessage={(message: string) => console.log(message)}
          onChangeFiles={(file: File[]) => console.log(file)}
          onResize={(num?: number) => console.log(num)}
          wrapperInputSx={{}}
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
