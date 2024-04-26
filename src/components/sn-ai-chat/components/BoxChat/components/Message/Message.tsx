import { Avatar, Box, Skeleton } from "@mui/material";
import { IconButton, Text } from "components/shared";
import { AddDocModal } from "components/sn-ai-chat/components/Docs/AddDocModel";
import useTheme from "hooks/useTheme";
import { AddToDocIcon } from "icons/AddToDocIcon";
import { CopyTextIcon } from "icons/CopyTextIcon";
import EditMessageAIChatIcon from "icons/EditMessageAIChatIcon";
import { RegenerateIcon } from "icons/RegenerateIcon";
import Image from "next/image";
import AIIcon from "public/images/ic-ai-chat.svg";
import { useEffect, useState } from "react";
import { OpenAIChat } from "store/aiChat/type";
import { useAuth } from "store/app/selectors";
import { ActionButton } from "./ActionButton";
import { MessageBox } from "./MessageBox";

export const Message = (messageProps: Partial<OpenAIChat>) => {
  const { user_prompt, assistant_content, id } = messageProps;

  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (assistant_content) {
      setIsLoading(false);
    }
  }, [assistant_content]);

  if (!user_prompt) {
    return null;
  }

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleCopy = () => console.log("handle copy");
  const handleRegenerateResponse = () =>
    console.log("handle regenerate response");

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
        <MessageBox bgcolor={isDarkMode ? "info.main" : "#EBF5FF"}>
          <Text variant="body1" flex={1}>
            {user_prompt}
          </Text>
          <IconButton size="small" sx={{ borderRadius: "50%" }}>
            <EditMessageAIChatIcon width={18} height={18} />
          </IconButton>
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
            {!isLoading ? (
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
          <ActionButton
            onClick={handleCopy}
            icon={<CopyTextIcon />}
            label="boxChat.copy"
          />
          <ActionButton
            onClick={handleOpenModal}
            icon={<AddToDocIcon />}
            label="boxChat.addToDocs"
          />
          <ActionButton
            onClick={handleRegenerateResponse}
            icon={<RegenerateIcon />}
            label="boxChat.regenerateResponse"
          />
        </Box>
      </Box>
      <AddDocModal
        open={isModalOpen}
        onClose={handleCloseModal}
        assistantContent={assistant_content as string}
      />
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
