import ConfirmDialog, { ConfirmDialogProps } from "components/ConfirmDialog";
import { AN_ERROR_TRY_AGAIN, NS_COMMON, NS_COMPANY } from "constant/index";
import { useTranslations } from "next-intl";
import { memo, useState } from "react";
import { useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI } from "utils/index";
import { ClientCompany } from "../type";

type DeleteConfirmProps = ConfirmDialogProps & {
  item?: ClientCompany;
};

const DeleteConfirm = (props: DeleteConfirmProps) => {
  const { item, onSubmit: onSubmitProps, ...rest } = props;
  const companyT = useTranslations(NS_COMPANY);
  const commonT = useTranslations(NS_COMMON);

  const { onAddSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onSubmit = async () => {
    try {
      if (isSubmitting) return;
      setIsSubmitting(true);
      const ids = onSubmitProps && (await onSubmitProps());

      if (ids?.length) {
        onAddSnackbar(
          companyT("employees.notification.success", {
            label: commonT("delete"),
          }),
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

  return <ConfirmDialog onSubmit={onSubmit} pending={isSubmitting} {...rest} />;
};

export default memo(DeleteConfirm);
