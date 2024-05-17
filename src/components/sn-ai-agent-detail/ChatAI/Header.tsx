import { Stack } from "@mui/material";
import ImgPlaceholderAgent from "public/images/img-placeholder-agent.svg";
import Avatar from "components/Avatar";
import { Button, Text } from "components/shared";
import { NS_AI_AGENT } from "constant/index";
import { useTranslations } from "next-intl";
import PencilUnderlineFillIcon from "icons/PencilUnderlineFillIcon";

interface HeaderProps {
  title: string;
  avatar?: string;
}

export const Header = ({ title, avatar }: HeaderProps) => {
  const t = useTranslations(NS_AI_AGENT);

  const handleSendMsg = () => {
    console.log("Send Message");
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      padding={"20px 24px"}
      justifyContent={"space-between"}
      border={"1px solid"}
      borderColor={"grey.100"}
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
      >
        {t("chatAIAgent.editAgent")}
      </Button>
    </Stack>
  );
};
