import { Button } from "@mui/material";
import { NS_AI_AGENT } from "constant/index";
import PlusFillIcon from "icons/PlusFillIcon";
import { useTranslations } from "next-intl";

interface AddCommandButtonProps {
  width?: string;
}

export const AddCommandButton = ({ width }: AddCommandButtonProps) => {
  const t = useTranslations(NS_AI_AGENT);

  const handleAddCommand = () => {
    console.log("Add Command");
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
