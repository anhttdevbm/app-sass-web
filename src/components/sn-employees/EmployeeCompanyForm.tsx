import { memo, useMemo } from "react";
import Stack from "@mui/material/Stack";
import { useTranslations } from "next-intl";
import * as Yup from "yup";

import { AN_ERROR_TRY_AGAIN, NS_COMMON, NS_COMPANY } from "constant/index";
import { DataAction, Permission } from "constant/enums";
import { EMAIL_REGEX } from "constant/regex";
import { DialogLayoutProps } from "components/DialogLayout";
import FormLayout from "components/NewFormLayout";
import { NewInput as Input, NewSelect as Select } from "components/shared";
import { useFormik } from "hooks/useFormik";
import { useAuth, useSnackbar } from "store/app/selectors";
import { EmployeeData } from "store/company/actions";
import { usePositionOptions } from "store/global/selectors";
import { getMessageErrorByAPI } from "utils/index";

type EmployeeCompanyFormProps = {
  initialValues: EmployeeData;
  type: DataAction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: EmployeeData) => Promise<any>;
} & Omit<DialogLayoutProps, "children" | "onSubmit">;

const EmployeeCompanyForm = ({
  initialValues,
  type,
  onSubmit: onSubmitProps,
  onClose,
  ...rest
}: EmployeeCompanyFormProps) => {
  const { onAddSnackbar } = useSnackbar();
  const { user, onGetProfile } = useAuth();
  const companyT = useTranslations(NS_COMPANY);
  const commonT = useTranslations(NS_COMMON);

  const { options, onGetOptions, isFetching, totalPages, pageIndex, pageSize } =
    usePositionOptions();

  const label = useMemo(() => {
    switch (type) {
      case DataAction.CREATE:
        return commonT("createNew");
      case DataAction.UPDATE:
        return commonT("update");
      default:
        return "";
    }
  }, [commonT, type]);

  const onSubmit = async (values: EmployeeData) => {
    try {
      const newItem = await onSubmitProps(values);

      if (newItem) {
        onAddSnackbar(
          companyT("employees.notification.success", { label }),
          "success",
        );
        if (values?.email === user?.email) {
          onGetProfile();
        }
        onClose();
      } else {
        throw AN_ERROR_TRY_AGAIN;
      }
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit,
  });

  const onEndReached = () => {
    if (isFetching || (totalPages && pageIndex >= totalPages)) return;
    onGetOptions({ pageSize, pageIndex: pageIndex + 1 });
  };

  return (
    <FormLayout
      sx={{
        minWidth: { xs: "calc(100vw - 24px)", sm: 500 },
        maxWidth: { xs: "calc(100vw - 24px)", sm: 500 },
        minHeight: "auto",
      }}
      label={`${label} ${companyT("employees.key")}`}
      submitting={formik.isSubmitting}
      disabled={formik.isSubmitDisabled}
      onSubmit={formik.handleSubmit}
      onClose={onClose}
      {...rest}
    >
      <Stack spacing={2} py={3}>
        <Input
          title="Email"
          name="email"
          required
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values?.email}
          error={commonT(formik.touchedError("email"), {
            name: "Email",
          })}
          disabled={type === DataAction.UPDATE}
          rootSx={sxConfig.input}
        />
        <Stack direction="row" spacing={2}>
          <Select
            title="Permission"
            name="permission"
            options={Object.entries(Permission).map(([k, v]) => ({
              label: k,
              value: v,
            }))}
            fullWidth
            rootSx={sxConfig.input}
          />
          <Select
            options={options}
            title={commonT("position")}
            name="position"
            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values?.position}
            error={commonT(formik.touchedError("position"), {
              name: commonT("position"),
            })}
            fullWidth
            rootSx={sxConfig.input}
            onEndReached={onEndReached}
          />
        </Stack>
      </Stack>
    </FormLayout>
  );
};

export default memo(EmployeeCompanyForm);

export const validationSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .required("form.error.required")
    .matches(EMAIL_REGEX, "form.error.invalid"),
  position: Yup.string().required("form.error.required"),
});

const sxConfig = {
  input: {
    height: 50,
  },
};
