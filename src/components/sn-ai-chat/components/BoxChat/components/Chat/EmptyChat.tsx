import { Box } from "@mui/material";
import { Text } from "components/shared";
import Image from "next/image";
import GIFAIChat from "public/images/gif-ai-chat.gif";
import { ListPrompt } from "../ListPrompt";

export const RenderEmptyChat = ({ t, prompts, handleClick }) => (
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
    <ListPrompt prompts={prompts} handleClick={handleClick} />
  </Box>
);
