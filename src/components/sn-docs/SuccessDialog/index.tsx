import { Stack } from "@mui/material";
import DialogLayout from "components/DialogLayout";
import { Button, Text } from "components/shared";
import { NS_DOCS } from "constant/index";
import { useTranslations } from "next-intl";

interface ISuccessDialogProps {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
}

export default function SuccessDialog(props: ISuccessDialogProps) {
  const { open, title, subtitle, onClose } = props;
  const docsT = useTranslations(NS_DOCS);

  return (
    <DialogLayout
      open={open}
      onClose={onClose}
      sx={{ p: 0, width: { xs: "calc(100% - 48px)", sm: 480 } }}
      hasCloseButton={false}
      headerProps={{ sx: { display: "none" } }}
    >
      <Stack p={3} gap={3}>
        <Stack alignItems="center" gap={1}>
          <Text variant="h6" fontWeight={700}>
            {title}
          </Text>
          {subtitle && <Text variant="body2">{subtitle}</Text>}
        </Stack>
        <Button
          variant="primary"
          fullWidth
          sx={{
            background: "linear-gradient(-90deg, #2AF598 0%, #009EFD 100%)",
            "&:hover": {
              background: "linear-gradient(-90deg, #2AF598 0%, #009EFD 100%)",
              opacity: 0.9,
            },
          }}
          type="button"
          size="small"
          onClick={onClose}
        >
          <Text variant="body2" color="white" fontWeight={600}>
            {docsT("import.thirdparty.done")}
          </Text>
        </Button>
      </Stack>
    </DialogLayout>
  );
}
