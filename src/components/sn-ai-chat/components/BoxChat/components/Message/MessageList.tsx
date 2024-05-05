import { Box, Button } from "@mui/material";
import { OpenAIChat } from "store/aiChat/type";
import { Message } from "./Message";
import { useTranslations } from "next-intl";
import { NS_AI_CHAT } from "constant/index";

interface MessageListProps {
  chatData: Partial<OpenAIChat>[];
  onLoadMore: () => void;
  page?: number;
  regenerateResponse: (message: string) => void;
  mobileMode?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  chatData,
  onLoadMore,
  page,
  regenerateResponse,
  mobileMode,
}) => {
  const t = useTranslations(NS_AI_CHAT);

  return (
    <Box
      key={"message-list"}
      height={"100%"}
      padding={"0 24px"}
      display="flex"
      overflow="auto"
      flexDirection="column-reverse"
      width="100%"
    >
      {chatData.map((message, index) => {
        return (
          <Message
            mobileMode={mobileMode}
            key={index}
            message={message}
            regenerateResponse={regenerateResponse}
          />
        );
      })}
      {page && <Button onClick={onLoadMore}>{t("boxChat.loadMore")}</Button>}
    </Box>
  );
};
