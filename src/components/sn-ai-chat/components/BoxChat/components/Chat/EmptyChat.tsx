import { Box } from "@mui/material";
import { Text } from "components/shared";
import Image from "next/image";
import GIFAIChat from "public/images/gif-ai-chat.gif";
import { ListPrompt } from "../ListPrompt";
import { ExamplePrompt } from "store/aiChat/type";

interface RenderEmptyChatProps {
  t: any;
  mobileMode?: boolean;
  prompts: ExamplePrompt[];
  handleClick: (value: string) => void;
}

export const RenderEmptyChat: React.FC<RenderEmptyChatProps> = ({
  t,
  prompts,
  handleClick,
  mobileMode,
}) => (
  <Box
    display={"flex"}
    alignItems={"center"}
    justifyContent={"center"}
    padding={mobileMode ? "8px" : "40px"}
    flexDirection={"column"}
  >
    <Image src={GIFAIChat} alt="AI Chat" width={80} height={80} />
    <Text variant={mobileMode ? "h5" : "h3"} marginTop={mobileMode ? 1 : 3}>
      {t("boxChat.title")}
    </Text>
    {mobileMode && (
      <Text marginTop={1} fontSize={"12px"} color={"grey.300"}>
        {t("boxChat.description")}
      </Text>
    )}
    <ListPrompt
      prompts={prompts}
      handleClick={handleClick}
      isMobile={mobileMode}
    />
  </Box>
);
