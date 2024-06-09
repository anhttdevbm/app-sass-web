import { Button } from "@mui/material";
import { NS_AI_AGENT } from "constant/index";
import PlusFillIcon from "icons/PlusFillIcon";
import { useTranslations } from "next-intl";
import { useAIAgent } from "store/aiAgent/selectors";
import { AI_AGENT_COMMANDS_PATH } from "constant/paths";
import { getPath } from "utils/index";
import { useRouter } from "next/navigation";

interface AddCommandButtonProps {
  width?: string;
}

export const AddCommandButton = ({ width }: AddCommandButtonProps) => {
  const t = useTranslations(NS_AI_AGENT);

  const {aiAgent} = useAIAgent();

  const router = useRouter();

  const handleAddCommand = () => {
    const path = getPath(AI_AGENT_COMMANDS_PATH, undefined, {id: aiAgent?.id as string});
    router.push(path);
  };

  return (
    <Button
      variant="contained"
      size="large"
      fullWidth
      onClick={handleAddCommand}
      sx={{
        border: "1px dashed",
        borderColor: "primary.main",
        backgroundColor: "#EEF8FF",
        color: "primary.main",
        boxShadow: "none",
        textTransform: "none",
        fontSize: "13px",
        fontWeight: 600,
        "&:hover": {
          backgroundColor: "#E1F0FF",
          boxShadow: "none",
        },
        width: width,
        padding: "16px",
      }}
      startIcon={<PlusFillIcon />}
    >
      {t("chatAIAgent.addCommand")}
    </Button>
  );
};
