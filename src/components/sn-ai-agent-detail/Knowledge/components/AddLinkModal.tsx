import { Dialog } from "components/sn-ai-agent/components/Dialog";
import { NS_AI_AGENT } from "constant/index";
import { useTranslations } from "next-intl";
import { HeaderModal } from "./HeaderModal";
import Textarea from "./Textarea";

interface AddLinkModalProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  placeholder: string;
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const AddLinkModal = (props: AddLinkModalProps) => {
  const { title, description, icon, placeholder, open, onClose, onSubmit } =
    props;
  const t = useTranslations(NS_AI_AGENT);

  return (
    <Dialog
      title={
        <HeaderModal title={title} description={description} icon={icon} />
      }
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      submitText={t("knowledge.add")}
    >
      <Textarea
        placeholder={placeholder}
        minRows={4}
        sx={{
          backgroundColor: "background.default",
          border: "none",
          borderRadius: "4px",
          padding: "8px 20px",
          "&:focus": {
            outline: "none",
            borderBottom: "none",
          },
        }}
      />
    </Dialog>
  );
};
