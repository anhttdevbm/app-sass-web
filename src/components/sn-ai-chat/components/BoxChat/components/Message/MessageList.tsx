import { Box, Button } from "@mui/material";
import { OpenAIChat } from "store/aiChat/type";
import { Message } from "./Message";

interface MessageListProps {
  chatData: Partial<OpenAIChat>[];
  onLoadMore: () => void;
  page?: number;
}

export const MessageList: React.FC<MessageListProps> = ({
  chatData,
  onLoadMore,
  page,
}) => {
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
      {chatData.map((message) => {
        return <Message key={message.id} {...message} />;
      })}
      {page && (
        <Button onClick={onLoadMore}>
          Load More
        </Button>
      )}
    </Box>
  );
};
