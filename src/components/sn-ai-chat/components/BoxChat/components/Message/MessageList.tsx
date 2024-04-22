import { Box } from "@mui/material";
import { Message } from "./Message";

interface ChatData {
  id: string;
  persona: string;
  tone: string;
  system_prompt: string;
  user_prompt: string;
  assistant_content: string;
  model: string;
  usage: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
  };
  created_at: string;
  chat_session: string;
}

interface MessageListProps {
  chatData: ChatData[];
}

export const MessageList: React.FC<MessageListProps> = ({ chatData }) => {
  return (
    <Box height={"100%"} padding={"0 24px"}>
      {chatData.map((message, index) => {
        const hasNextMessageFromSameUser =
          index < chatData.length - 1 &&
          chatData[index + 1].persona === message.persona;

        return (
          <Message
            key={message.id}
            message={message}
            hasNextMessageFromSameUser={hasNextMessageFromSameUser}
          />
        );
      })}
    </Box>
  );
};
