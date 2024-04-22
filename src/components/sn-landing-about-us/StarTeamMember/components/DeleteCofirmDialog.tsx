import { memo, useState } from "react";
import { Stack } from "@mui/material";
import ConfirmDialog, { ConfirmDialogProps } from "components/ConfirmDialog";
import { Employee } from "store/company/reducer";
import Avatar from "components/Avatar";
import { Text } from "components/shared";
import { useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI } from "utils/index";
import { AN_ERROR_TRY_AGAIN, NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import { BlogData } from "store/blog/actions";

type DeleteConfirmProps = ConfirmDialogProps & {
  id?: string;
  action: string;
};
const DeleteCofirmDialog = (props: DeleteConfirmProps) => {
  const { id, onSubmit: onSubmitProps, action, ...rest } = props;
  const commonT = useTranslations(NS_COMMON);

  const { onAddSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onSubmit = async () => {
      try {
          if (isSubmitting) return;
          setIsSubmitting(true);
          const response = onSubmitProps && (await onSubmitProps());

          if (response) {
              onAddSnackbar(
                  commonT("notification.success", { label: action }),
                  "success",
              );
              props?.onClose();
          } else {
              throw AN_ERROR_TRY_AGAIN;
          }
      } catch (error) {
          onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
      } finally {
          setIsSubmitting(false);
      }
  };

  return (
      <ConfirmDialog onSubmit={onSubmit} pending={isSubmitting} {...rest}>
      </ConfirmDialog>
  );
};

export default memo(DeleteCofirmDialog);
