import { Stack } from "@mui/material";
import FormLayout from "components/FormLayout";
import { NS_BUDGETING } from "constant/index";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

interface Props {
  open: boolean;
  onClose: () => void;
};

interface ExportFormData {
  documentFormat: string;
  orientation: string;
  pageSize: string;
  includeAttachments: string;
}

const defaultValues: ExportFormData = {
  documentFormat: 'PDF',
  orientation: 'portrait',
  pageSize: 'A4',
  includeAttachments: 'no'
}

export const ModalExportExpense = ({ open, onClose }: Props) => {
  const budgetT = useTranslations(NS_BUDGETING);

  const { register, control, handleSubmit, setValue, reset, watch } = useForm<ExportFormData>({
    defaultValues: defaultValues,
  });

  const onSubmit = (data: ExportFormData) => {
    console.log('data', data);
  };

  return (
    <>
      <FormLayout
        label={budgetT("dialog.exportView")}
        pending={false}
        submitWhenEnter={false}
        open={open}
        onClose={onClose}
        cancelText={budgetT("dialog.cancelBtnText")}
        submitText={budgetT("dialog.exportBtnText")}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack overflow="auto"></Stack>
      </FormLayout>
    </>
  );
};
