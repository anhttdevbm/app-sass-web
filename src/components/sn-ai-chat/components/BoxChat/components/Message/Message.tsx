import { Avatar, Box, Skeleton } from "@mui/material";
import { Text } from "components/shared";
import { AddToDocIcon } from "icons/AddToDocIcon";
import { CopyTextIcon } from "icons/CopyTextIcon";
import { RegenerateIcon } from "icons/RegenerateIcon";
import Image from "next/image";
import AIIcon from "public/images/ic-ai-chat.svg";
import { OpenAIChat } from "store/aiChat/type";
import { useAuth } from "store/app/selectors";
import { ActionButton } from "./ActionButton";
import { MessageBox } from "./MessageBox";
import useTheme from "hooks/useTheme";

export const Message = (messageProps: Partial<OpenAIChat>) => {
  const { user } = useAuth();
  const { user_prompt, assistant_content, id } = messageProps;
  const { isDarkMode } = useTheme();

  return (
    <Box key={id}>
      <Box
        display="flex"
        alignItems="flex-start"
        justifyContent="space-around"
        mb={"12px"}
      >
        <Avatar
          alt={user?.name || "User"}
          src={user?.avatar?.link}
          variant="rounded"
          sx={{ borderRadius: "10px" }}
        />
        <MessageBox bgcolor={isDarkMode ? "info.main" : "#e1f5fe"}>
          <Text variant="body1" flex={1}>
            {user_prompt}
          </Text>
        </MessageBox>
      </Box>
      <Box
        display={"flex"}
        alignItems={"flex-start"}
        mb={"12px"}
        flexDirection={"column"}
      >
        <Box display="flex" width={"100%"}>
          <Box sx={avatarSx}>
            <Image alt="AI assistant" src={AIIcon} width={28} height={28} />
          </Box>
          <MessageBox bgcolor={isDarkMode ? "info.dark" : "#f5f5f5"} flex={1}>
            {assistant_content ? (
              <Text variant="body1" flex={1}>
                {assistant_content}
              </Text>
            ) : (
              <Box
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                width={"100%"}
              >
                <Skeleton variant="text" width={"100%"} height={"40px"} />
                <Skeleton variant="text" width={"100%"} height={"40px"} />
                <Skeleton variant="text" width={"100%"} height={"40px"} />
              </Box>
            )}
          </MessageBox>
        </Box>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"flex-end"}
          width={"100%"}
        >
          <ActionButton icon={<CopyTextIcon />} label="boxChat.copy" />
          <ActionButton icon={<AddToDocIcon />} label="boxChat.addToDocs" />
          <ActionButton
            icon={<RegenerateIcon />}
            label="boxChat.regenerateResponse"
          />
        </Box>
      </Box>
    </Box>
  );
};

const avatarSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "10px",
  minWidth: "40px",
  height: "40px",
  backgroundImage: "linear-gradient(89.64deg, #0575E6 5.8%, #38E27B 96.38%)",
};

