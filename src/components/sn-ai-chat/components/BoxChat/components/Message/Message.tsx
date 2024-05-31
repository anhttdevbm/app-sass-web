import { Avatar, Box, Skeleton, Stack, useMediaQuery } from "@mui/material";
import { IconButton, Text } from "components/shared";
import { AddDocModal } from "components/sn-ai-chat/components/Docs/AddDocModel";
import useTheme from "hooks/useTheme";
import { AddToDocIcon } from "icons/AddToDocIcon";
import { CopyTextIcon } from "icons/CopyTextIcon";
import EditMessageAIChatIcon from "icons/EditMessageAIChatIcon";
import { RegenerateIcon } from "icons/RegenerateIcon";
import { useLocale } from "next-intl";
import Image from "next/image";
import AIIcon from "public/images/ic-ai-chat.svg";
import { useEffect, useState } from "react";
import { useChatWithAI } from "store/aiChat/selectors";
import { OpenAIChat } from "store/aiChat/type";
import { useAuth } from "store/app/selectors";
import { ActionButton } from "./ActionButton";
import { MessageBox } from "./MessageBox";
import { FileItem } from "components/sn-ai-chat/components/BoxChat/components/Message/FileItem";
import parse, { domToReact, HTMLReactParserOptions } from 'html-react-parser';

interface MessageProps {
  message: Partial<OpenAIChat>;
  regenerateResponse: (message: string) => void;
  mobileMode?: boolean;
}

export const Message: React.FC<MessageProps> = ({
  message,
  regenerateResponse,
  mobileMode,
}) => {
  const { user_prompt, assistant_content, id } = message;

  const locale = useLocale();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState<string | undefined>(
    user_prompt,
  );
  const { onChatWithAI } = useChatWithAI();

  const isMobile = useMediaQuery("(max-width: 600px)") || mobileMode;

  useEffect(() => {
    if (assistant_content) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [assistant_content]);

  if (!user_prompt) {
    return null;
  }

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleCopy = async () => {
    const textToCopy = assistant_content as string;

    const parser = new DOMParser();
    const doc = parser.parseFromString(textToCopy, 'text/html');
    const plainText = doc.body.textContent || '';

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(plainText);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = plainText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  };

  const handleRegenerateResponse = () => {
    regenerateResponse(user_prompt);
  };

  const handleEdit = () => {
    setEditedMessage(user_prompt)
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setIsEditing(false);
      if (editedMessage !== user_prompt) {
        onChatWithAI({
          user_prompt: editedMessage as string,
          lang: locale,
          tone: message.tone as string,
          persona: message.persona as string,
          chat_session: message.chat_session,
          ...(message.files && { files: message.files })
        });
      }
      setEditedMessage("");
    }
  };

  const handleChange = (event) => {
    setEditedMessage(event.target.value);
  };

  const optionsRenderHtml: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode.type === 'tag' && domNode.name === 'code') {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return (
          <div style={{ width: '100%', overflowX: "auto" }}>
            <code>
              {domToReact(domNode.children as any, optionsRenderHtml)}
            </code>
          </div>
        );
      }
    }
  };

  return (
    <Box key={id}>
      <Box
        display="flex"
        alignItems="flex-start"
        justifyContent="space-around"
        flexDirection={isMobile ? "column" : "row"}
        width={"100%"}
        mb={"12px"}
      >
        <Avatar
          alt={user?.name || "User"}
          src={user?.avatar?.link}
          variant="rounded"
          sx={{ borderRadius: "10px", marginBottom: isMobile ? "8px" : "0px" }}
        />
        <MessageBox
          bgcolor={isDarkMode ? "info.main" : "#EBF5FF"}
          isMobile={isMobile}
          width={"100%"}
        >
          {isEditing ? (
            <input
              value={editedMessage}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              onChange={handleChange}
              autoFocus
              style={{
                width: "100%",
                alignSelf: "flex-start",
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "16px",
                padding: "5px",
              }}
            />
          ) : (
            <>
              <Stack direction={"column"} spacing={1} flex={1}>
                {message.files && message.files.map((file, index) => (
                  <FileItem file={file} key={index} />
                ))}
                <Text variant="body1" flex={1}>
                  {user_prompt}
                </Text>
              </Stack>
              <IconButton
                size="small"
                sx={{ borderRadius: "50%" }}
                onClick={handleEdit}
              >
                <EditMessageAIChatIcon width={18} height={18} />
              </IconButton>
            </>
          )}
        </MessageBox>
      </Box>
      <Box
        display={"flex"}
        alignItems={"flex-start"}
        mb={"12px"}
        flexDirection={"column"}
      >
        <Box
          display="flex"
          width={"100%"}
          flexDirection={isMobile ? "column" : "row"}
        >
          <Box sx={{ ...avatarSx, marginBottom: isMobile ? "8px" : "0px" }}>
            <Image alt="AI assistant" src={AIIcon} width={28} height={28} />
          </Box>
          <MessageBox
            bgcolor={isDarkMode ? "info.dark" : "#f5f5f5"}
            isMobile={isMobile}
          >
            {!isLoading ? (
              <Stack width={"100%"} sx={{wordBreak: "break-word"}}>
                  {parse(assistant_content as string, optionsRenderHtml)}
              </Stack>
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
          flexDirection={isMobile ? "column" : "row"}
          alignItems={isMobile ? "flex-end" : "center"}
          justifyContent={"flex-end"}
          width={"100%"}
        >
          {isMobile && (
            <Box
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"flex-end"}
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
            </Box>
          )}
          {!isMobile && (
            <>
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
            </>
          )}
          {isMobile && <Box height={2} />}
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
  width: "40px",
  height: "40px",
  backgroundImage: "linear-gradient(89.64deg, #0575E6 5.8%, #38E27B 96.38%)",
};
