import { Box } from "@mui/material";
import { Text } from "components/shared";
import { NS_AI_CHAT } from "constant/index";
import { useTranslations } from "next-intl";
import Image from "next/image";
import GIFAIChat from "public/images/gif-ai-chat.gif";
import { useState } from "react";
import ChatInput from "./components/Chat/ChatInput";
import { ListPrompt } from "./components/ListPrompt";
import { SelectAIChat } from "./components/Select";

const options = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];

const BoxChat = () => {
  const t = useTranslations(NS_AI_CHAT);

  const [persona, setPersona] = useState("");
  const [tone, setTone] = useState("");
  const [prompt, setPrompt] = useState("");

  const handleButtonClick = (value: string) => {
    setPrompt(value);
  };

  return (
    <Box sx={boxChatContainerSx}>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        padding={"40px"}
        flexDirection={"column"}
      >
        <Image src={GIFAIChat} alt="AI Chat" width={80} height={80} />
        <Text variant={"h3"} marginTop={3}>
          {t("layout.title")}
        </Text>
        <ListPrompt
          texts={["Button 1", "Button 2", "Button 3", "Button 4", "Button 5", "Button 6"]}
          handleClick={handleButtonClick}
        />
      </Box>
      <Box sx={selectContainerSx}>
        <SelectAIChat
          placeholder={t("layout.persona")}
          options={options}
          value={persona}
          handleOnChange={(e) => setPersona(e.target.value)}
        />
        <SelectAIChat
          placeholder={t("layout.tone")}
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
  );
};

export default BoxChat;

const boxChatContainerSx = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  padding: "24px",
  boxSizing: "border-box"
};

const selectContainerSx = {
  display: "flex",
  justifyContent: "space-around",
  marginBottom: "8px",
  gap: "8px",
};
