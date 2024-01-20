import { memo, useState } from "react";
import { Stack } from "@mui/material";
import ConfirmDialog, { ConfirmDialogProps } from "components/ConfirmDialog";
import { Employee } from "store/company/reducer";
import Avatar from "components/Avatar";
import { Text } from "components/shared";
import { useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI } from "utils/index";
import { AN_ERROR_TRY_AGAIN, NS_BLOG, NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import { BlogData } from "store/blog/actions";

type ApproveOrRejectConfirmProps = ConfirmDialogProps & {
  items?: BlogData[];
  action: string;
};

const ApproveOrRejectConfirm = (props: ApproveOrRejectConfirmProps) => {
  const { items = [], onSubmit: onSubmitProps, action, ...rest } = props;
  const commonT = useTranslations(NS_COMMON);  
  const blogT = useTranslations(NS_BLOG);

  const { onAddSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onSubmit = async () => {
    try {
      if (isSubmitting) return;
      setIsSubmitting(true);
      const ids = onSubmitProps && (await onSubmitProps());
      if (ids?.length) {
        onAddSnackbar(
          blogT("blogList.notification.success", { label: action }),
          "success",
        );
        props?.onClose();
      } else {
        onAddSnackbar( blogT(AN_ERROR_TRY_AGAIN),"error",);
        props?.onClose()
      }
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ConfirmDialog onSubmit={onSubmit} pending={isSubmitting} {...rest}>
      <Stack alignItems="center" spacing={2} my={3} flex={1}>
      </Stack>
    </ConfirmDialog>
  );
};

export default memo(ApproveOrRejectConfirm);
