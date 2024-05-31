import { Box, Button } from "@mui/material";
import { OpenAIChat } from "store/aiChat/type";
import { Message } from "./Message";
import { useTranslations } from "next-intl";
import { NS_AI_CHAT } from "constant/index";
import { useEffect, useRef } from "react";

interface MessageListProps {
  chatData: Partial<OpenAIChat>[];
  onLoadMore: () => void;
  page?: number;
  regenerateResponse: (message: string) => void;
  mobileMode?: boolean;
  isSubmitting?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  chatData,
  onLoadMore,
  page,
  regenerateResponse,
  mobileMode,
  isSubmitting,
}) => {
  const t = useTranslations(NS_AI_CHAT);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log("scrolling to end")
    if (endOfMessagesRef.current) {
      setTimeout(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        window.scrollBy(0, 10);
      }, 50);
    }
  }, [isSubmitting]);

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
      <div ref={endOfMessagesRef} />
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
