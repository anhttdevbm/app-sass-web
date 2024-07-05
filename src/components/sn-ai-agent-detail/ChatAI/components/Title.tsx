import { Stack } from "@mui/material";
import { Text } from "components/shared";
import { NS_AI_AGENT } from "constant/index";
import { useTranslations } from "next-intl";
import Image from "next/image";
import GIFAIChat from "public/images/gif-ai-chat.gif";

export const Title = () => {
  const t = useTranslations(NS_AI_AGENT);

  return (
    <Stack
      spacing={"12px"}
      alignItems={"center"}
      justifyContent={"center"}
      width={"296px"}
    >
      <Image src={GIFAIChat} alt="AI Chat" width={80} height={80} />
      <Text variant={"h3"}>{t("chatAIAgent.chatWithAI")}</Text>
      <Text fontSize={"12px"} color={"grey.300"} fontWeight={400}>
        {t("chatAIAgent.description")}
      </Text>
    </Stack>
  );
};
