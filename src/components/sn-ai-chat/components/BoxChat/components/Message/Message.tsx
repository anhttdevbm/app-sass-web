import { Avatar, Box } from "@mui/material";
import { NewButton, Text } from "components/shared";
import { NS_AI_CHAT } from "constant/index";
import { AddToDocIcon } from "icons/AddToDocIcon";
import { CopyTextIcon } from "icons/CopyTextIcon";
import { RegenerateIcon } from "icons/RegenerateIcon";
import { useTranslations } from "next-intl";
import Image from "next/image";
import AIIcon from "public/images/ic-ai-chat.svg";
import { useAuth } from "store/app/selectors";

interface MessageProps {
  message: {
    id: string;
    persona: string;
    user_prompt: string;
    assistant_content: string;
  };
  hasNextMessageFromSameUser: boolean;
}

export const Message = (messageProps: MessageProps) => {
  const { user } = useAuth();
  const t = useTranslations(NS_AI_CHAT);
  const { message, hasNextMessageFromSameUser } = messageProps;

  return (
    <Box key={message.id}>
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
        <Box
          bgcolor={"#e1f5fe"}
          borderRadius={"20px"}
          p={2}
          marginLeft={"12px"}
          flex={1}
          display={"flex"}
          justifyContent={"space-around"}
          alignContent={"center"}
        >
          <Text variant="body1" flex={1}>
            {message.user_prompt}
          </Text>
        </Box>
      </Box>
      <Box
        display={"flex"}
        alignItems={"flex-start"}
        mb={"12px"}
        flexDirection={"column"}
      >
        <Box display="flex">
          <Box sx={avatarSx}>
            <Image alt="AI assistant" src={AIIcon} width={28} height={28} />
          </Box>
          <Box
            bgcolor={
              message.persona === "career_counselor" ? "#f5f5f5" : "#e1f5fe"
            }
            borderRadius={"20px"}
            p={2}
            marginLeft={"12px"}
          >
            <Text variant="body1">{message.assistant_content}</Text>
          </Box>
        </Box>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"flex-end"}
          width={"100%"}
        >
          <NewButton startIcon={<CopyTextIcon />} sx={ButtonSx}>
            {t("boxChat.copy")}
          </NewButton>
          <NewButton startIcon={<AddToDocIcon />} sx={ButtonSx}>
            {t("boxChat.addToDocs")}
          </NewButton>
          <NewButton startIcon={<RegenerateIcon />} sx={ButtonSx}>
            {t("boxChat.regenerateResponse")}
          </NewButton>
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

const ButtonSx = {
  "&.MuiButton-root": {
    justifyContent: "flex-start",
    fontSize: "12px",
    fontWeight: "400",
    color: "primary.main",
    borderBottomWidth: "0px",
    padding: "4px 12px",
  },
};
