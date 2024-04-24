import { NewButton } from "components/shared";
import { NS_AI_CHAT } from "constant/index";
import { useTranslations } from "next-intl";

export const ActionButton = ({ icon, label }) => {
  const t = useTranslations(NS_AI_CHAT);
  return (
    <NewButton startIcon={icon} sx={ButtonSx}>
      {t(label)}
    </NewButton>
  );
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
