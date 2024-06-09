import { Stack } from "@mui/material";
import ImgPlaceholderAgent from "public/images/img-placeholder-agent.svg";
import Avatar from "components/Avatar";
import { Button, Text } from "components/shared";
import { NS_AI_AGENT } from "constant/index";
import { useTranslations } from "next-intl";
import PencilUnderlineFillIcon from "icons/PencilUnderlineFillIcon";
import { useRouter } from "next/navigation";
import { getPath } from "utils/index";
import { AI_AGENT_GENERAL_PATH } from "constant/paths";

export const HEADER_HEIGHT_AGENT_CHAT = 72;

interface HeaderProps {
  id: string;
  title: string;
  avatar?: string;
}

export const Header = ({ id, title, avatar }: HeaderProps) => {
  const t = useTranslations(NS_AI_AGENT);
  const route = useRouter();

  const handleSendMsg = () => {
    console.log("Send Message");
  };

  const handleEditAgent = () => {
    const generalPath = getPath(AI_AGENT_GENERAL_PATH, undefined, { id });
    route.push(generalPath);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      padding={"20px 24px"}
      justifyContent={"space-between"}
      border={"1px solid"}
      borderColor={"grey.100"}
      height={`${HEADER_HEIGHT_AGENT_CHAT}px`}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Avatar src={avatar || ImgPlaceholderAgent} size={24} />
        <Text variant="h5">{title}</Text>
      </Stack>
      <Button
        variant="contained"
        color="primary"
        size="small"
        startIcon={<PencilUnderlineFillIcon />}
        onClick={handleEditAgent}
      >
        {t("chatAIAgent.editAgent")}
      </Button>
    </Stack>
  );
};
