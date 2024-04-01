import { Stack } from "@mui/material";
import { DialogLayoutProps } from "components/DialogLayout";
import FormLayout from "components/FormLayout";
import { Input } from "components/shared";
import { DataAction } from "constant/enums";
import { AN_ERROR_TRY_AGAIN, NS_COMMON, NS_COMPANY } from "constant/index";
import { FormikErrors, useFormik } from "formik";
import { useTranslations } from "next-intl";
import { memo, useEffect, useMemo, useRef } from "react";
import { useAuth, useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI } from "utils/index";
import * as Yup from "yup";
import { ClientCompany } from "components/sn-client-companies/type";

type FormProps = {
  initialValues: ClientCompany;
  type: DataAction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: ClientCompany) => Promise<any>;
} & Omit<DialogLayoutProps, "children" | "onSubmit">;

const Form = (props: FormProps) => {
  const { initialValues, type, onSubmit: onSubmitProps, ...rest } = props;
  const { onAddSnackbar } = useSnackbar();
  const { user, onGetProfile } = useAuth();
  const companyT = useTranslations(NS_COMPANY);
  const commonT = useTranslations(NS_COMMON);
  const formRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const onSubmit = async (values: ClientCompany) => {
    try {
      const body: ClientCompany = {
        address: values.address,
        code: values.code,
        created_time: values.created_time,
        email: values.email,
        name: values.name,
        phone: values.phone,
        status: values.status,
        tax_code: values.tax_code,
        zip_code: values.zip_code,
        contact: {
          address: values?.contact?.address,
          avatar: values?.contact?.avatar,
          email: values?.contact?.email,
          name: values?.contact?.name,
          phone: values?.contact?.phone,
          position: values?.contact?.position,
          website: values?.contact?.website,
        }
      };
      const newItem = await onSubmitProps(body);
      if (newItem) {
        onAddSnackbar(
          companyT("clientCompany.notification.success", {
            label: companyT("clientCompany.duplicate"),
          }),
          "success",
        );
        if (values?.email === user?.email) {
          onGetProfile();
        }
        props.onClose();
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

  const touchedErrors = useMemo(() => {
    return Object.entries(formik.errors).reduce(
      (out: FormikErrors<ClientCompany>, [key, error]) => {
        if (formik.touched[key]) {
          out[key] = error;
        }
        return out;
      },
      {},
    );
  }, [formik.touched, formik.errors]);

  const disabled = useMemo(
    () =>
      !!Object.values(touchedErrors)?.length ||
      formik.isSubmitting ||
      !formik.dirty,
    [touchedErrors, formik.isSubmitting, formik.dirty],
  );

  useEffect(() => {
    setTimeout(() => document.body.click(), 5000);
  }, []);

  return (
    <FormLayout
      sx={{
        minWidth: { xs: "calc(100vw - 24px)", lg: 500 },
        maxWidth: { xs: "calc(100vw - 24px)", sm: 500 },
        minHeight: "auto",
      }}
      label={companyT("clientCompany.duplicateForm.title")}
      submitting={formik.isSubmitting}
      disabled={disabled}
      onSubmit={formik.handleSubmit}
      ref={formRef}
      {...rest}
    >
      <Stack spacing={2} py={3}>
        <Input
          title={companyT("clientCompany.duplicateForm.newName")}
          name="name"
          required
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values?.name}
          ref={inputRef}
          error={commonT(touchedErrors?.name, {
            name: companyT("clientCompany.companyName"),
          })}
          rootSx={sxConfig.input}
        />
      </Stack>
    </FormLayout>
  );
};

export default memo(Form);

export const validationSchema = Yup.object().shape({
  name: Yup.string().required("form.error.required"),
});

const sxConfig = {
  input: {
    height: 56,
  },
};
